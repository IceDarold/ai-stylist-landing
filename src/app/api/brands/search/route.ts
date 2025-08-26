import { NextResponse } from "next/server";
import { searchBrands, Tier } from "@/lib/brands";

const rateMap = new Map<string, { count: number; time: number }>();
function rateLimit(ip: string, limit = 20, windowMs = 1_000) {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now - entry.time > windowMs) {
    rateMap.set(ip, { count: 1, time: now });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  if (!q || q.trim().length < 2)
    return NextResponse.json({ message: "q too short" }, { status: 400 });

  const tierParam = searchParams.get("tier") as Tier | null;
  const region = searchParams.get("region") || "ru";
  const limit = Math.min(parseInt(searchParams.get("limit") || "8", 10), 20);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  if (!rateLimit(ip))
    return NextResponse.json({ message: "Too many requests" }, { status: 429 });

  const items = searchBrands({ q, region, tier: tierParam || undefined, limit });
  return NextResponse.json({ items });
}
