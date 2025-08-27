import { NextResponse } from "next/server";
import { saveQuizBrands } from "@/lib/brands";

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
  const json = await req.json().catch(() => null);
  if (!json) return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  const { quiz_id } = json;
  if (!quiz_id)
    return NextResponse.json({ message: "quiz_id required" }, { status: 400 });

  if (!rateLimit(quiz_id))
    return NextResponse.json({ message: "Too many requests" }, { status: 429 });

  const { favorite_brand_ids, custom_brand_names, auto_pick_brands } = json;
  const { state, error } = saveQuizBrands({
    quiz_id,
    favorite_brand_ids,
    custom_brand_names,
    auto_pick_brands,
  });
  if (error)
    return NextResponse.json({ message: error }, { status: 400 });
  return NextResponse.json({ saved: state });
}
