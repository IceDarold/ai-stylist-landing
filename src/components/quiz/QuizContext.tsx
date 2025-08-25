"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { QuizModal } from "./QuizModal";

interface QuizContextValue {
  open: boolean;
  openQuiz: () => void;
  closeQuiz: () => void;
}

const QuizCtx = createContext<QuizContextValue | null>(null);

export function useQuiz() {
  const ctx = useContext(QuizCtx);
  if (!ctx) throw new Error("QuizProvider missing");
  return ctx;
}

export function QuizProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openQuiz = () => setOpen(true);
  const closeQuiz = () => setOpen(false);

  return (
    <QuizCtx.Provider value={{ open, openQuiz, closeQuiz }}>
      {children}
      {open && <QuizModal onClose={closeQuiz} />}
    </QuizCtx.Provider>
  );
}
