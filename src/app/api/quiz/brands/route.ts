import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase-server";
import { quizBrandsSchema } from "@/lib/validators";

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
    const json = await req.json();
    const parsed = quizBrandsSchema.safeParse(json);
    if (!parsed.success)
      return NextResponse.json({ ok: false, message: "Invalid payload" }, { status: 400 });
    const { quiz_id, favorite_brand_ids, custom_brand_names, auto_pick_brands } = parsed.data;

    if (!rateLimit(quiz_id))
      return NextResponse.json({ ok: false, message: "Too many requests" }, { status: 429 });

    if (favorite_brand_ids.length + custom_brand_names.length > 3)
      return NextResponse.json({ ok: false, message: "Too many brands" }, { status: 400 });

    const supabase = getAdminClient();

    if (auto_pick_brands) {
      await supabase.from("quiz_brand_selection").delete().eq("quiz_id", quiz_id);
      await supabase.from("quiz_custom_brands").delete().eq("quiz_id", quiz_id);
      await supabase.from("quiz_brand_flags").upsert({ quiz_id, auto_pick: true });
      return NextResponse.json({
        saved: { favorite_brand_ids: [], custom_brand_names: [], auto_pick_brands: true },
      });
    }

    if (favorite_brand_ids.length > 0) {
      const { data: brands, error: brandErr } = await supabase
        .from("brands")
        .select("id")
        .in("id", favorite_brand_ids)
        .eq("is_active", true);
      if (brandErr) throw brandErr;
      if (!brands || brands.length !== favorite_brand_ids.length)
        return NextResponse.json({ ok: false, message: "Invalid brand id" }, { status: 400 });
    }

    await supabase.from("quiz_brand_selection").delete().eq("quiz_id", quiz_id);
    await supabase.from("quiz_custom_brands").delete().eq("quiz_id", quiz_id);

    if (favorite_brand_ids.length > 0) {
      await supabase.from("quiz_brand_selection").insert(
        favorite_brand_ids.map((id, idx) => ({
          quiz_id,
          brand_id: id,
          source: "search",
          order_index: idx,
        }))
      );
    }

    if (custom_brand_names.length > 0) {
      await supabase.from("quiz_custom_brands").insert(
        custom_brand_names.map((name) => ({ quiz_id, name }))
      );
    }

    await supabase.from("quiz_brand_flags").upsert({ quiz_id, auto_pick: false });

    return NextResponse.json({
      saved: { favorite_brand_ids, custom_brand_names, auto_pick_brands: false },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, message: "Internal error" }, { status: 500 });
  }
}
