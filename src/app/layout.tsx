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

        {/* Yandex.Metrika */}
        <Script id="ym" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) { return; }
              }
              k=e.createElement(t),a=e.getElementsByTagName(t)[0];
              k.async=1;k.src=r;a.parentNode.insertBefore(k,a);
            })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=103876020', 'ym');

            ym(103876020, 'init', {
              ssr: true,
              webvisor: true,
              clickmap: true,
              ecommerce: 'dataLayer',
              accurateTrackBounce: true,
              trackLinks: true
            });
          `}
        </Script>
        {/* noscript-пиксель для случаев без JS */}
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/103876020"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </body>
    </html>
  );
}
