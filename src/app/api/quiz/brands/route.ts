import { NextResponse } from "next/server";
import { z } from "zod";
import { BRANDS } from "@/data/brands";

const schema = z.object({
  quiz_id: z.string().uuid(),
  favorite_brand_ids: z.array(z.string()).max(3).default([]),
  custom_brand_names: z.array(z.string().min(2).max(50)).max(3).default([]),
  auto_pick_brands: z.boolean().optional().default(false),
});

const store = new Map<string, { favorite_brand_ids: string[]; custom_brand_names: string[]; auto_pick_brands: boolean }>();
const rateMap = new Map<string, { count: number; time: number }>();

function rateLimit(key: string, limit = 5, windowMs = 60_000) {
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    const { quiz_id, favorite_brand_ids, custom_brand_names, auto_pick_brands } = parsed.data;

    if (!rateLimit(quiz_id)) return NextResponse.json({ message: "Too many requests" }, { status: 429 });

    if (auto_pick_brands) {
      store.set(quiz_id, { favorite_brand_ids: [], custom_brand_names: [], auto_pick_brands: true });
      return NextResponse.json({
        saved: { favorite_brand_ids: [], custom_brand_names: [], auto_pick_brands: true },
      });
    }

    const uniqIds = Array.from(new Set(favorite_brand_ids));
    const brands = uniqIds.map((id) => BRANDS.find((b) => b.id === id && b.is_active !== false));
    if (brands.some((b) => !b))
      return NextResponse.json({ message: "Invalid brand id" }, { status: 400 });

    const total = uniqIds.length + custom_brand_names.length;
    if (total > 3)
      return NextResponse.json({ message: "Too many brands" }, { status: 400 });

    store.set(quiz_id, {
      favorite_brand_ids: uniqIds,
      custom_brand_names,
      auto_pick_brands: false,
    });

    return NextResponse.json({
      saved: { favorite_brand_ids: uniqIds, custom_brand_names, auto_pick_brands: false },
    });
  } catch (e) {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

export function _getStore() {
  return store;
}
