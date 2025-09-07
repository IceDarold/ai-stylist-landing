import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { getAdminClient } from "@/lib/supabase-server";

type TGUser = {
  id: number;
  is_bot: boolean;
  first_name?: string;
  last_name?: string;
  username?: string;
};

type TGChat = {
  id: number;
  type: "private" | "group" | "supergroup" | "channel";
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
};

type TGMessage = {
  message_id: number;
  date: number;
  text?: string;
  from?: TGUser;
  chat: TGChat;
};

type TGUpdate = {
  update_id: number;
  message?: TGMessage;
  edited_message?: TGMessage;
  channel_post?: TGMessage;
  edited_channel_post?: TGMessage;
  // (others omitted)
};

async function sendMessage(chatId: number | string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  }).catch(() => {});
}

function ok() {
  // Telegram expects a 200 quickly
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  try {
    // Webhook secret check disabled by request.

    const update = (await req.json()) as TGUpdate;

    const message = update.message || update.edited_message || update.channel_post || update.edited_channel_post;
    if (!message) return ok();

    const chat = message.chat;
    const text = (message.text || "").trim();
    const cmdFull = text.split(/\s+/)[0]?.toLowerCase() || "";
    const cmd = cmdFull.split("@")[0]; // normalize '/cmd@botname' -> '/cmd'

    // basic log for debugging
    try {
      console.log("/api/tg update", { chatId: chat.id, type: chat.type, text });
    } catch {}

    // Only handle private chats for subscription flow
    if (chat.type !== "private") return ok();

    if (cmd === "/start") {
      await sendMessage(
        chat.id,
        [
          "👋 Привет! Я бот уведомлений сайта.",
          "",
          "Чтобы получать уведомления о новых лидах, отправьте команду /subscribe",
          "Чтобы отписаться — /unsubscribe",
        ].join("\n")
      );
      return ok();
    }

    if (cmd === "/subscribe" || cmd === "/subsribr") { // allow common typo
      const supabase = getAdminClient();
      const username = message.from?.username || chat.username || null;
      const first_name = message.from?.first_name || chat.first_name || null;
      const last_name = message.from?.last_name || chat.last_name || null;

      await supabase
        .from("tg_subscribers")
        .upsert({
          chat_id: chat.id,
          username: username || undefined,
          first_name: first_name || undefined,
          last_name: last_name || undefined,
          active: true,
          unsubscribed_at: null,
        }, { onConflict: "chat_id" });

      await sendMessage(chat.id, "✅ Подписка оформлена. Теперь вы получаете уведомления о новых лидах.");
      return ok();
    }

    if (cmd === "/unsubscribe") {
      const supabase = getAdminClient();
      await supabase
        .from("tg_subscribers")
        .update({ active: false, unsubscribed_at: new Date().toISOString() })
        .eq("chat_id", chat.id);

      await sendMessage(chat.id, "🛑 Вы отписались от уведомлений. В любой момент можно /subscribe снова.");
      return ok();
    }

    // Fallback help
    if (text.startsWith("/")) {
      await sendMessage(chat.id, "Доступные команды: /subscribe, /unsubscribe");
    }
    return ok();
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
