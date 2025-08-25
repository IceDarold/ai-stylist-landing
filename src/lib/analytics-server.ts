export async function captureEvent(name: string, properties?: Record<string, unknown>) {
  const id = process.env.YANDEX_METRICA_ID || process.env.NEXT_PUBLIC_YANDEX_METRICA_ID;
  if (!id) return;
  const url = new URL(`https://mc.yandex.ru/watch/${id}`);
  url.searchParams.set("event", name);
  if (properties) {
    url.searchParams.set("params", JSON.stringify(properties));
  }
  await fetch(url.toString()).catch(() => {});
}
