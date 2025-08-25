import Link from "next/link";

export default function ThanksPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <h1 className="mb-4 text-3xl font-serif">Спасибо за заявку!</h1>
      <p className="mb-6 max-w-md text-lg text-black/70">
        Мы уже получили ваши ответы и скоро отправим подборку на указанный email.
      </p>
      <Link href="/" className="button">
        На главную
      </Link>
    </div>
  );
}
