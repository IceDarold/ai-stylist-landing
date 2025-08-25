import Link from "next/link";

export default function ThanksPage() {
  return (
    <div className="container py-20 text-center">
      <h1 className="h1 mb-4">Спасибо за заявку!</h1>
      <p className="mb-6 text-lg">Мы получили ваши ответы и скоро свяжемся с вами.</p>
      <Link href="/" className="button primary">
        На главную
      </Link>
    </div>
  );
}
