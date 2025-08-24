"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const items = [
  { label: "Top", src: "/items/top-1.jpg" },
  { label: "Top", src: "/items/top-2.jpg" },
  { label: "Top", src: "/items/top-3.jpg" },
  { label: "Bottom", src: "/items/bottom-1.jpg" },
  { label: "Bottom", src: "/items/bottom-2.jpg" }
];

export function TryOn() {
  const [idx, setIdx] = useState(0);
  const current = useMemo(() => items[idx % items.length], [idx]);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % items.length), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="how" className="py-24">
      <div className="container grid items-center gap-12 md:grid-cols-[1.2fr_.8fr]">
        <div>
          <h2 className="font-serif text-4xl leading-tight">Virtual Try-On</h2>
          <p className="mt-4 max-w-xl text-black/70">
            Визуализация показывает, как сидят вещи на вашей фигуре, сохраняя позу и пропорции.
            Перебирайте варианты слева-направо — примерно раз в секунду.
          </p>
          <ul className="mt-6 list-disc pl-6 text-black/70">
            <li>Высокое качество визуализации</li>
            <li>Быстрее конкурентов</li>
            <li>Советы по размеру и фасону</li>
          </ul>
        </div>

        <div className="grid grid-cols-[1fr_auto] items-center gap-6">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-lg)] border border-black/10 bg-white">
            <Image
              src="/person.jpg"
              alt="Модель — пример посадки"
              fill
              sizes="(max-width: 768px) 90vw, 480px"
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col gap-6">
            <div className="relative w-40 overflow-hidden rounded-2xl border border-black/10 bg-white p-3 shadow-sm">
              <Image
                key={current.src}
                src={current.src}
                alt={current.label}
                width={260}
                height={320}
                className="mx-auto h-auto w-full animate-fade"
                priority
              />
              <div className="mt-2 text-center text-sm text-black/60">{current.label}</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: .0; transform: translateY(4px) } to { opacity: 1; transform: translateY(0)} }
        .animate-fade { animation: fadeIn 220ms ease-out; }
      `}</style>
    </section>
  );
}
