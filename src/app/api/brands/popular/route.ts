import { NextResponse } from "next/server";
import { BRANDS, BrandRecord } from "@/data/brands";
import { prepareBrands } from "@/lib/brand-utils";

if (!BRANDS[0].tokens) prepareBrands(BRANDS);

const cache = new Map<string, { expires: number; data: any }>();
const CACHE_TTL = 3_600_000; // 1 hour

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tier = url.searchParams.get("tier") as BrandRecord["tier"] | null;
  const region = url.searchParams.get("region") || "ru";
  const limit = Math.min(Number(url.searchParams.get("limit") || 16), 50);

  const cacheKey = `popular:${region}:${tier || "all"}:${limit}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return NextResponse.json(cached.data);

  const items = BRANDS.filter((b) => b.is_active !== false && (!tier || b.tier === tier))
    .sort((a, b) => (b.popularity?.[region] || 0) - (a.popularity?.[region] || 0))
    .slice(0, limit)
    .map((b) => ({ id: b.id, name: b.name, tier: b.tier, logo_url: b.logo_url }));

  const data = { items };
  cache.set(cacheKey, { data, expires: Date.now() + CACHE_TTL });
  return NextResponse.json(data);
}
