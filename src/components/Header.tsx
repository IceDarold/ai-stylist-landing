"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full">
      {/* Micro-trust bar */}
      <div className="bg-[var(--brand-50)] text-xs text-black/70">
        <div className="container flex gap-6 overflow-x-auto whitespace-nowrap py-2 md:justify-center">
          <span>Фото можно загрузить без лица</span>
          <span>Безопасные платежи: СБП, YooKassa</span>
          <span>Работаем с партнёрами: WB | Ozon | Я.Маркет</span>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b bg-white">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" aria-label="На главную">
            <Image src="/logo.svg" alt="Stylist AI" width={120} height={24} />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <Link href="#how-it-works">Как это работает</Link>
            <Link href="#examples">Примеры образов</Link>
            <Link href="#pricing">Тарифы</Link>
            <Link href="#faq">FAQ</Link>
            <Link href="#contacts">Контакты</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="#cta" className="btn btn-primary hidden md:inline-flex">
              Попробовать бесплатно
            </Link>
            <button
              className="md:hidden"
              aria-label="Меню"
              onClick={() => setOpen(!open)}
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t">
            <nav className="container flex flex-col gap-4 py-4 text-sm">
              <Link href="#how-it-works" onClick={() => setOpen(false)}>
                Как это работает
              </Link>
              <Link href="#examples" onClick={() => setOpen(false)}>
                Примеры образов
              </Link>
              <Link href="#pricing" onClick={() => setOpen(false)}>
                Тарифы
              </Link>
              <Link href="#faq" onClick={() => setOpen(false)}>
                FAQ
              </Link>
              <Link href="#contacts" onClick={() => setOpen(false)}>
                Контакты
              </Link>
              <Link
                href="#cta"
                className="btn btn-primary mt-2"
                onClick={() => setOpen(false)}
              >
                Попробовать бесплатно
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

