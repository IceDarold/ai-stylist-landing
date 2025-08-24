import Image from "next/image";

export function HowItWorks() {
  return (
    <section className="py-24" aria-label="Как это работает">
      <div className="container text-center">
        <h2 className="font-serif text-4xl">Как это работает — 3 шага и готовые образы</h2>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {/* Шаг 1 */}
          <div className="flex flex-col items-center">
            <figure>
              <Image
                src="/person.jpg"
                alt="Пример фото пользователя"
                width={220}
                height={260}
                className="rounded-lg object-cover"
              />
              <figcaption className="mt-2 text-sm text-black/70">Можно без лица</figcaption>
            </figure>
            <p className="mt-4 text-black/80">Загрузите фото или введите рост и вес</p>
            <span className="badge neutral mt-2">&lt;30 секунд</span>
          </div>

          {/* Шаг 2 */}
          <div className="flex flex-col items-center">
            <div className="flex justify-center gap-2">
              <Image
                src="/items/person-1.png"
                alt="Образ 1"
                width={90}
                height={120}
                className="rounded-md object-cover"
              />
              <Image
                src="/items/person-2.png"
                alt="Образ 2"
                width={90}
                height={120}
                className="rounded-md object-cover"
              />
              <Image
                src="/items/person-3.png"
                alt="Образ 3"
                width={90}
                height={120}
                className="rounded-md object-cover"
              />
            </div>
            <p className="mt-4 text-black/80">
              AI-стилист собирает 3 персональных образа под вашу фигуру и бюджет
            </p>
            <span className="badge neutral mt-2">&lt;30 секунд</span>
          </div>

          {/* Шаг 3 */}
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-3 gap-2">
              {[
                "/items/top-1.jpg",
                "/items/bottom-1.jpg",
                "/items/top-2.jpg",
                "/items/bottom-2.jpg",
                "/items/top-3.jpg",
                "/items/bottom-3.jpg",
              ].map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt="Товар"
                  width={90}
                  height={120}
                  className="rounded-md object-cover"
                />
              ))}
            </div>
            <span className="badge brand mt-3">Капсула за 25 000 ₽</span>
            <p className="mt-4 text-black/80">
              Сразу переходите к покупке на маркетплейсах. 7 вещей = 20 сочетаний
            </p>
            <p className="mt-2 text-sm text-black/60">
              Доставка и возврат как обычно у WB/Ozon
            </p>
            <span className="badge neutral mt-2">&lt;30 секунд</span>
          </div>
        </div>

        {/* Слой доверия */}
        <div className="mt-16 flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 text-black/60">
            <span>WB</span>
            <span>Ozon</span>
            <span>Я.Маркет</span>
          </div>
          <p className="text-sm text-black/60">
            Фото хранятся ≤30 дней и удаляются по запросу
          </p>
          <button className="btn btn-primary mt-4">Получить мои 3 образа</button>
        </div>
      </div>
    </section>
  );
}

