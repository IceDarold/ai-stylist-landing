export function trackMetrica(event: string) {
  const id = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID;
  if (!id || process.env.NODE_ENV === "test") return;
  const url = new URL(`https://mc.yandex.ru/watch/${id}`);
  url.searchParams.set("event", event);
  fetch(url.toString()).catch(() => {});
}
