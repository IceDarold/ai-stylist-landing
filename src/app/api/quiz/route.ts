import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase-server";
import { notifyTG } from "@/lib/notify";
import { quizSchema } from "@/lib/validators";
import { trackMetrica } from "@/lib/metrica";

const rateMap = new Map<string, { count: number; time: number }>();
function rateLimit(ip: string, limit = 20, windowMs = 60_000) {
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
    const parsed = quizSchema.safeParse(json);
    if (!parsed.success)
      return NextResponse.json({ ok: false, message: "Invalid payload" }, { status: 400 });
    const { sessionId, email, answers, complete } = parsed.data;

    const supabase = getAdminClient();
    let leadId: string | undefined;
    if (email) {
      const { data: lead, error: leadErr } = await supabase
        .from("leads")
        .upsert({ email }, { onConflict: "email" })
        .select()
        .single();
      if (leadErr) throw leadErr;
      leadId = lead.id;
    }

    const { error: sessionErr } = await supabase
      .from("quiz_sessions")
      .upsert(
        { id: sessionId, lead_id: leadId, completed_at: complete ? new Date().toISOString() : null },
        {
          onConflict: "id",
          ignoreDuplicates: false,
        }
      );
    if (sessionErr) throw sessionErr;

    if (answers && answers.length > 0) {
      const { error: answersErr } = await supabase
        .from("quiz_answers")
        .insert(
          answers.map((a) => ({
            session_id: sessionId,
            question_key: a.key,
            answer: a.value,
          }))
        );
      if (answersErr) throw answersErr;
    }

    const eventName = complete ? "quiz_completed" : "quiz_step";
    const { error: eventErr } = await supabase
      .from("events")
      .insert({
        name: eventName,
        payload: { answers },
        lead_id: leadId,
        session_id: sessionId,
      });
    if (eventErr) throw eventErr;

    trackMetrica(eventName);

    if (complete) {
      await notifyTG(`✅ Квиз завершён${email ? `: ${email}` : ""} (${sessionId})`);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, message: "Internal error" }, { status: 500 });
  }
}
