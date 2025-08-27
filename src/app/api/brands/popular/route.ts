import { NextResponse } from "next/server";
import { popularBrands, Tier } from "@/lib/brands";

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tierParam = searchParams.get("tier") as Tier | null;
  const region = searchParams.get("region") || "ru";
  const limit = parseInt(searchParams.get("limit") || "16", 10);
  const items = popularBrands({ region, tier: tierParam || undefined, limit });
  return NextResponse.json({ items });
}
