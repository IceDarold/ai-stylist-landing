import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminClient } from "@/lib/supabase-server";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSession,
} from "@/lib/admin";
import { IMAGE_SLOTS } from "@/config/image-slots";

export const runtime = "nodejs";

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
]);

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!verifyAdminSession(token)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const form = await req.formData();
  const slotId = String(form.get("slotId") || "");
  const file = form.get("file") as File | null;

  if (!slotId || !(slotId in IMAGE_SLOTS)) {
    return new NextResponse("Unknown slotId", { status: 400 });
  }
  if (!file) return new NextResponse("No file", { status: 400 });
  if (!ALLOWED.has(file.type)) {
    return new NextResponse("Unsupported file type", { status: 415 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return new NextResponse("File too large (max 10MB)", { status: 413 });
  }

  const bucket = process.env.SUPABASE_ASSETS_BUCKET || "site-assets";
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return new NextResponse("Supabase is not configured", { status: 500 });
  }

  try {
    const supa = getAdminClient();
    const safeName = (file.name || "upload").replace(/[^a-zA-Z0-9_.-]/g, "_");
    const path = `slots/${slotId}/${Date.now()}-${safeName}`;

    const { error: upErr } = await supa.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "0",
        upsert: true,
        contentType: file.type,
      });
    if (upErr) return new NextResponse(upErr.message, { status: 500 });

    const { error: dbErr } = await supa
      .from("image_slots")
      .upsert(
        { slot_id: slotId, path, updated_at: new Date().toISOString() },
        { onConflict: "slot_id" }
      );
    if (dbErr) return new NextResponse(dbErr.message, { status: 500 });

    const pub = supa.storage.from(bucket).getPublicUrl(path).data.publicUrl;
    return NextResponse.json({ ok: true, url: pub });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return new NextResponse(message, { status: 500 });
  }
}
