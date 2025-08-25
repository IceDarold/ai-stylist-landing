"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuiz } from "./QuizProvider";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { open } = useQuiz();

  const navItems = [
    { href: "#benefits", label: "Преимущества" },
    { href: "#how", label: "Как это работает" },
    { href: "#examples", label: "Примеры образов" },
    { href: "#faq", label: "FAQ" },
    { href: "#contacts", label: "Контакты" },
  ];

  return (
    <>
      {/* Main header */}
      <header className="bg-white/100 backdrop-blur sticky top-0 z-50 w-full">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="flex items-center" aria-label="Stylist AI">
            <Image src="/logo.svg" alt="Stylist AI" width={120} height={24} />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-black/70 hover:text-black transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setMenuOpen(false);
                open();
              }}
              className="button primary hidden md:inline-flex"
            >
              Попробовать бесплатно
            </button>
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Открыть меню"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="container flex flex-col gap-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-black/70 hover:text-black transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <button
                className="button primary"
                onClick={() => {
                  setMenuOpen(false);
                  open();
                }}
              >
                Попробовать бесплатно
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
