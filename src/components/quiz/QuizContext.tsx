"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Quiz } from "./Quiz";

interface QuizContextValue {
  open: () => void;
  close: () => void;
}

const QuizContext = createContext<QuizContextValue | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const value: QuizContextValue = {
    open: () => setOpen(true),
    close: () => setOpen(false),
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
      {open && <Quiz onClose={() => setOpen(false)} />}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within QuizProvider");
  return ctx;
}
