"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// пути из /public
const persons = [
  "/items/person-1.png",
  "/items/person-2.png",
  "/items/person-3.png",
  "/items/person-4.png",
];
const tops = [
  "/items/top-1.jpg",
  "/items/top-2.jpg",
  "/items/top-3.jpg",
  "/items/top-4.jpg",
];
const bottoms = [
  "/items/bottom-1.jpg",
  "/items/bottom-2.jpg",
  "/items/bottom-3.jpg",
  "/items/bottom-4.jpg",
];

export function TryOn() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(id);
  }, []);

  const person = persons[tick % persons.length];
  const top = tops[tick % tops.length];
  const bottom = bottoms[tick % bottoms.length];

  return (
    <section id="how" className="py-28">
      {/* шире контейнер, чтобы всё стало крупнее */}
      <div className="mx-auto max-w-7xl rounded-[32px] bg-white p-6 md:p-12 ring-1 ring-black/5 shadow-[0_50px_80px_rgba(24,20,18,.06)] grid grid-cols-1 items-center gap-12 md:grid-cols-[1.1fr_.9fr]">

        {/* Текст слева */}
        <div>
          <h2 className="font-serif text-5xl leading-tight">Virtual Try-On</h2>
          <p className="mt-3 max-w-xl text-black/70">
            Визуализация показывает, как сидят вещи на вашей фигуре, сохраняя
            позу и пропорции. Варианты меняются примерно раз в секунду.
          </p>
          <ul className="mt-4 list-disc pl-6 text-black/70">
            <li>Высокое качество визуализации</li>
            <li>Быстрее конкурентов</li>
            <li>Советы по размеру и фасону</li>
          </ul>
        </div>

        {/* Визуализация справа */}
        <div className="relative grid grid-cols-[minmax(320px,1fr)_auto] items-center justify-items-center gap-10 md:gap-12">

          {/* PERSON — без рамок/фона, PNG будет на прозрачном */}
          <div className="relative aspect-[3/4] w-full max-w-[1060px] md:max-w-[640px] justify-self-center">
            <Image
              key={person}
              src={person}
              alt="Model"
              fill
              // object-contain, чтобы силуэт не обрезался
              className="object-contain animate-fade"
              priority
              sizes="(max-width:1968px) 890vw, 5200px"
            />
          </div>

          {/* ITEMS — прозрачные плитки, только подпись */}
          <div className="relative flex flex-col items-center gap-8 md:gap-10">
            {/* TOP */}
            <figure className="flex w-[190px] flex-col items-center">
              <Image
                key={top}
                src={top}
                alt="Top"
                width={220}
                height={260}
                className="h-auto w-full object-contain animate-fade rounded-2xl"
                priority
              />
              <figcaption className="mt-2 text-center text-sm text-black/70">
                Top
              </figcaption>
            </figure>

            {/* BOTTOM */}
            <figure className="flex w-[190px] flex-col items-center">
              <Image
                key={bottom}
                src={bottom}
                alt="Bottom"
                width={220}
                height={260}
                className="h-auto w-full object-contain animate-fade"
                priority
              />
              <figcaption className="mt-2 text-center text-sm text-black/70">
                Bottom
              </figcaption>
            </figure>
          </div>

          {/* ДЕКОРАТИВНЫЕ ТОЧЕЧНЫЕ ЛИНИИ (стрелки) */}
          {/* line-1.* положи в /public/line-1.png или .svg */}
          <Image
            src="/line-1.svg"
            alt=""
            aria-hidden
            width={220}
            height={18}
            className="pointer-events-none absolute -left-4 top-[20%] hidden md:block opacity-50"
          />
          <Image
            src="/line-1.svg"
            alt=""
            aria-hidden
            width={220}
            height={18}
            className="pointer-events-none absolute bottom-[20%] hidden md:block opacity-50 rotate-180"
          />
        </div>
      </div>

      {/* Анимация появления */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade {
          animation: fadeIn 220ms ease-out;
        }
      `}</style>
    </section>
  );
}
