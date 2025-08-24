import Image from "next/image";

export function HowItWorks() {
  return (
    <section className="py-20" aria-labelledby="how-title">
      <div className="container">
        <h2 id="how-title" className="text-center font-serif text-4xl">
          Как это работает — 3 шага и готовые образы
        </h2>

        <ol className="mt-12 grid gap-12 md:grid-cols-3">
          {/* Шаг 1 */}
          <li className="flex flex-col items-center text-center">
            <figure className="max-w-[220px]">
              <Image
                src="/person.jpg"
                alt="Фото без лица"
                width={220}
                height={280}
                className="h-auto w-full rounded-xl object-cover"
                priority
              />
              <figcaption className="mt-2 text-sm text-black/70">
                Можно без лица
              </figcaption>
            </figure>
            <p className="mt-4 text-black/70">
              Загрузите фото или введите рост и вес
            </p>
            <span className="mt-3 rounded-full bg-black/5 px-3 py-1 text-xs">
              ≤30 секунд
            </span>
          </li>

          {/* Шаг 2 */}
          <li className="flex flex-col items-center text-center">
            <div className="flex gap-3">
              <Image
                src="/items/person-1.png"
                alt="Образ 1"
                width={80}
                height={120}
                className="h-auto w-[80px] rounded-lg object-contain"
              />
              <Image
                src="/items/person-2.png"
                alt="Образ 2"
                width={80}
                height={120}
                className="h-auto w-[80px] rounded-lg object-contain"
              />
              <Image
                src="/items/person-3.png"
                alt="Образ 3"
                width={80}
                height={120}
                className="h-auto w-[80px] rounded-lg object-contain"
              />
            </div>
            <p className="mt-4 text-black/70">
              AI-стилист собирает 3 персональных образа под вашу фигуру и бюджет
            </p>
            <span className="mt-3 rounded-full bg-black/5 px-3 py-1 text-xs">
              ≤30 секунд
            </span>
          </li>

          {/* Шаг 3 */}
          <li className="flex flex-col items-center text-center">
            <div className="grid grid-cols-3 gap-2">
              <Image
                src="/items/top-1.jpg"
                alt="товар"
                width={80}
                height={80}
                className="h-20 w-20 rounded-md object-cover"
              />
              <Image
                src="/items/top-2.jpg"
                alt="товар"
                width={80}
                height={80}
                className="h-20 w-20 rounded-md object-cover"
              />
              <Image
                src="/items/top-3.jpg"
                alt="товар"
                width={80}
                height={80}
                className="h-20 w-20 rounded-md object-cover"
              />
              <Image
                src="/items/bottom-1.jpg"
                alt="товар"
                width={80}
                height={80}
                className="h-20 w-20 rounded-md object-cover"
              />
              <Image
                src="/items/bottom-2.jpg"
                alt="товар"
                width={80}
                height={80}
                className="h-20 w-20 rounded-md object-cover"
              />
              <Image
                src="/items/bottom-3.jpg"
                alt="товар"
                width={80}
                height={80}
                className="h-20 w-20 rounded-md object-cover"
              />
            </div>
            <span className="mt-2 rounded-full bg-black/5 px-3 py-1 text-xs">
              Капсула за 25 000 ₽
            </span>
            <p className="mt-4 text-black/70">
              Сразу переходите к покупке на маркетплейсах. 7 вещей = 20 сочетаний
            </p>
            <span className="mt-3 rounded-full bg-black/5 px-3 py-1 text-xs">
              ≤30 секунд
            </span>
          </li>
        </ol>

        {/* Слой доверия */}
        <div className="mt-12 flex items-center justify-center gap-6">
          <Image src="/wb.svg" alt="Wildberries" width={80} height={32} />
          <Image src="/ozon.svg" alt="Ozon" width={80} height={32} />
          <Image src="/ymarket.svg" alt="Я.Маркет" width={80} height={32} />
        </div>
        <p className="mt-4 text-center text-xs text-black/70">
          Фото хранятся ≤30 дней и удаляются по запросу
        </p>

        <div className="mt-8 text-center">
          <button className="btn btn-primary">Получить мои 3 образа</button>
        </div>
      </div>
    </section>
  );
}
