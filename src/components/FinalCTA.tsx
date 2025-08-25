"use client";

import { useState } from "react";
import { useQuiz } from "./QuizProvider";

export function FinalCTA() {
  const { open } = useQuiz();
  const [email, setEmail] = useState("");

  const handleClick = () => open(email);

  return (
    <section id="cta" className="py-24">
      <div className="container text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mx-auto mb-4 h-8 w-10 rounded-md border border-black/10" aria-hidden />
          <h2 className="font-serif text-4xl">Присоединяйтесь</h2>
          <p className="mt-3 text-lg text-black/70">
            Ответьте на 6 вопросов и получите 3 образа.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <input
              type="email"
              placeholder="Ваш email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full max-w-xs"
            />
            <button
              className="button primary w-full max-w-xs"
              onClick={handleClick}
              disabled={!email}
            >
              Попробовать бесплатно
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

