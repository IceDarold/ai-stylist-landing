import type { FC } from "react";

type FAQItem = { q: string; a: string };

const items: FAQItem[] = [
  { q: "Что такое ИИ-стилист?", a: "ИИ-стилист – это сервис на основе искусственного интеллекта, который поможет персонализировано подобрать вам одежду или целые образы на основании ваших предпочтений, телосложения и бюджета." },
  { q: "Как подбирается одежда?", a: "Ваш персональный ИИ-стилист подбирает одежду под вашу фигуру, размеры, бюджет, и самое главное — вашу цель. Для этого нужно заполнить анкету и приложить фотографии." },
  { q: "Что входит в стоимость подписки?", a: "Подписка включает персональные подборки образов, рекомендации по стилю и доступ к онлайн-примерке." },
  { q: "Какими функциями можно пользоваться бесплатно?", a: "Бесплатно можно заполнить анкету и примерить несколько базовых образов в демо-режиме." },
  { q: "Что будет в анкете, которую мне надо будет заполнить?", a: "Анкета заполняется онлайн. В ней будут вопросы: какую задачу вы хотите решить, ваши размеры, пожелания по стилю, бюджет на вещь и т.д." },
  { q: "Как я могу купить подобранные вещи?", a: "Каждая вещь будет со ссылкой на маркетплейс или магазин, где ее можно заказать." },
  { q: "Можно ли сразу примерять несколько видов одежды?", a: "Да, Neo позволяет составлять различные образы, примеряя несколько вещей сразу." },
  { q: "Требуется ли специальная подготовка фотографии перед загрузкой для онлайн-примерки?", a: "Специальной подготовки не требуется, наш сервис поможет правильно подобрать ракурс фотографии для создания вашей личной реалистичной 3D модели, на которой и будет происходить примерка." },
  { q: "Этот сервис подойдет только девушкам?", a: "Нет, наш сервис подойдет и мужчинам, и женщинам независимо от возраста, роста и других параметров." },
  { q: "На какой результат я могу рассчитывать?", a: "ИИ-стилист может создавать образ с нуля или давать рекомендации на различные параметры: подбор цветов, помощь с уже существующим гардеробом, выбор одежды по случаю и современные модные тренды." }
];

export const FAQ: FC = () => {
  return (
    <section className="py-16">
      <div className="container max-w-3xl">
        <h2 className="text-center font-serif text-4xl">Есть вопросы? Мы рады ответить</h2>

        <div className="mt-8 divide-y divide-black/10">
          {items.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden"
            >
              <summary
                className="flex w-full cursor-pointer items-center justify-between list-none font-medium p-3
                           transition-colors hover:bg-black/5 group-open:bg-black/5"
              >
                <span>{item.q}</span>
                <svg
                  className="ml-4 h-5 w-5 shrink-0 transition-transform duration-[var(--timing-base)] group-open:rotate-180"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                </svg>
              </summary>

              {/* Контейнер-гармошка: плавно меняем 'высоту' через grid-rows */}
              <div
                className="mt-2 grid grid-rows-[0fr] overflow-hidden
                           transition-[grid-template-rows] duration-[var(--timing-base)]
                           ease-[var(--ease-smooth)]
                           group-open:grid-rows-[1fr] motion-reduce:transition-none"
              >
                {/* Внутренний блок, чтобы сработал 0fr → 1fr */}
                <div className="min-h-0 overflow-hidden">
                  <p
                    className="mb-0 text-black/70 opacity-0 translate-y-1
                               transition-[opacity,transform] duration-[var(--timing-slow)]
                               ease-[var(--ease-smooth)]
                               group-open:opacity-100 group-open:translate-y-0
                               motion-reduce:transition-none"
                  >
                    {item.a}
                  </p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
