import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-50 mt-16">
      <div className="container py-10 space-y-10">
        {/* Top row with logo and CTA */}
        <div className="flex items-center">
          <Image src="/logo.svg" alt="Stylist AI" width={120} height={24} />
        </div>

        {/* Columns */}
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-semibold mb-2">Документы</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="#">Политика конфиденциальности</Link>
              </li>
              <li>
                <Link href="#">Пользовательское соглашение</Link>
              </li>
              <li>
                <Link href="#">Политика обработки ПДн (152-ФЗ)</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Контакты</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="mailto:support@stylistai.ru">support@stylistai.ru</a>
              </li>
              <li>
                <a href="tel:+7495XXXXXXX">+7 (495) XXX-XX-XX</a>
              </li>
              <li>ООО «Стайлист.АИ», ИНН, ОГРН</li>
              <li>Адрес: Москва, ул. …</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Соцсети / Сообщество</h3>
            <div className="flex gap-4">
              <Link href="#" aria-label="Telegram">
                <Image src="/icons/telegram.svg" alt="Telegram" width={24} height={24} />
              </Link>
              <Link href="#" aria-label="VK">
                <Image src="/icons/vk.svg" alt="VK" width={24} height={24} />
              </Link>
              <Link href="#" aria-label="YouTube Shorts">
                <Image src="/icons/youtubeshorts.svg" alt="YouTube Shorts" width={24} height={24} />
              </Link>
            </div>
          </div>
        </div>

        {/* Mini FAQ */}
        <div className="flex flex-col gap-4">

          {/* Trust bar */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-black/70">
              <span>Wildberries</span>
              <span>Ozon</span>
              <span>Я.Маркет</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-black/70">
              <span>СБП</span>
              <span>YooKassa</span>
              <span>CloudPayments</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t pt-6 text-center text-sm text-black/60">
          © 2024 Stylist AI. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
