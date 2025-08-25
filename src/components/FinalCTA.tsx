"use client";

import { useQuiz } from "./quiz/QuizContext";

export function FinalCTA() {
  const { openQuiz } = useQuiz();

  return (
    <section id="cta" className="py-24">
      <div className="container text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mx-auto mb-4 h-8 w-10 rounded-md border border-black/10" aria-hidden />
          <h2 className="font-serif text-4xl">Присоединяйтесь</h2>
          <p className="mt-3 text-lg text-black/70">
            Ответьте на 6 вопросов и получите подборку из 3 луков.
          </p>

          <button onClick={openQuiz} className="mx-auto mt-6 button primary">
            Получить 3 лука
          </button>
        </div>
      </div>
    </section>
  );
}
