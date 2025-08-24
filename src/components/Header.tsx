"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b">
      <div className="bg-bg-elev text-xs">
        <div className="container">
          <div className="flex justify-center gap-6 overflow-x-auto whitespace-nowrap py-2">
            <span>Фото можно загрузить без лица</span>
            <span>Безопасные платежи: СБП, YooKassa</span>
            <span>Работаем с партнёрами: WB | Ozon | Я.Маркет</span>
          </div>
        </div>
      </div>

      <div className="container flex items-center justify-between py-3">
        <Link href="/">
          <Image src="/logo.svg" alt="Stylist AI" width={120} height={24} />
        </Link>

        <nav className="hidden md:flex gap-6">
          <Link href="#">Как это работает</Link>
          <Link href="#">Примеры образов</Link>
          <Link href="#">Тарифы</Link>
          <Link href="#">FAQ</Link>
          <Link href="#">Контакты</Link>
        </nav>

        <div className="flex items-center gap-3">
          <a href="#" className="button primary hidden md:inline-flex">
            Попробовать бесплатно
          </a>
          <button
            className="md:hidden"
            aria-label="Открыть меню"
            onClick={() => setOpen((o) => !o)}
          >
            <svg
              width="24"
              height="24"
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

      {open && (
        <div className="md:hidden border-t bg-bg-base">
          <nav className="container flex flex-col space-y-4 py-4">
            <Link href="#" onClick={() => setOpen(false)}>
              Как это работает
            </Link>
            <Link href="#" onClick={() => setOpen(false)}>
              Примеры образов
            </Link>
            <Link href="#" onClick={() => setOpen(false)}>
              Тарифы
            </Link>
            <Link href="#" onClick={() => setOpen(false)}>
              FAQ
            </Link>
            <Link href="#" onClick={() => setOpen(false)}>
              Контакты
            </Link>
            <a href="#" className="button primary" onClick={() => setOpen(false)}>
              Попробовать бесплатно
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

