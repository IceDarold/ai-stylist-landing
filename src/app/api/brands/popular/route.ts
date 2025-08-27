import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase-server";

type BrandItem = { id: string; name: string; tier: string; logo_url: string | null };
const cache = new Map<string, { data: BrandItem[]; expires: number }>();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "16", 10), 50);
  const tier = url.searchParams.get("tier") || null;
  const region = url.searchParams.get("region") || "ru";

  const key = `popular:${region}:${tier || "all"}:${limit}`;
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && cached.expires > now) return NextResponse.json({ items: cached.data });

  const supabase = getAdminClient();
  const { data, error } = await supabase.rpc("get_popular_brands", {
    p_region: region,
    p_tier: tier,
    lim: limit,
  });
  if (error) {
    console.error(error);
    return NextResponse.json({ ok: false, message: "Internal error" }, { status: 500 });
  }

  cache.set(key, { data: data || [], expires: now + 60 * 60 * 1000 });
  return NextResponse.json({ items: data || [] });
}
