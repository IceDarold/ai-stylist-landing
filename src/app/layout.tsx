import "./globals.css";
import "./styles/tokens.css"; // <- именно этот файл с твоими переменными/классами

import type { Metadata } from "next";

export const metadata: Metadata = { /* ... как было ... */ };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-theme="light">
      <body className="bg-bg-base text-fg-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
