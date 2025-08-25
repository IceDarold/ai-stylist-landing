"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";

/**
 * При скролле считаем прогресс внутри секции и «закрашиваем» N первых символов
 */
export function ScrollyCopy({
  text
}: {
  text: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0..1

  const letters = useMemo(() => text.split(""), [text]);
  const total = letters.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // старт анимации когда блок входит в экран; завершение — когда почти вышел
      const start = vh * 0.1;
      const end = vh * 0.9 + rect.height;
      const visible = Math.min(Math.max(vh - rect.top, 0), end);
      const p = Math.min(Math.max((visible - start) / (end - start), 0), 1);
      setProgress(p);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const coloredCount = Math.round(progress * total);

  return (
    <section id="about" className="py-28">
      <div className="container">
        <h2
          ref={ref}
          className="font-serif text-[clamp(32px,6vw,64px)] leading-[1.1]"
          aria-label={text}
        >
          {letters.map((ch, i) => (
            <span
              key={i}
              className={clsx(
                "transition-colors duration-200",
                i < coloredCount ? "text-black" : "text-black/15"
              )}
              aria-hidden="true"
            >
              {ch}
            </span>
          ))}
        </h2>
        <p className="mt-6 max-w-3xl text-lg text-black/70">
          Платформа подбирает капсулу под вашу фигуру и поводы, предлагает размеры и ссылки на
          покупку у партнёров. Без лишних анкет и «впаривания».
        </p>
      </div>
    </section>
  );
}
