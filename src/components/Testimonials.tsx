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
        <div className="mt-12 grid gap-8 md:grid-cols-3" aria-label="Отзывы клиентов">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="relative card pt-6 pr-6 pb-6 pl-16 before:content-[''] before:absolute before:-left-3 before:top-10 before:h-6 before:w-6 before:bg-[var(--bg-elev)] before:border before:border-[var(--border)] before:rotate-45 before:rounded-sm"
            >
              <Image
                src={t.avatar}
                alt={t.name}
                width={48}
                height={48}
                className="absolute -left-8 top-6 h-12 w-12 rounded-full object-cover z-10"
              />
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-black/70">{t.role}</div>
                <blockquote className="mt-4 text-black/70">{t.text}</blockquote>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

