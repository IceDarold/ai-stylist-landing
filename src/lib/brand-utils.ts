import type { BrandRecord } from "@/data/brands";

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

export function transliterate(input: string): string {
  return input
    .split("")
    .map((ch) => {
      const lower = ch.toLowerCase();
      const t = ruToEn[lower];
      if (!t) return ch;
      return t;
    })
    .join("");
}

export function normalize(input: string): string {
  return transliterate(input)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[.,'"\-_\//]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function prepareBrands(brands: BrandRecord[]) {
  for (const b of brands) {
    const tokens = new Set<string>();
    tokens.add(normalize(b.name));
    for (const a of b.aliases) tokens.add(normalize(a));
    b.tokens = Array.from(tokens);
  }
}

function trigrams(s: string): string[] {
  const padded = `  ${s} `;
  const arr: string[] = [];
  for (let i = 0; i < padded.length - 2; i++) {
    arr.push(padded.slice(i, i + 3));
  }
  return arr;
}

export function trigramSimilarity(a: string, b: string): number {
  const aTri = trigrams(a);
  const bTri = trigrams(b);
  const setA = new Set(aTri);
  const setB = new Set(bTri);
  let inter = 0;
  for (const t of setA) if (setB.has(t)) inter++;
  return (2 * inter) / (setA.size + setB.size);
}

export const tierWeight: Record<string, number> = {
  luxury: 2,
  premium: 1,
  mass: 0,
};
