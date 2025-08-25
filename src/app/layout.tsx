import "./globals.css";
import "./styles/tokens.css";

import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { QuizProvider } from "@/components/QuizProvider";
import { AnalyticsProvider } from "@/lib/analytics";
import Script from "next/script";

export const metadata: Metadata = { /* ... */ };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-theme="light">
      <body className="bg-bg-base text-fg-primary font-sans antialiased">
        <AnalyticsProvider>
          <QuizProvider>
            <Header />
            {children}
          </QuizProvider>
        </AnalyticsProvider>

        {/* Plausible */}
        <Script
          defer
          data-domain="neo-fashion-ai.ru"
          src="https://plausible.io/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`
            window.plausible = window.plausible || function () {
              (window.plausible.q = window.plausible.q || []).push(arguments);
            };
          `}
        </Script>
      </body>
    </html>
  );
}
