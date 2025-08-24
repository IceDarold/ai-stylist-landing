"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="w-full">
      {/* Micro-trust bar */}
      <div className="bg-[var(--bg-elev)] text-sm">
        <div className="container overflow-x-auto whitespace-nowrap py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-6">
            <span>Фото можно загрузить без лица</span>
            <span>Безопасные платежи: СБП, YooKassa</span>
            <span>Работаем с партнёрами: WB | Ozon | Я.Маркет</span>
          </div>
        </div>
      </div>
      {/* Main header */}
      <div className="bg-[var(--bg-elev)]">
        <div className="container flex items-center justify-between py-3">
          <Link href="/" className="flex items-center" aria-label="Stylist AI">
            <Image src="/logo.svg" alt="Stylist AI" width={120} height={32} />
          </Link>
          <a href="#try" className="button primary">Попробовать бесплатно</a>
        </div>
      </div>
      {/* Navigation */}
      <nav className="border-t border-[var(--border)] bg-[var(--bg-elev)]">
        <div className="container relative flex items-center justify-end py-3">
          <ul className="hidden md:flex gap-8">
            <li><a href="#how">Как это работает</a></li>
            <li><a href="#examples">Примеры образов</a></li>
            <li><a href="#pricing">Тарифы</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#contacts">Контакты</a></li>
          </ul>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden inline-flex items-center justify-center p-2"
            aria-label="Меню"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
          {open && (
            <div className="absolute left-0 top-full w-full border-t border-[var(--border)] bg-[var(--bg-elev)] md:hidden">
              <ul className="flex flex-col gap-4 p-4">
                <li><a href="#how">Как это работает</a></li>
                <li><a href="#examples">Примеры образов</a></li>
                <li><a href="#pricing">Тарифы</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#contacts">Контакты</a></li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

