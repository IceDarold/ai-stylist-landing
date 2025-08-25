"use client";

import { useEffect, useRef } from "react";
import { useQuiz } from "./QuizProvider";
import { track } from "@/lib/plausible";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { open } = useQuiz();

  useEffect(() => {
    // Автовоспроизведение тихого видео на iOS/desktop
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  return (
    <section className="relative h-[86vh] min-h-[560px] w-full overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-contain"
        src="/hero.mp4"
        playsInline
        autoPlay
        loop
        muted
        aria-label="Видеофон с процессом подбора одежды"
      />
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
      <div className="relative z-10 container h-full flex flex-col items-start justify-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-sm">
          <span className="h-2 w-2 rounded-full bg-[var(--brand-600)]" />
          ИИ-стилист для реальных людей
        </span>
        <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-[1.1]">
          Поможем одеться быстро и стильно
        </h1>
        <p className="mt-4 max-w-xl text-lg text-black/70">
          Загрузите фото и получите 3 образа за 30 секунд. С точными размерами и ссылками на покупку.
        </p>
        <button
          className="button primary mt-6"
          onClick={() => {
            track("cta_clicked", { placement: "hero" });
            open();
          }}
        >
          Попробовать бесплатно
        </button>
      </div>
    </section>
  );
}
