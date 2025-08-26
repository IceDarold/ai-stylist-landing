import { NextResponse } from "next/server";
import { brandSelectionSchema } from "@/lib/validators";
import { BRANDS, quizBrandSelections } from "@/lib/brands";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = brandSelectionSchema.safeParse(json);
    if (!parsed.success)
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });

    const { quiz_id, favorite_brand_ids, custom_brand_names, auto_pick_brands } =
      parsed.data;

    if (auto_pick_brands) {
      const saved = {
        favorite_brand_ids: [],
        custom_brand_names: [],
        auto_pick_brands: true,
      };
      quizBrandSelections.set(quiz_id, saved);
      return NextResponse.json({ saved });
    }

    const activeIds = new Set(BRANDS.filter((b) => b.is_active).map((b) => b.id));
    for (const id of favorite_brand_ids) {
      if (!activeIds.has(id))
        return NextResponse.json({ message: "Invalid brand id" }, { status: 400 });
    }

    const saved = {
      favorite_brand_ids,
      custom_brand_names,
      auto_pick_brands: false,
    };
    quizBrandSelections.set(quiz_id, saved);
    return NextResponse.json({ saved });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
