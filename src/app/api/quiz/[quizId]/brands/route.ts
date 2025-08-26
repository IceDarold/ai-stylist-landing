import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase-server";

export async function GET(req: Request, { params }: { params: { quizId: string } }) {
  const { quizId } = params;
  const supabase = getAdminClient();

  const { data: flag } = await supabase
    .from("quiz_brand_flags")
    .select("auto_pick")
    .eq("quiz_id", quizId)
    .maybeSingle();

  const { data: selections } = await supabase
    .from("quiz_brand_selection")
    .select("brand_id, order_index")
    .eq("quiz_id", quizId)
    .order("order_index", { ascending: true });

  const { data: customs } = await supabase
    .from("quiz_custom_brands")
    .select("name")
    .eq("quiz_id", quizId);

  return NextResponse.json({
    favorite_brand_ids: selections?.map((s) => s.brand_id) || [],
    custom_brand_names: customs?.map((c) => c.name) || [],
    auto_pick_brands: flag?.auto_pick || false,
  });
}
