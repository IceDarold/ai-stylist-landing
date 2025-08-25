import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase-server";
import { notifyTG } from "@/lib/notify";
import { subscribeSchema } from "@/lib/validators";

const rateMap = new Map<string, { count: number; time: number }>();

function rateLimit(ip: string, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now - entry.time > windowMs) {
    rateMap.set(ip, { count: 1, time: now });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    if (!rateLimit(ip))
      return NextResponse.json({ ok: false, message: "Too many requests" }, { status: 429 });

    const json = await req.json();
    const parsed = subscribeSchema.safeParse(json);
    if (!parsed.success)
      return NextResponse.json({ ok: false, message: "Invalid email" }, { status: 400 });
    const { email, source } = parsed.data;

    const supabase = getAdminClient();
    const { data: lead, error } = await supabase
      .from("leads")
      .upsert({ email }, { onConflict: "email" })
      .select()
      .single();
    if (error) throw error;

    await supabase.from("events").insert({
      name: "lead_submitted",
      payload: { source },
      lead_id: lead.id,
    });

    await notifyTG(`🆕 Новый лид: ${email}${source ? ` (${source})` : ""}`);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, message: "Internal error" }, { status: 500 });
  }
}
