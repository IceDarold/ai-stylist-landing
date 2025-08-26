import { NextResponse } from "next/server";
import { BRANDS, BrandRecord } from "@/data/brands";
import { normalize, prepareBrands, trigramSimilarity, tierWeight } from "@/lib/brand-utils";

// prepare tokens once
if (!BRANDS[0].tokens) prepareBrands(BRANDS);

const cache = new Map<string, { expires: number; data: any }>();
const CACHE_TTL = 600_000; // 10 min

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  const tier = url.searchParams.get("tier") as BrandRecord["tier"] | null;
  const region = url.searchParams.get("region") || "ru";
  const limit = Math.min(Number(url.searchParams.get("limit") || 8), 20);

  if (!q) return NextResponse.json({ message: "q is required" }, { status: 400 });
  const qNorm = normalize(q);
  if (qNorm.length < 2) return NextResponse.json({ message: "q too short" }, { status: 400 });

  const cacheKey = `search:${region}:${tier || "all"}:${qNorm}:${limit}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return NextResponse.json(cached.data);

  const items = BRANDS.filter((b) => b.is_active !== false && (!tier || b.tier === tier))
    .map((b) => {
      const tokens = b.tokens || [];
      const exact = tokens.includes(qNorm);
      const prefix = tokens.some((t) => t.startsWith(qNorm));
      let similarity = 0;
      for (const t of tokens) similarity = Math.max(similarity, trigramSimilarity(t, qNorm));
      const popularity = b.popularity?.[region] || 0;
      const score =
        10 * (exact ? 1 : 0) +
        6 * (prefix ? 1 : 0) +
        4 * similarity +
        2 * popularity +
        (tierWeight[b.tier] || 0);
      return { b, score, similarity, exact, prefix };
    })
    .filter((r) => r.exact || r.prefix || r.similarity >= 0.35)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => ({ id: r.b.id, name: r.b.name, tier: r.b.tier, logo_url: r.b.logo_url }));

  const data = { items };
  cache.set(cacheKey, { data, expires: Date.now() + CACHE_TTL });

  return NextResponse.json(data);
}
