"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Quiz } from "./Quiz";

interface QuizContextValue {
  open: () => void;
}

const QuizContext = createContext<QuizContextValue | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      if (!localStorage.getItem("quiz_id")) {
        localStorage.setItem("quiz_id", `q_${Date.now()}`);
      }
    }
  }, [isOpen]);

  return (
    <QuizContext.Provider value={{ open: () => setIsOpen(true) }}>
      {children}
      {isOpen && <Quiz onClose={() => setIsOpen(false)} />}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within QuizProvider");
  return ctx;
}

