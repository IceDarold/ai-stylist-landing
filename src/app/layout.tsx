import "./globals.css";
import "./styles/tokens.css"; // <- именно этот файл с твоими переменными/классами

import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { QuizProvider } from "@/components/QuizProvider";

export const metadata: Metadata = { /* ... как было ... */ };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-theme="light">
      <body className="bg-bg-base text-fg-primary font-sans antialiased">
        <QuizProvider>
          <Header />
          {children}
        </QuizProvider>
      </body>
    </html>
  );
}
