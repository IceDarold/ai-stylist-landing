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
      <header className="bg-[#f5f5f5] backdrop-blur sticky top-0 z-50 w-full">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="flex items-center" aria-label="AIUTA">
            <span className="text-xl font-semibold">AIUTA</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-black/70 hover:text-black transition-colors flex items-center gap-1"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
                {item.dropdown && (
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="#book"
              onClick={() => setMenuOpen(false)}
              className="button secondary hidden md:inline-flex"
            >
              Book a demo
            </Link>
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Open menu"
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
                href="#book"
                className="button secondary"
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
