import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase-server";

export const revalidate = 30; // short cache

export async function GET() {
  try {
    const supabase = getAdminClient();
    // Try RPC first for random sampling
    const { data: rpcData, error: rpcErr } = await supabase
      .rpc("brands_random", { sample_count: 12 });
    if (!rpcErr && rpcData) return NextResponse.json(rpcData);

    // Fallback: fetch some and shuffle client-side
    const { data, error } = await supabase
      .from("brands")
      .select("id,name,logo_url")
      .limit(50);
    if (error) throw error;
    const shuffled = (data || []).sort(() => Math.random() - 0.5).slice(0, 12);
    return NextResponse.json(shuffled);
  } catch (e) {
    console.error(e);
    return NextResponse.json([], { status: 200 });
  }
}
