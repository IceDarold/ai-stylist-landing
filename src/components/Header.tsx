"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
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
      <header className="fixed top-0 left-0 z-50 w-full bg-white/80 backdrop-blur">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="flex items-center" aria-label="NEO">
            <Image
              src="/neo-logo.svg"
              alt="NEO"
              width={120}
              height={40}
              className="h-10 w-auto md:h-12"
              priority
            />
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
            <Link
              href="#cta"
              onClick={() => setMenuOpen(false)}
              className="button primary hidden md:inline-flex"
            >
              Попробовать бесплатно
            </Link>
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
              <Link
                href="#cta"
                className="button primary"
                onClick={() => setMenuOpen(false)}
              >
                Попробовать бесплатно
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
