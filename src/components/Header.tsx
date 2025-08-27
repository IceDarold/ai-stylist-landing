"use client";

import { useState } from "react";
import Link from "next/link";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { href: "#products", label: "Products" },
    { href: "#tech", label: "Our Proprietary Tech" },
    { href: "#company", label: "Company" },
    { href: "#resources", label: "Resources" },
  ];

  return (
    <>
      {/* Main header */}
      <header className="bg-white/80 backdrop-blur sticky top-0 z-50 w-full shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="text-xl font-semibold" aria-label="AIUTA">
            AIUTA
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
              href="#demo"
              onClick={() => setMenuOpen(false)}
              className="hidden md:inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white hover:bg-black/80"
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
                href="#demo"
                className="h-10 rounded-md bg-black px-4 text-sm font-medium text-white flex items-center justify-center hover:bg-black/80"
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
