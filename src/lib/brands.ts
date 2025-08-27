export type Tier = "mass" | "premium" | "luxury";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  tier: Tier;
  logo_url: string;
  aliases: string[];
  is_active: boolean;
  popularity: Record<string, number>;
}

export const BRANDS: Brand[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Zara",
    slug: "zara",
    tier: "mass",
    logo_url: "https://cdn.example.com/zara.png",
    aliases: ["zara", "зара"],
    is_active: true,
    popularity: { ru: 100 },
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "COS",
    slug: "cos",
    tier: "premium",
    logo_url: "https://cdn.example.com/cos.png",
    aliases: ["cos", "косс"],
    is_active: true,
    popularity: { ru: 80 },
  },
];

const searchCache = new Map<string, { expires: number; items: Brand[] }>();
const popularCache = new Map<string, { expires: number; items: Brand[] }>();

const tierWeight: Record<Tier, number> = { mass: 0, premium: 1, luxury: 2 };

function transliterate(input: string): string {
  const map: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "c",
    ч: "ch",
    ш: "sh",
    щ: "sh",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
  };
  return input
    .split("")
    .map((c) => map[c] ?? c)
    .join("");
}

function normalize(str: string): string {
  return transliterate(
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[.,'"\-_\/]/g, "")
  )
    .replace(/\s+/g, " ")
    .trim();
}

function trigrams(s: string): Set<string> {
  const padded = `  ${s} `;
  const set = new Set<string>();
  for (let i = 0; i < padded.length - 2; i++) {
    set.add(padded.slice(i, i + 3));
  }
  return set;
}

function trigramSimilarity(a: string, b: string): number {
  const aSet = trigrams(a);
  const bSet = trigrams(b);
  let intersection = 0;
  for (const t of aSet) if (bSet.has(t)) intersection++;
  const union = aSet.size + bSet.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function searchBrands({
  q,
  region,
  tier,
  limit,
}: {
  q: string;
  region: string;
  tier?: Tier;
  limit: number;
}): Brand[] {
  const qNorm = normalize(q);
  const cacheKey = `${region}:${tier ?? "all"}:${qNorm}`;
  const now = Date.now();
  const cached = searchCache.get(cacheKey);
  if (cached && cached.expires > now) return cached.items;

  let candidates = BRANDS.filter((b) => b.is_active);
  if (tier) candidates = candidates.filter((b) => b.tier === tier);
  const scored: { brand: Brand; score: number }[] = [];
  for (const brand of candidates) {
    let bestScore = 0;
    const names = [brand.name, ...brand.aliases];
    for (const n of names) {
      const nNorm = normalize(n);
      if (nNorm === qNorm) {
        bestScore = Math.max(bestScore, 100);
      } else if (nNorm.startsWith(qNorm)) {
        bestScore = Math.max(bestScore, 60);
      } else {
        const sim = trigramSimilarity(nNorm, qNorm);
        if (sim >= 0.35) {
          bestScore = Math.max(bestScore, 40 * sim);
        }
      }
    }
    if (bestScore > 0) {
      bestScore += (brand.popularity[region] ?? 0) * 2;
      bestScore += tierWeight[brand.tier];
      scored.push({ brand, score: bestScore });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  const items = scored.slice(0, limit).map((s) => s.brand);
  searchCache.set(cacheKey, { expires: now + 600_000, items });
  return items;
}

export function popularBrands({
  region,
  tier,
  limit,
}: {
  region: string;
  tier?: Tier;
  limit: number;
}): Brand[] {
  const cacheKey = `${region}:${tier ?? "all"}:${limit}`;
  const now = Date.now();
  const cached = popularCache.get(cacheKey);
  if (cached && cached.expires > now) return cached.items;

  let items = BRANDS.filter((b) => b.is_active);
  if (tier) items = items.filter((b) => b.tier === tier);
  items = items.sort(
    (a, b) => (b.popularity[region] ?? 0) - (a.popularity[region] ?? 0)
  );
  items = items.slice(0, limit);
  popularCache.set(cacheKey, { expires: now + 3_600_000, items });
  return items;
}

export interface QuizBrandSelection {
  favorite_brand_ids: string[];
  custom_brand_names: string[];
  auto_pick_brands: boolean;
}

export const quizBrandSelections = new Map<string, QuizBrandSelection>();
