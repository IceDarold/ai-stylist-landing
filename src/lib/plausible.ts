declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
  }
}

export function track(event: string, props?: Record<string, unknown>) {
  if (process.env.NEXT_PUBLIC_DISABLE_ANALYTICS === "1") return;
  if (typeof window === "undefined") return;
  window.plausible?.(event, props ? { props } : undefined);
}
