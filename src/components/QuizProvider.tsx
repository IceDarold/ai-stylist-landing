"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Quiz } from "./Quiz";

interface QuizContextValue {
  open: (email?: string) => void;
}

const QuizContext = createContext<QuizContextValue | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialEmail, setInitialEmail] = useState<string | undefined>();

  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      if (!localStorage.getItem("quiz_id")) {
        localStorage.setItem("quiz_id", `q_${Date.now()}`);
      }
    }
  }, [isOpen]);

  const open = (email?: string) => {
    setInitialEmail(email);
    setIsOpen(true);
  };

  return (
    <QuizContext.Provider value={{ open }}>
      {children}
      {isOpen && (
        <Quiz
          onClose={() => setIsOpen(false)}
          initialEmail={initialEmail}
        />
      )}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within QuizProvider");
  return ctx;
}

