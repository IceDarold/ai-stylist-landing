"use client";
import { useEffect } from "react";
import posthog from "posthog-js";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com",
      capture_pageview: true,
    });
  }, []);
  return <>{children}</>;
}
