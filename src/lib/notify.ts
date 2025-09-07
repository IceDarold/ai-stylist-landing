import { getAdminClient } from "@/lib/supabase-server";

export async function notifyTG(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return; // Not configured
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const supabase = getAdminClient();
  let chatIds: (string | number)[] = [];

  try {
    const { data } = await supabase
      .from("tg_subscribers")
      .select("chat_id")
      .eq("active", true);
    if (data && data.length > 0) {
      chatIds = data.map((r: any) => r.chat_id);
    }
  } catch {
    // ignore
  }

  if (chatIds.length === 0) {
    const fallbackChatId = process.env.TELEGRAM_CHAT_ID;
    if (fallbackChatId) chatIds = [fallbackChatId];
  }

  if (chatIds.length === 0) return;

  await Promise.allSettled(
    chatIds.map((chatId) =>
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      })
        .then(async (res) => {
          if (!res.ok) {
            // Optionally mark inactive on 403 (blocked)
            if (res.status === 403) {
              try {
                await supabase
                  .from("tg_subscribers")
                  .update({ active: false, unsubscribed_at: new Date().toISOString() })
                  .eq("chat_id", chatId);
              } catch {}
            }
          }
        })
        .catch(() => {})
    )
  );
}
