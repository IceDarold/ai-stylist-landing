"use client";

import { useEffect, useRef, useState } from "react";
import { useQuiz } from "./QuizProvider";
import { EditableImage } from "./EditableImage";

export function Hero() {
  const { open } = useQuiz();
  const [email, setEmail] = useState("");
  const emailValid = /\S+@\S+\.\S+/.test(email);
  const [showError, setShowError] = useState(false);

  return (
    <section id="hero" className="relative h-[100svh] min-h-[560px] w-full overflow-hidden">
        <EditableImage
            slotId="hero.bg"
            fallbackSrc="/hero.jpg"            
            alt=""
            priority
            fill
            containerClassName="absolute inset-0"
            className="object-cover"
        />
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
      <div className="relative z-10 container h-full flex flex-col items-start justify-center">
        <div className="flex flex-wrap gap-2">
          {["ИИ-стилист", "Для реальных людей", "Бесплатно"].map((text) => (
            <span
              key={text}
              className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-sm"
            >
              <span className="h-2 w-2 rounded-full bg-[var(--brand-600)]" />
              {text}
            </span>
          ))}
        </div>
        <h1 className="mt-4 max-w-2xl font-serif text-4xl md:text-5xl leading-[1.1]">
          Поможем одеться быстро и стильно
        </h1>
        <p className="mt-4 max-w-xl text-lg text-black/70">
          Загрузите фото и получите 3 образа за 30 секунд. С точными размерами и ссылками на покупку.
        </p>
        <div
          className={`mt-6 flex w-full max-w-md flex-col gap-2 sm:flex-row ${
            showError && !emailValid ? "shake" : ""
          }`}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ваш email"
            className={`input flex-1 ${showError && !emailValid ? "error" : ""}`}
          />
          <button
            className="button primary"
            onClick={() => {
              if (emailValid) open();
              else {
                setShowError(true);
                setTimeout(() => setShowError(false), 800);
              }
            }}
          >
            Попробовать бесплатно
          </button>
        </div>
      </div>
    </section>
  );
}
