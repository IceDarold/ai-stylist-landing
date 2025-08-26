import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase-server";

const rateMap = new Map<string, { count: number; time: number }>();
function rateLimit(key: string, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const entry = rateMap.get(key);
  if (!entry || now - entry.time > windowMs) {
    rateMap.set(key, { count: 1, time: now });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

type BrandItem = { id: string; name: string; tier: string; logo_url: string | null };
const cache = new Map<string, { data: BrandItem[]; expires: number }>();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() || "";
  if (q.length < 2)
    return NextResponse.json({ ok: false, message: "Query too short" }, { status: 400 });

  const limit = Math.min(parseInt(url.searchParams.get("limit") || "8", 10), 20);
  const tier = url.searchParams.get("tier") || null;
  const region = url.searchParams.get("region") || "ru";

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  if (!rateLimit(ip))
    return NextResponse.json({ ok: false, message: "Too many requests" }, { status: 429 });

  const key = `search:${region}:${tier || "all"}:${q.toLowerCase()}`;
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && cached.expires > now) return NextResponse.json({ items: cached.data });

  const supabase = getAdminClient();
  const { data, error } = await supabase.rpc("search_brands", {
    q,
    lim: limit,
    p_tier: tier,
  });
  if (error) {
    console.error(error);
    return NextResponse.json({ ok: false, message: "Internal error" }, { status: 500 });
  }

  cache.set(key, { data: data || [], expires: now + 10 * 60 * 1000 });
  return NextResponse.json({ items: data || [] });
}
