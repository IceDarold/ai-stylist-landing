import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Stylist — Подбор образов по фото за 30 секунд",
  description:
    "Загрузите фото — получите 3 образа и капсулу с точными размерами и ссылками на покупку.",
  openGraph: {
    title: "AI Stylist — Подбор образов по фото",
    description:
      "3 образа за 30 секунд. Капсула «за Х ₽». Ссылки на покупку у партнёров.",
    url: "https://example.com",
    siteName: "AI Stylist",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
    type: "website"
  },
  robots: { index: true, follow: true },
  metadataBase: new URL("https://example.com")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        {children}
      </body>
    </html>
  );
}