export function track(event: string, props?: Record<string, unknown>) {
  if (process.env.NEXT_PUBLIC_DISABLE_ANALYTICS === "1") return;
  if (typeof window === "undefined") return;
  // @ts-expect-error Plausible is loaded via external script
  window.plausible?.(event, props ? { props } : undefined);
}

