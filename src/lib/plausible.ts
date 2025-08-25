export function track(event: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (process.env.NEXT_PUBLIC_DISABLE_ANALYTICS === "1") return;
  // @ts-expect-error plausible is injected via script
  window.plausible?.(event, props ? { props } : undefined);
}
