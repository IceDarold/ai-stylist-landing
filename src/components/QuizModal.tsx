"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

const goals = [
  { value: "office_casual", label: "Офис" },
  { value: "date", label: "Свидание" },
  { value: "weekend", label: "Выходные" },
  { value: "season_update", label: "Обновление сезона" }
];

const budgetPresets = [15000, 25000, 35000, 0];

const totalSteps = 6;

type QuizModalProps = {
  open: boolean;
  onClose: () => void;
};

export function QuizModal({ open, onClose }: QuizModalProps) {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<string>("office_casual");
  const [budget, setBudget] = useState<number>(25000);
  const [city, setCity] = useState<string>("");
  const [hasPhoto, setHasPhoto] = useState<boolean>(true);

  useEffect(() => {
    if (!open) return;
    let id = localStorage.getItem("quiz_id");
    if (!id) {
      id = `q_${Date.now()}`;
      localStorage.setItem("quiz_id", id);
    }
  }, [open]);

  if (!open) return null;

  const formatBudget = (val: number) =>
    val === 0 ? "Без ограничений" : new Intl.NumberFormat("ru-RU").format(val) + " ₽";

  const next = () => setStep((s) => Math.min(totalSteps, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-full w-full max-w-md overflow-y-auto rounded-lg bg-white p-4 text-black">
        <div className="sticky top-0 mb-4 flex items-center justify-between bg-white py-2">
          <span className="text-sm">
            Шаг {step}/{totalSteps}
          </span>
          <button onClick={onClose} aria-label="Закрыть" className="text-sm underline">
            Закрыть
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-serif">Под что собираем капсулу?</h2>
            <div className="grid grid-cols-2 gap-2">
              {goals.map((g) => (
                <label key={g.value} className="block cursor-pointer">
                  <input
                    type="radio"
                    name="goal"
                    value={g.value}
                    className="peer sr-only"
                    checked={goal === g.value}
                    onChange={() => setGoal(g.value)}
                  />
                  <div
                    className={clsx(
                      "rounded-md border p-3 text-center peer-checked:border-brand-500 peer-checked:bg-brand-50"
                    )}
                  >
                    {g.label}
                  </div>
                </label>
              ))}
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm">
                Бюджет — ориентир, можно менять позже
              </label>
              <input
                id="budget"
                type="range"
                min={10000}
                max={60000}
                step={500}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full"
              />
              <div className="mt-1 flex items-center justify-between">
                {budgetPresets.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBudget(b)}
                    className={clsx(
                      "rounded border px-2 py-1 text-sm",
                      b === budget && "border-brand-500 bg-brand-50"
                    )}
                  >
                    {formatBudget(b)}
                  </button>
                ))}
              </div>
              <div className="mt-2 text-center font-medium">
                {formatBudget(budget)}
              </div>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm">
                Город (необ.)
              </label>
              <input
                id="city"
                type="text"
                className="input mt-1 w-full"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                maxLength={32}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-serif">Фото или параметры</h2>
            <div className="flex gap-2">
              <button
                type="button"
                className={clsx("flex-1 rounded border py-2", hasPhoto && "border-brand-500")}
                onClick={() => setHasPhoto(true)}
              >
                Фото
              </button>
              <button
                type="button"
                className={clsx("flex-1 rounded border py-2", !hasPhoto && "border-brand-500")}
                onClick={() => setHasPhoto(false)}
              >
                Без фото
              </button>
            </div>
            {hasPhoto ? (
              <div className="space-y-2">
                <input type="file" accept="image/*" className="w-full" />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked /> Скрыть лицо
                </label>
                <p className="text-xs text-black/70">
                  Фото хранится ≤ 30 дней. Можно удалить сразу
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm">
                  Рост (см)
                  <input type="number" min={150} max={210} className="input mt-1 w-full" />
                </label>
                <label className="block text-sm">
                  Вес (кг)
                  <input type="number" min={45} max={160} className="input mt-1 w-full" />
                </label>
                <label className="block text-sm">
                  Возраст
                  <select className="input mt-1 w-full">
                    <option value="18_24">18–24</option>
                    <option value="25_34">25–34</option>
                    <option value="35_44">35–44</option>
                  </select>
                </label>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-serif">Размеры и посадка</h2>
            <label className="block text-sm">
              Верх (44–60)
              <input type="text" className="input mt-1 w-full" />
            </label>
            <label className="block text-sm">
              Талия низ (см)
              <input type="text" className="input mt-1 w-full" />
            </label>
            <label className="block text-sm">
              Длина низ (см)
              <input type="text" className="input mt-1 w-full" />
            </label>
            <label className="block text-sm">
              Обувь (38–47)
              <input type="text" className="input mt-1 w-full" />
            </label>
            <label className="block text-sm">
              Посадка верха
              <select className="input mt-1 w-full">
                <option value="slim">Slim</option>
                <option value="regular">Regular</option>
                <option value="relaxed">Relaxed</option>
                <option value="any">Любая</option>
              </select>
            </label>
            <label className="block text-sm">
              Посадка низа
              <select className="input mt-1 w-full">
                <option value="tapered">Зауженная</option>
                <option value="straight">Прямая</option>
                <option value="relaxed">Свободная</option>
                <option value="any">Любая</option>
              </select>
            </label>
            <p className="text-xs text-black/70">
              Если не уверены — оставьте пустым, мы подскажем
            </p>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-serif">Стиль и цвета</h2>
            <fieldset>
              <legend className="text-sm">Стиль (до 2)</legend>
              <div className="mt-1 grid grid-cols-2 gap-2 text-sm">
                {[
                  { v: "minimal", l: "Минимал" },
                  { v: "smart_casual", l: "Smart" },
                  { v: "sport_casual", l: "Спорт" },
                  { v: "street_light", l: "Street" }
                ].map((s) => (
                  <label key={s.v} className="flex items-center gap-1">
                    <input type="checkbox" value={s.v} /> {s.l}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-sm">Не люблю цвета (до 3)</legend>
              <div className="mt-1 grid grid-cols-2 gap-2 text-sm">
                {[
                  "black",
                  "white",
                  "blue",
                  "beige",
                  "green",
                  "brown",
                  "grey",
                  "bright"
                ].map((c) => (
                  <label key={c} className="flex items-center gap-1">
                    <input type="checkbox" value={c} /> {c}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="block text-sm">
              Бренды (необ.)
              <input className="input mt-1 w-full" placeholder="до 3" />
            </label>
            <p className="text-xs text-black/70">
              Можно пропустить — мы предложим базовую палитру
            </p>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-xl font-serif">Где покупать?</h2>
            <fieldset>
              <legend className="text-sm">Маркетплейсы</legend>
              <div className="mt-1 grid grid-cols-2 gap-2 text-sm">
                {[
                  { v: "wb", l: "Wildberries" },
                  { v: "ozon", l: "Ozon" },
                  { v: "ymarket", l: "Я.Маркет" },
                  { v: "any", l: "Любой" }
                ].map((m) => (
                  <label key={m.v} className="flex items-center gap-1">
                    <input type="checkbox" value={m.v} /> {m.l}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-sm">Не предлагать</legend>
              <div className="mt-1 grid grid-cols-2 gap-2 text-sm">
                {[
                  "leather",
                  "wool",
                  "logos",
                  "shorts",
                  "light_wash"
                ].map((i) => (
                  <label key={i} className="flex items-center gap-1">
                    <input type="checkbox" value={i} /> {i}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="block text-sm">
              Обувь
              <select className="input mt-1 w-full">
                <option value="sneakers">Кеды</option>
                <option value="loafers">Лоферы</option>
                <option value="any">Любая</option>
              </select>
            </label>
            <p className="text-xs text-black/70">Влияет на фильтрацию ассортимента</p>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <h2 className="text-xl font-serif">Куда прислать подборку?</h2>
            <label className="block text-sm">
              Контакт
              <input className="input mt-1 w-full" placeholder="Телефон или email" />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" required /> Согласен на обработку ПДн (152-ФЗ)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" /> Хочу получать новости и акции
            </label>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          {step > 1 ? (
            <button onClick={prev} className="button secondary">
              Назад
            </button>
          ) : (
            <span />
          )}

          {step < totalSteps ? (
            <button onClick={next} className="button primary">
              {step === 4 || step === 5 ? "Пропустить" : "Далее"}
            </button>
          ) : (
            <button onClick={onClose} className="button primary">
              Получить 3 лука
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
