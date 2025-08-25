"use client";

import Script from "next/script";
import type { ReactNode } from "react";

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const id = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID;
  return (
    <>
      {id && (
        <>
          <Script id="yandex-metrica" strategy="afterInteractive">
            {`
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
              ym(${id}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true });
            `}
          </Script>
          <noscript>
            <div>
              <img
                src={`https://mc.yandex.ru/watch/${id}`}
                style={{ position: "absolute", left: "-9999px" }}
                alt=""
              />
            </div>
          </noscript>
        </>
      )}
      {children}
    </>
  );
}

