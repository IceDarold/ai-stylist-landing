"use client";

import { useState } from "react";
import Link from "next/link";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { href: "#products", label: "Products", dropdown: true },
    { href: "#tech", label: "Our Proprietary Tech" },
    { href: "#company", label: "Company" },
    { href: "#resources", label: "Resources" },
  ];

  return (
    <>
      {/* Main header */}
      <header className="bg-zinc-100 sticky top-0 z-50 w-full">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="text-xl font-semibold" aria-label="Aiuta">
            AÏUTA
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-8 bg-white border rounded-full px-6 py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1 text-sm text-black/70 hover:text-black transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
                {item.dropdown && (
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 8 10 12 14 8" />
                  </svg>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="#demo"
              onClick={() => setMenuOpen(false)}
              className="hidden md:inline-flex items-center rounded-md border border-black px-4 py-2 text-sm hover:bg-black hover:text-white transition-colors"
            >
              Book a demo
            </Link>
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Open menu"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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
                href="#demo"
                className="button primary"
                onClick={() => setMenuOpen(false)}
              >
                Book a demo
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
