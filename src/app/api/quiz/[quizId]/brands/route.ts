import { NextResponse } from "next/server";
import { quizBrandSelections } from "@/lib/brands";

export function GET(
  req: Request,
  context: { params: { quizId: string } }
) {
  const { quizId } = context.params;
  const saved =
    quizBrandSelections.get(quizId) || {
      favorite_brand_ids: [],
      custom_brand_names: [],
      auto_pick_brands: false,
    };
  return NextResponse.json(saved);
}
