export function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--border)]" aria-label="Футер">
      <div className="container py-12 flex flex-col gap-12">
        <div className="flex items-center justify-between">
          <img src="/logo.svg" alt="Stylist AI" className="h-8" />
          <a href="#" className="button primary">Попробовать</a>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="font-semibold">Документы</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#">Политика конфиденциальности</a></li>
              <li><a href="#">Пользовательское соглашение</a></li>
              <li><a href="#">Политика обработки ПДн (152-ФЗ)</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Контакты</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>support@stylistai.ru</li>
              <li>+7 (495) XXX-XX-XX</li>
              <li>ООО «Стайлист.АИ», ИНН, ОГРН</li>
              <li>Адрес: Москва, ул. …</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Соцсети / Сообщество</h3>
            <ul className="mt-4 flex gap-4">
              <li>
                <a href="#" className="block h-6 w-6" aria-label="Telegram">
                  <img src="/telegram.svg" alt="Telegram" className="h-6 w-6" />
                </a>
              </li>
              <li>
                <a href="#" className="block h-6 w-6" aria-label="VK">
                  <img src="/vk.svg" alt="VK" className="h-6 w-6" />
                </a>
              </li>
              <li>
                <a href="#" className="block h-6 w-6" aria-label="YouTube Shorts">
                  <img src="/youtubeshorts.svg" alt="YouTube Shorts" className="h-6 w-6" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <details>
            <summary className="cursor-pointer text-sm font-medium">Безопасно ли загружать фото?</summary>
            <p className="mt-2 text-sm text-black/70">Да, ваши изображения обрабатываются безопасно.</p>
          </details>
          <details>
            <summary className="cursor-pointer text-sm font-medium">Сколько стоит подписка?</summary>
            <p className="mt-2 text-sm text-black/70">У нас есть бесплатный и премиум тарифы.</p>
          </details>
          <details>
            <summary className="cursor-pointer text-sm font-medium">Где доступно сейчас?</summary>
            <p className="mt-2 text-sm text-black/70">Сервис работает по всему миру.</p>
          </details>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-4">
            <span className="flex h-10 w-24 items-center justify-center rounded bg-white/70 text-sm">Wildberries</span>
            <span className="flex h-10 w-24 items-center justify-center rounded bg-white/70 text-sm">Ozon</span>
            <span className="flex h-10 w-24 items-center justify-center rounded bg-white/70 text-sm">Я.Маркет</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="flex h-10 w-24 items-center justify-center rounded bg-white/70 text-sm">СБП</span>
            <span className="flex h-10 w-24 items-center justify-center rounded bg-white/70 text-sm">YooKassa</span>
            <span className="flex h-10 w-24 items-center justify-center rounded bg-white/70 text-sm">CloudPayments</span>
          </div>
        </div>
        <p className="text-center text-sm text-black/50">© 2024 Stylist AI. Все права защищены.</p>
      </div>
    </footer>
  );
}
