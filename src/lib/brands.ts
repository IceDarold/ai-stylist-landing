import type { Brand } from "@/components/quiz/FavoriteBrandsStep";

export type BrandRecord = Brand & {
  aliases: string[];
  is_active?: boolean;
  popularity?: Record<string, number>;
};

export const BRANDS_DB: BrandRecord[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Zara",
    tier: "mass",
    aliases: ["zara", "зара", "zarra"],
    logo_url: "https://cdn.example.com/zara.png",
    is_active: true,
    popularity: { ru: 5, en: 3 },
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "COS",
    tier: "premium",
    aliases: ["cos", "cos stores", "косс", "koss"],
    logo_url: "https://cdn.example.com/cos.png",
    is_active: true,
    popularity: { ru: 4, en: 2 },
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    name: "Gucci",
    tier: "luxury",
    aliases: ["gucci", "гуччи"],
    logo_url: "https://cdn.example.com/gucci.png",
    is_active: true,
    popularity: { ru: 3, en: 3 },
  },
];

const tierWeight: Record<Brand["tier"], number> = {
  mass: 0,
  premium: 1,
  luxury: 2,
};

const searchCache = new Map<string, { items: Brand[]; expires: number }>();
const popularCache = new Map<string, { items: Brand[]; expires: number }>();

// --- utils ---

const ruToEn: Record<string, string> = {
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
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

function transliterate(str: string) {
  return str
    .split("")
    .map((c) => ruToEn[c] || ruToEn[c.toLowerCase()] || c)
    .join("");
}

function normalize(str: string) {
  return transliterate(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[.,'"\-_\/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string) {
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = Math.min(dp[i - 1][j - 1], dp[i][j - 1], dp[i - 1][j]) + 1;
    }
  }
  return dp[a.length][b.length];
}

function similarity(a: string, b: string) {
  const len = Math.max(a.length, b.length);
  if (len === 0) return 1;
  return 1 - levenshtein(a, b) / len;
}

// --- core ---

export function searchBrands({
  q,
  tier,
  region = "ru",
  limit = 8,
}: {
  q: string;
  tier?: Brand["tier"];
  region?: string;
  limit?: number;
}): Brand[] {
  const norm = normalize(q);
  if (norm.length < 2) return [];
  const cacheKey = `${region}:${tier || "all"}:${norm}:${limit}`;
  const cached = searchCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return cached.items;

  const items = BRANDS_DB.filter(
    (b) => b.is_active !== false && (!tier || b.tier === tier)
  ).map((b) => {
    const aliasNorms = b.aliases.map(normalize);
    let score = 0;
    if (aliasNorms.includes(norm)) score += 10;
    else if (aliasNorms.some((a) => a.startsWith(norm))) score += 6;
    const trig = Math.max(...aliasNorms.map((a) => similarity(a, norm)));
    if (trig >= 0.35) score += 4 * trig;
    const pop = b.popularity?.[region] ?? 0;
    score += 2 * pop;
    score += tierWeight[b.tier];
    return { brand: b, score };
  });

  const results = items
    .filter((i) => i.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(limit, 20))
    .map(({ brand }) => ({
      id: brand.id,
      name: brand.name,
      tier: brand.tier,
      logo_url: brand.logo_url,
    }));

  searchCache.set(cacheKey, { items: results, expires: Date.now() + 600_000 });
  return results;
}

export function popularBrands({
  tier,
  region = "ru",
  limit = 16,
}: {
  tier?: Brand["tier"];
  region?: string;
  limit?: number;
}): Brand[] {
  const cacheKey = `${region}:${tier || "all"}:${limit}`;
  const cached = popularCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return cached.items;

  const items = BRANDS_DB.filter(
    (b) => b.is_active !== false && (!tier || b.tier === tier)
  )
    .sort(
      (a, b) => (b.popularity?.[region] || 0) - (a.popularity?.[region] || 0)
    )
    .slice(0, limit)
    .map((b) => ({
      id: b.id,
      name: b.name,
      tier: b.tier,
      logo_url: b.logo_url,
    }));

  popularCache.set(cacheKey, { items, expires: Date.now() + 3600_000 });
  return items;
}

// --- quiz storage ---

export interface QuizState {
  favorite_brand_ids: string[];
  custom_brand_names: string[];
  auto_pick_brands: boolean;
}

const quizStore = new Map<string, QuizState>();

export function saveQuizBrands({
  quiz_id,
  favorite_brand_ids = [],
  custom_brand_names = [],
  auto_pick_brands = false,
}: {
  quiz_id: string;
  favorite_brand_ids?: string[];
  custom_brand_names?: string[];
  auto_pick_brands?: boolean;
}): { state?: QuizState; error?: string } {
  if (!quiz_id) return { error: "quiz_id required" };

  favorite_brand_ids = favorite_brand_ids.filter(Boolean);
  custom_brand_names = custom_brand_names.filter(Boolean);

  if (auto_pick_brands) {
    const state: QuizState = {
      favorite_brand_ids: [],
      custom_brand_names: [],
      auto_pick_brands: true,
    };
    quizStore.set(quiz_id, state);
    return { state };
  }

  if (favorite_brand_ids.length + custom_brand_names.length > 3)
    return { error: "limit exceeded" };

  for (const id of favorite_brand_ids) {
    const exists = BRANDS_DB.find((b) => b.id === id && b.is_active !== false);
    if (!exists) return { error: "invalid brand id" };
  }

  for (const name of custom_brand_names) {
    const n = name.trim();
    if (n.length < 2 || n.length > 50) return { error: "invalid custom brand" };
    if (/\p{Extended_Pictographic}/u.test(n))
      return { error: "invalid custom brand" };
  }

  const state: QuizState = {
    favorite_brand_ids,
    custom_brand_names,
    auto_pick_brands: false,
  };
  quizStore.set(quiz_id, state);
  return { state };
}

export function getQuizBrands(quiz_id: string): QuizState {
  return (
    quizStore.get(quiz_id) || {
      favorite_brand_ids: [],
      custom_brand_names: [],
      auto_pick_brands: false,
    }
  );
}

