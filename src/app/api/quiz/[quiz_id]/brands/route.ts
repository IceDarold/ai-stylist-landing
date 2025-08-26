import { NextResponse } from "next/server";
import { _getStore } from "@/app/api/quiz/brands/route";

export async function GET(
  req: Request,
  { params }: { params: { quiz_id: string } }
) {
  const { quiz_id } = params;
  const store = _getStore();
  const data = store.get(quiz_id) || {
    favorite_brand_ids: [],
    custom_brand_names: [],
    auto_pick_brands: false,
  };
  return NextResponse.json(data);
}
