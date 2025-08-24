import Image from "next/image";

const looks = [
  "/items/person-1.png",
  "/items/person-2.png",
  "/items/person-3.png"
];

const products = [
  "/items/top-1.jpg",
  "/items/bottom-1.jpg",
  "/items/top-2.jpg",
  "/items/bottom-2.jpg",
  "/items/top-3.jpg",
  "/items/bottom-3.jpg"
];

export function HowItWorks() {
  return (
    <section className="py-16">
      <div className="container text-center">
        <h2 className="font-serif text-4xl md:text-5xl">
          Как это работает — 3 шага и готовые образы
        </h2>

        <ol className="mt-12 grid gap-12 md:grid-cols-3">
          <li className="flex flex-col items-center">
            <figure className="relative w-full max-w-xs">
              <Image
                src="/person.jpg"
                alt="Пример входного фото"
                width={320}
                height={420}
                className="rounded-2xl object-cover"
              />
              <figcaption className="mt-2 text-sm text-black/70">
                Можно без лица
              </figcaption>
            </figure>
            <span className="badge neutral mt-2">≤30 секунд</span>
            <p className="mt-4 text-black/70">
              Загрузите фото или введите рост и вес
            </p>
          </li>

          <li className="flex flex-col items-center">
            <div className="flex gap-3">
              {looks.map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt="Пример образа"
                  width={120}
                  height={160}
                  className="rounded-xl object-cover"
                />
              ))}
            </div>
            <span className="badge neutral mt-2">≤30 секунд</span>
            <p className="mt-4 text-black/70">
              AI-стилист собирает 3 персональных образа под вашу фигуру и бюджет
            </p>
          </li>

          <li className="flex flex-col items-center">
            <div className="grid grid-cols-3 gap-2">
              {products.map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt="Пример товара"
                  width={100}
                  height={120}
                  className="rounded-lg object-cover"
                />
              ))}
            </div>
            <span className="badge brand mt-3">Капсула за 25 000 ₽</span>
            <span className="badge neutral mt-2">≤30 секунд</span>
            <p className="mt-4 text-black/70">
              Сразу переходите к покупке на маркетплейсах. 7 вещей = 20 сочетаний
            </p>
          </li>
        </ol>

        <div className="mt-16 flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 opacity-70">
            <span className="text-sm font-semibold">WB</span>
            <span className="text-sm font-semibold">Ozon</span>
            <span className="text-sm font-semibold">Я.Маркет</span>
          </div>
          <p className="text-sm text-black/60">
            Фото хранятся ≤30 дней и удаляются по запросу
          </p>
          <button className="btn btn-primary mt-2">
            Получить мои 3 образа
          </button>
        </div>
      </div>
    </section>
  );
}

