export async function captureEvent(name: string, properties?: Record<string, unknown>) {
  const key = process.env.POSTHOG_API_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  const host =
    process.env.POSTHOG_API_HOST || process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com";
  await fetch(`${host}/capture/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: key,
      event: name,
      properties,
    }),
  }).catch(() => {});
}
