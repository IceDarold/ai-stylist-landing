export type Brand = {
  id: string;
  name: string;
  tier: "mass" | "premium" | "luxury";
  logo_url?: string;
};

export const BRANDS: Brand[] = [
  // Mass
  { id: "zara", name: "Zara", tier: "mass" },
  { id: "hm", name: "H&M", tier: "mass" },
  { id: "uniqlo", name: "Uniqlo", tier: "mass" },
  { id: "bershka", name: "Bershka", tier: "mass" },
  { id: "pullbear", name: "Pull&Bear", tier: "mass" },
  { id: "stradivarius", name: "Stradivarius", tier: "mass" },
  { id: "mango", name: "Mango", tier: "mass" },
  { id: "oysho", name: "Oysho", tier: "mass" },
  { id: "reserved", name: "Reserved", tier: "mass" },
  { id: "massimodutti", name: "Massimo Dutti", tier: "premium" },

  // Premium
  { id: "cos", name: "COS", tier: "premium" },
  { id: "allsaints", name: "AllSaints", tier: "premium" },
  { id: "sandro", name: "Sandro", tier: "premium" },
  { id: "maje", name: "Maje", tier: "premium" },
  { id: "arket", name: "Arket", tier: "premium" },
  { id: "clubmonaco", name: "Club Monaco", tier: "premium" },
  { id: "thekooples", name: "The Kooples", tier: "premium" },
  { id: "tommyhilfiger", name: "Tommy Hilfiger", tier: "premium" },
  { id: "calvinklein", name: "Calvin Klein", tier: "premium" },
  { id: "ralphlauren", name: "Ralph Lauren", tier: "premium" },

  // Luxury
  { id: "gucci", name: "Gucci", tier: "luxury" },
  { id: "prada", name: "Prada", tier: "luxury" },
  { id: "dior", name: "Dior", tier: "luxury" },
  { id: "ysl", name: "Saint Laurent", tier: "luxury" },
  { id: "balenciaga", name: "Balenciaga", tier: "luxury" },
  { id: "burberry", name: "Burberry", tier: "luxury" },
  { id: "bottega", name: "Bottega Veneta", tier: "luxury" },
  { id: "fendi", name: "Fendi", tier: "luxury" },
  { id: "lv", name: "Louis Vuitton", tier: "luxury" },
  { id: "hermes", name: "Hermès", tier: "luxury" },
];

export function searchBrands(q: string, limit = 12): Brand[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  const res = BRANDS.filter(
    (b) => b.name.toLowerCase().includes(query) || b.id.includes(query)
  );
  return res.slice(0, limit);
}

export function popularByTier(tier: Brand["tier"], limit = 12): Brand[] {
  return BRANDS.filter((b) => b.tier === tier).slice(0, limit);
}

