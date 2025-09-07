import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase-server";

export const revalidate = 60;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    if (!q.trim()) {
      // If no query, return some random populars for dropdown on focus
      const supabase = getAdminClient();
      const { data } = await supabase.rpc("brands_random", { sample_count: 12 });
      return NextResponse.json(data || []);
    }
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("brands")
      .select("id,name,logo_url")
      .ilike("name", `%${q}%`)
      .limit(12);
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (e) {
    console.error(e);
    return NextResponse.json([]);
  }
}
