"use client";

import { useState } from "react";
import { useQuiz } from "@/components/quiz/QuizContext";

export function FinalCTA() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState<string>("");
  const { open } = useQuiz();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("loading");
    setMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Ошибка");
      setState("ok");
      setMsg("Готово! Мы сообщим о релизе и раннем доступе.");
      setEmail("");
    } catch (err: unknown) {
      setState("err");
      setMsg(err instanceof Error ? err.message : "Что-то пошло не так");
    }
  };

  return (
    <section id="cta" className="py-24">
      <div className="container text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mx-auto mb-4 h-8 w-10 rounded-md border border-black/10" aria-hidden />
          <h2 className="font-serif text-4xl">Присоединяйтесь</h2>
          <p className="mt-3 text-lg text-black/70">
            Оставьте почту и получите ранний доступ + персональную капсулу.
          </p>

          <form onSubmit={submit} className="mx-auto mt-6 flex max-w-xl items-center justify-center gap-3">
            <input
              className="input"
              id="email"
              name="email"
              type="email"
              placeholder="Введите ваш email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email для подписки"
            />
            <button disabled={state === "loading"} className="button primary" type="submit">
              {state === "loading" ? "Отправка..." : "Подписаться"}
            </button>
          </form>

          {msg && (
            <div
              role="status"
              className={`mx-auto mt-3 max-w-xl text-sm ${
                state === "ok" ? "text-green-700" : "text-red-700"
              }`}
            >
              {msg}
            </div>
          )}

          <button onClick={open} className="button primary mt-6" type="button">
            Получить 3 лука
          </button>
        </div>
      </div>
    </section>
  );
}
