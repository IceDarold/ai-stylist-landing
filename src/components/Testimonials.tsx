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
            <figure key={t.name} className="card text-left space-y-4">
              <blockquote className="text-black/70">{t.text}</blockquote>
              <figcaption className="flex items-center gap-4">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-black/70">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

