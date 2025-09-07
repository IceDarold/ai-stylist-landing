import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase-server";
import { getFallbackForSlot } from "@/config/image-slots";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ slotId: string }> }
) {
  const { slotId } = await ctx.params;
  const fallback = getFallbackForSlot(slotId);
  if (!fallback) {
    return NextResponse.json({ error: "Unknown slot" }, { status: 404 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_ASSETS_BUCKET || "site-assets";

  if (!url || !key) {
    // Supabase not configured — serve fallback
    return NextResponse.json({ url: fallback });
  }

  try {
    const supa = getAdminClient();
    const { data, error } = await supa
      .from("image_slots")
      .select("path")
      .eq("slot_id", slotId)
      .maybeSingle();

    if (error || !data?.path) {
      return NextResponse.json({ url: fallback });
    }

    const pub = supa.storage.from(bucket).getPublicUrl(data.path);
    return NextResponse.json({ url: pub.data.publicUrl || fallback });
  } catch {
    return NextResponse.json({ url: fallback });
  }
}
