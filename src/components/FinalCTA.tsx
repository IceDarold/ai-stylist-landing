"use client";

import { useQuiz } from "./QuizProvider";
import { track } from "@/lib/plausible";

export function FinalCTA() {
  const { open } = useQuiz();
  return (
    <section id="cta" className="py-24">
      <div className="container text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mx-auto mb-4 h-8 w-10 rounded-md border border-black/10" aria-hidden />
          <h2 className="font-serif text-4xl">Присоединяйтесь</h2>
          <p className="mt-3 text-lg text-black/70">
            Ответьте на 6 вопросов и получите 3 образа.
          </p>
          <button
            className="button primary mt-6"
            onClick={() => {
              track("cta_clicked", { placement: "final_cta" });
              open();
            }}
          >
            Попробовать бесплатно
          </button>
        </div>
      </div>
    </section>
  );
}

