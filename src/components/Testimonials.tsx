import Image from "next/image";

type Testimonial = {
  name: string;
  role: string;
  text: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Сара Левин",
    role: "продакт-менеджер из Парижа",
    text: "Сервис развивается с каждым годом. Люблю, что можно получить совет по стилю сразу, как только нужна помощь.",
    avatar: "/person.jpg",
  },
  {
    name: "Самуэль Уилсон",
    role: "креативный директор в DCD",
    text: "Главное в Stylist AI — его вдохновение. Это как иметь личного стилиста в кармане.",
    avatar: "/person.jpg",
  },
  {
    name: "Алекс Леркинс",
    role: "основатель Pet Studio",
    text: "Мы строим сообщество вокруг моды, и сервис помогает оставаться на связи и делиться образами.",
    avatar: "/person.jpg",
  },
];

export function Testimonials() {
  return (
    <section className="py-24">
      <div className="container">
        <h2 className="font-serif text-4xl text-center">Нас любят клиенты</h2>
        <div className="mt-12 space-y-8" aria-label="Отзывы клиентов">
          {testimonials.map((t, i) => {
            const reversed = i % 2 === 1;
            return (
              <div
                key={t.name}
                className={`flex items-start gap-4 ${reversed ? "flex-row-reverse text-right" : ""}`}
              >
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div
                  className={`relative bg-gray-100 p-4 rounded-2xl max-w-md ${
                    reversed ? "rounded-tr-none" : "rounded-tl-none"
                  }`}
                >
                  <blockquote className="text-black/70">{t.text}</blockquote>
                  <div className="mt-4">
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-sm text-black/70">{t.role}</div>
                  </div>
                  <span
                    className={`absolute top-6 ${
                      reversed ? "right-0 translate-x-full" : "left-0 -translate-x-full"
                    } border-y-8 border-y-transparent ${
                      reversed ? "border-l-8 border-l-gray-100" : "border-r-8 border-r-gray-100"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

