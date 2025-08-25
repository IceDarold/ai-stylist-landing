"use client";

import { useEffect, useRef, useState } from "react";
import { useQuiz } from "./QuizProvider";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { open } = useQuiz();
  const [email, setEmail] = useState("");

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
        <div className="mt-6 flex w-full max-w-md flex-col gap-2 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ваш email"
            className="input flex-1"
          />
          <button className="button primary" onClick={open}>
            Попробовать бесплатно
          </button>
        </div>
      </div>
    </section>
  );
}
