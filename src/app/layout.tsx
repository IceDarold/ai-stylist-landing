import "./globals.css";
import "./styles/tokens.css";

import type { Metadata } from "next";

export const metadata: Metadata = { /* ... */ };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Minimal root layout shared by all routes.
  // Group-specific layouts (e.g., (site)) add headers, analytics, providers.
  return (
    <html lang="ru" data-theme="light">
      <body className="bg-bg-base text-fg-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
