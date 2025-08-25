"use client";

import { useState } from "react";
import { useQuiz } from "./QuizProvider";

export function FinalCTA() {
  const { open } = useQuiz();
  const [email, setEmail] = useState("")
  const emailValid = /\S+@\S+\.\S+/.test(email);
  const [showError, setShowError] = useState(false);
  return (
    <section id="cta" className="py-24">
      <div className="container text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mx-auto mb-4 h-8 w-10 rounded-md border border-black/10" aria-hidden />
          <h2 className="font-serif text-4xl">Присоединяйтесь</h2>
          <p className="mt-3 text-lg text-black/70">
            Ответьте на 6 вопросов и получите 3 образа.
          </p>
          <div
            className={`mt-6 mx-auto flex w-full max-w-md flex-col gap-2 sm:flex-row ${
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
      </div>
    </section>
  );
}

