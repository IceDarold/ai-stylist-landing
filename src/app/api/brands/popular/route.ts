import { NextResponse } from "next/server";
import { popularBrands } from "@/lib/brands";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tier = searchParams.get("tier") as
    | "mass"
    | "premium"
    | "luxury"
    | null;
  const region = searchParams.get("region") || "ru";
  const limitParam = searchParams.get("limit") || "16";
  const limit = Math.min(50, Math.max(1, parseInt(limitParam, 10)));

  const items = popularBrands({ tier: tier || undefined, region, limit });
  return NextResponse.json({ items });
}
