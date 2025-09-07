"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export function HowItWorks() {
  // Используем 3 подготовленных изображения без обрезания
  const stepImages = [
    { src: "/how_it_works/1.jpg", alt: "Загрузите фото" },
    { src: "/how_it_works/2.jpg", alt: "AI-стилист подбирает образы" },
    { src: "/how_it_works/3.jpg", alt: "Готовая капсула вещей" },
  ];

  // Набор сменяющихся картинок в середине
  const looks = [
    "/items/person-1.png",
    "/items/person-2.png",
    "/items/person-3.png",
    "/items/person-4.png",
  ];
  const [lookIndex, setLookIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setLookIndex((i) => (i + 1) % looks.length);
    }, 3000); // смена каждые 3 секунды
    return () => clearInterval(id);
  }, []);

  return (
    <section id="how" className="py-24" aria-labelledby="hiw-title">
      <div className="container">
        <h2 id="hiw-title" className="text-center font-serif text-3xl md:text-4xl">
          Как это работает — 3 шага и готовые образы
        </h2>

        <div className="mt-12 grid gap-12 md:grid-cols-3" aria-label="Как это работает">
          {/* Шаг 1 */}
          <div className="flex flex-col items-start">
            <figure className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#EEE7DD]">
              <Image
                src={stepImages[0].src}
                alt={stepImages[0].alt}
                fill
                className="object-contain"
                sizes="(max-width:768px) 100vw, 33vw"
                priority
              />
              <figcaption className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
                Можно без лица
              </figcaption>
            </figure>
            <p className="mt-4 text-lg font-medium">
              Загрузите фото или введите рост и вес
            </p>
            <span className="badge neutral mt-2">&lt;30 секунд</span>
          </div>

          {/* Шаг 2 */}
          <div className="flex flex-col items-start">
            {/* фрейм той же высоты, что и слева */}
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-[#EEE7DD]">
              <Image
                key={looks[lookIndex]}
                src={looks[lookIndex]}
                alt={stepImages[1].alt}
                fill
                className="object-contain transition-opacity duration-700"
                sizes="(max-width:768px) 100vw, 33vw"
                priority={false}
              />
            </div>
            <p className="mt-4 text-lg font-medium">
              AI-стилист собирает 3 персональных образа
            </p>
            <span className="badge neutral mt-2">&lt;30 секунд</span>
          </div>

          {/* Шаг 3 */}
          <div className="flex flex-col items-start">
            {/* такой же фрейм */}
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-[#EEE7DD]">
              <Image
                src={stepImages[2].src}
                alt={stepImages[2].alt}
                fill
                className="object-contain"
                sizes="(max-width:768px) 100vw, 33vw"
              />
              <span className="badge brand absolute left-2 top-2 z-10">
                Капсула за 25 000 ₽
              </span>
            </div>
            <p className="mt-4 text-lg font-medium">
              Сразу переходите к покупке
            </p>
            <span className="badge neutral mt-2">&lt;30 секунд</span>
          </div>
        </div>

        {/* Партнёры */}
        <div className="mt-16 flex items-center justify-center gap-6 opacity-70">
          <Image src="/partners/wb.svg" alt="Wildberries" width={80} height={24} />
          <Image src="/partners/ozon.svg" alt="Ozon" width={80} height={24} />
          <Image src="/partners/yamarket.svg" alt="Я.Маркет" width={100} height={24} />
        </div>

        <p className="mt-4 text-center text-sm text-black/60">
          Фото хранятся ≤30 дней и удаляются по запросу
        </p>

        <div className="mt-8 text-center">
          <a href="#cta" className="button primary">
            Получить мои 3 образа
          </a>
        </div>
      </div>
    </section>
  );
}
