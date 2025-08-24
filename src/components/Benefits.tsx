type Benefit = {
  title: string;
  text: string;
};

const benefits: Benefit[] = [
  {
    title: "Сэкономьте время",
    text: "3 готовых образа за 30 секунд + капсула из 7–12 вещей."
  },
  {
    title: "Точная посадка",
    text: "Совет по размеру и фасону под ваш рост и телосложение."
  },
  {
    title: "Покупка в 2–3 клика",
    text: "Ссылки на WB/Озон/Я.Маркет — без дополнительной регистрации."
  }
];

export function Benefits() {
  return (
    <section className="py-16">
      <div className="container grid gap-6 md:grid-cols-3" aria-label="Что вы получите">
        {benefits.map((b) => (
          <div key={b.title} className="card">
            <h3 className="text-2xl font-semibold">{b.title}</h3>
            <p className="mt-3 text-black/70">{b.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
