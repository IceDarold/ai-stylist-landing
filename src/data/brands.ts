export type BrandTier = "mass" | "premium" | "luxury";

export interface BrandRecord {
  id: string;
  name: string;
  slug: string;
  tier: BrandTier;
  aliases: string[];
  logo_url?: string;
  is_active?: boolean;
  popularity?: Record<string, number>; // region -> score
  tokens?: string[]; // normalized search tokens, filled at runtime
}

export const BRANDS: BrandRecord[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Zara",
    slug: "zara",
    tier: "mass",
    aliases: ["zara", "зара"],
    logo_url: undefined,
    is_active: true,
    popularity: { ru: 100 },
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "COS",
    slug: "cos",
    tier: "premium",
    aliases: ["cos", "косс", "cos stores"],
    logo_url: undefined,
    is_active: true,
    popularity: { ru: 80 },
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    name: "Gucci",
    slug: "gucci",
    tier: "luxury",
    aliases: ["gucci", "гуччи"],
    logo_url: undefined,
    is_active: true,
    popularity: { ru: 90 },
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    name: "H&M",
    slug: "h-m",
    tier: "mass",
    aliases: ["h&m", "hm", "эйчэм"],
    logo_url: undefined,
    is_active: true,
    popularity: { ru: 70 },
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    name: "Prada",
    slug: "prada",
    tier: "luxury",
    aliases: ["prada", "прада"],
    logo_url: undefined,
    is_active: true,
    popularity: { ru: 85 },
  },
];
