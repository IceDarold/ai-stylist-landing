import Link from "next/link";

export default function ThanksPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="mb-4 text-2xl font-semibold">Спасибо за заявку!</h1>
      <p>Мы свяжемся с вами по электронной почте в ближайшее время.</p>
      <Link href="/" className="mt-6 text-sm text-blue-600 underline">
        Вернуться на главную
      </Link>
    </main>
  );
}
