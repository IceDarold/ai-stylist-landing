import "./globals.css";
import "./styles/tokens.css";

import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { QuizProvider } from "@/components/QuizProvider";
import Script from "next/script";

export const metadata: Metadata = { /* ... */ };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-theme="light">
      <body className="bg-bg-base text-fg-primary font-sans antialiased">
        <QuizProvider>
          <Header />
          {children}
        </QuizProvider>

        {process.env.NEXT_PUBLIC_DISABLE_ANALYTICS !== "1" && (
          <>
            <Script
              defer
              data-domain="neo-fashion-ai.ru"
              src="https://plausible.io/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js"
              strategy="afterInteractive"
            />

            <Script id="plausible-init" strategy="afterInteractive">
              {`
                window.plausible = window.plausible || function() {
                  (window.plausible.q = window.plausible.q || []).push(arguments)
                }
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
