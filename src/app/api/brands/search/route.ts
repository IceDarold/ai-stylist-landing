import { NextResponse } from "next/server";
import { searchBrands } from "@/lib/brands";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const tier = searchParams.get("tier") as
    | "mass"
    | "premium"
    | "luxury"
    | null;
  const region = searchParams.get("region") || "ru";
  const limitParam = searchParams.get("limit") || "8";
  const limit = Math.min(20, Math.max(1, parseInt(limitParam, 10)));

  if (!q) return NextResponse.json({ message: "q required" }, { status: 400 });
  const norm = q.trim();
  if (norm.length < 2)
    return NextResponse.json({ message: "q too short" }, { status: 400 });

  const items = searchBrands({ q: norm, tier: tier || undefined, region, limit });
  return NextResponse.json({ items });
}
