import { headers } from "next/headers";

export async function track(
  event: string,
  { url, props }: { url: string; props?: Record<string, unknown> }
) {
  if (process.env.NEXT_PUBLIC_DISABLE_ANALYTICS === "1") return;
  try {
    await fetch("https://plausible.io/api/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "neo-fashion-ai-backend",
        "X-Forwarded-For": headers().get("x-forwarded-for") ?? "",
      },
      body: JSON.stringify({
        name: event,
        url,
        domain: "neo-fashion-ai.ru",
        props,
      }),
    });
  } catch {
    // ignore errors
  }
}
