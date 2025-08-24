import Image from "next/image";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Levin",
    role: "Project manager @ Pixels",
    quote:
      "It has just a gradual development over the years. Last year was 'All You Need Is Love'. This year's 'Give Peace a Chance' 'Remember love'. If you want to get peace, you can get it as soon as you like if we all pull together.",
  },
  {
    name: "Samuel Willison",
    role: "Creative director @ DC agency",
    quote:
      "The principal element of Suprematism in painting, as in architecture, is its liberation from all that is superfluous, from objectivity. Through Suprematism, art reaches its pure and unapplied form.",
  },
  {
    name: "Alex Lerkins",
    role: "Founder of Prel App Studio",
    quote:
      "We've just built stuff because we thought it was cool. We never had the money, let alone having conversations with my friends where we thought we were somebody. We knew someone is gonna build something that all of a sudden makes it so that people can stay connected with their friends and their family.",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <h2 className="text-center text-3xl font-semibold mb-12">
          Our Clients Love Us
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="card flex flex-col items-center text-center gap-4">
              <Image
                src="/person.jpg"
                alt={t.name}
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
              <blockquote className="text-black/70 text-sm">{t.quote}</blockquote>
              <figcaption className="flex flex-col gap-1">
                <div className="font-semibold">{t.name}</div>
                <div className="text-black/50 text-sm">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
