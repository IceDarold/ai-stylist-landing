"use client";

import { useState } from "react";
import { track } from "@/lib/plausible";

interface QuizProps {
  onClose: () => void;
}

// initial data structure
interface QuizData {
  goal: string;
  budget: number;
  city: string;
  photo?: File | null;
  no_face: boolean;
  height_cm?: number;
  weight_kg?: number;
  age_band?: string;
  top_size?: string;
  bottom_waist?: number;
  bottom_length?: number;
  shoe_ru?: number;
  fit_pref_top?: string;
  fit_pref_bottom?: string;
  style: string[];
  color_dislike: string[];
  brands_known: string[];
  marketplaces: string[];
  avoid_items: string[];
  footwear_pref?: string;
  contact_type: "phone" | "email";
  contact_value: string;
  consent_personal: boolean;
  consent_marketing: boolean;
}

export function Quiz({ onClose }: QuizProps) {
  const totalSteps = 6;
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState<"photo" | "params">("photo");
  const [data, setData] = useState<QuizData>({
    goal: "office_casual",
    budget: 25000,
    city: "",
    no_face: true,
    style: [],
    color_dislike: [],
    brands_known: ["", "", ""],
    marketplaces: [],
    avoid_items: [],
    contact_type: "email",
    contact_value: "",
    consent_personal: false,
    consent_marketing: false,
  });

  const next = () =>
    setStep((s) => {
      const newStep = Math.min(s + 1, totalSteps - 1);
      track("quiz_step", { step: newStep });
      return newStep;
    });
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const skip = () => next();

  const update = (fields: Partial<QuizData>) => setData((d) => ({ ...d, ...fields }));

  const handleSubmit = () => {
    track("quiz_completed");
    console.log("quiz submit", data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-full w-full max-w-md overflow-auto rounded-md bg-white p-4">
        {/* progress */}
        <div className="mb-4 flex items-center justify-between text-sm">
          <div>
            Шаг {step + 1}/{totalSteps}
          </div>
          <button aria-label="Закрыть" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="mb-4 h-1 w-full bg-gray-200">
          <div
            className="h-full bg-black"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* steps */}
        {step === 0 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold">Под что собираем капсулу?</h2>
            <div className="mb-4 grid grid-cols-2 gap-2">
              {[
                { value: "office_casual", label: "Офис" },
                { value: "date", label: "Свидание" },
                { value: "weekend", label: "Выходные" },
                { value: "season_update", label: "Сезон" },
              ].map((g) => (
                <label key={g.value} className="flex items-center gap-2 rounded border p-2">
                  <input
                    type="radio"
                    name="goal"
                    value={g.value}
                    checked={data.goal === g.value}
                    onChange={(e) => update({ goal: e.target.value })}
                  />
                  {g.label}
                </label>
              ))}
            </div>
            <label className="block text-sm font-medium">Бюджет (₽)</label>
            <input
              type="range"
              min={10000}
              max={60000}
              step={500}
              value={data.budget}
              onChange={(e) => update({ budget: Number(e.target.value) })}
              className="w-full"
            />
            <div className="mt-2 text-center text-sm">{data.budget.toLocaleString("ru-RU")}</div>
            <div className="mt-4">
              <label htmlFor="city" className="block text-sm font-medium">
                Город
              </label>
              <input
                id="city"
                type="text"
                className="input mt-1 w-full"
                value={data.city}
                onChange={(e) => update({ city: e.target.value })}
                placeholder="Москва"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold">Фото или параметры</h2>
            <div className="mb-4 flex gap-4 border-b">
              <button
                className={`pb-2 ${tab === "photo" ? "border-b-2 border-black" : ""}`}
                onClick={() => setTab("photo")}
              >
                Фото
              </button>
              <button
                className={`pb-2 ${tab === "params" ? "border-b-2 border-black" : ""}`}
                onClick={() => setTab("params")}
              >
                Без фото
              </button>
            </div>
            {tab === "photo" ? (
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => update({ photo: e.target.files?.[0] })}
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={data.no_face}
                    onChange={(e) => update({ no_face: e.target.checked })}
                  />
                  Скрыть лицо
                </label>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm">Рост (см)</label>
                  <input
                    type="number"
                    min={150}
                    max={210}
                    className="input w-full"
                    value={data.height_cm ?? ""}
                    onChange={(e) => update({ height_cm: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm">Вес (кг)</label>
                  <input
                    type="number"
                    min={45}
                    max={160}
                    className="input w-full"
                    value={data.weight_kg ?? ""}
                    onChange={(e) => update({ weight_kg: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm">Возраст</label>
                  <select
                    className="input w-full"
                    value={data.age_band ?? ""}
                    onChange={(e) => update({ age_band: e.target.value })}
                  >
                    <option value="">--</option>
                    <option value="18_24">18-24</option>
                    <option value="25_34">25-34</option>
                    <option value="35_44">35-44</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <h2 className="mb-4 text-lg font-semibold">Размеры и посадка</h2>
            <div>
              <label className="block text-sm">Размер верха (RU)</label>
              <select
                className="input w-full"
                value={data.top_size ?? ""}
                onChange={(e) => update({ top_size: e.target.value })}
              >
                <option value="">--</option>
                {Array.from({ length: 9 }, (_, i) => 44 + i * 2).map((v) => (
                  <option key={v} value={String(v)}>
                    {v}
                  </option>
                ))}
                <option value="dont_know">Не знаю</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm">Талия</label>
                <input
                  type="number"
                  className="input w-full"
                  value={data.bottom_waist ?? ""}
                  onChange={(e) => update({ bottom_waist: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm">Длина</label>
                <input
                  type="number"
                  className="input w-full"
                  value={data.bottom_length ?? ""}
                  onChange={(e) => update({ bottom_length: Number(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm">Обувь (RU)</label>
              <input
                type="number"
                min={38}
                max={47}
                className="input w-full"
                value={data.shoe_ru ?? ""}
                onChange={(e) => update({ shoe_ru: Number(e.target.value) })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm">Посадка верха</label>
                <select
                  className="input w-full"
                  value={data.fit_pref_top ?? ""}
                  onChange={(e) => update({ fit_pref_top: e.target.value })}
                >
                  <option value="">--</option>
                  <option value="slim">Slim</option>
                  <option value="regular">Regular</option>
                  <option value="relaxed">Relaxed</option>
                  <option value="any">Любая</option>
                </select>
              </div>
              <div>
                <label className="block text-sm">Посадка низа</label>
                <select
                  className="input w-full"
                  value={data.fit_pref_bottom ?? ""}
                  onChange={(e) => update({ fit_pref_bottom: e.target.value })}
                >
                  <option value="">--</option>
                  <option value="tapered">Tapered</option>
                  <option value="straight">Straight</option>
                  <option value="relaxed">Relaxed</option>
                  <option value="any">Любая</option>
                </select>
              </div>
            </div>
            <p className="text-sm text-gray-600">Если не уверены — оставьте пустым, мы подскажем.</p>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold">Стиль и цвета</h2>
            <div className="mb-4 space-y-2">
              <p className="text-sm">Стиль (до 2):</p>
              {[
                "minimal",
                "smart_casual",
                "sport_casual",
                "street_light",
              ].map((s) => (
                <label key={s} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={data.style.includes(s)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      update({
                        style: checked
                          ? [...data.style, s].slice(0, 2)
                          : data.style.filter((v) => v !== s),
                      });
                    }}
                  />
                  {s}
                </label>
              ))}
            </div>
            <div className="mb-4 space-y-2">
              <p className="text-sm">Не любим цвета (до 3):</p>
              {[
                "black",
                "white",
                "blue",
                "beige",
                "green",
                "brown",
                "grey",
                "bright",
              ].map((c) => (
                <label key={c} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={data.color_dislike.includes(c)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      update({
                        color_dislike: checked
                          ? [...data.color_dislike, c].slice(0, 3)
                          : data.color_dislike.filter((v) => v !== c),
                      });
                    }}
                  />
                  {c}
                </label>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-sm">Знакомые бренды (до 3):</p>
              {data.brands_known.map((b, idx) => (
                <input
                  key={idx}
                  type="text"
                  className="input w-full"
                  maxLength={16}
                  value={b}
                  onChange={(e) => {
                    const arr = [...data.brands_known];
                    arr[idx] = e.target.value;
                    update({ brands_known: arr });
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold">Где покупать?</h2>
            <div className="mb-4 space-y-2">
              <p className="text-sm">Маркетплейсы:</p>
              {[
                { value: "wb", label: "Wildberries" },
                { value: "ozon", label: "Ozon" },
                { value: "ymarket", label: "Я.Маркет" },
                { value: "any", label: "Любой" },
              ].map((m) => (
                <label key={m.value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={data.marketplaces.includes(m.value)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      update({
                        marketplaces: checked
                          ? [...data.marketplaces, m.value]
                          : data.marketplaces.filter((v) => v !== m.value),
                      });
                    }}
                  />
                  {m.label}
                </label>
              ))}
            </div>
            <div className="mb-4 space-y-2">
              <p className="text-sm">Избегаем:</p>
              {[
                "leather",
                "wool",
                "logos",
                "shorts",
                "light_wash",
              ].map((a) => (
                <label key={a} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={data.avoid_items.includes(a)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      update({
                        avoid_items: checked
                          ? [...data.avoid_items, a]
                          : data.avoid_items.filter((v) => v !== a),
                      });
                    }}
                  />
                  {a}
                </label>
              ))}
            </div>
            <div>
              <label className="block text-sm">Обувь</label>
              <select
                className="input w-full"
                value={data.footwear_pref ?? ""}
                onChange={(e) => update({ footwear_pref: e.target.value })}
              >
                <option value="">--</option>
                <option value="sneakers">Кроссовки</option>
                <option value="loafers">Лоферы</option>
                <option value="any">Любая</option>
              </select>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold">Куда прислать подборку?</h2>
            <div className="mb-4 space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="contact_type"
                  value="phone"
                  checked={data.contact_type === "phone"}
                  onChange={() => update({ contact_type: "phone" })}
                />
                Телефон
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="contact_type"
                  value="email"
                  checked={data.contact_type === "email"}
                  onChange={() => update({ contact_type: "email" })}
                />
                Email
              </label>
            </div>
            <div className="mb-4">
              {data.contact_type === "phone" ? (
                <input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  className="input w-full"
                  value={data.contact_value}
                  onChange={(e) => update({ contact_value: e.target.value })}
                />
              ) : (
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input w-full"
                  value={data.contact_value}
                  onChange={(e) => update({ contact_value: e.target.value })}
                />
              )}
            </div>
            <label className="mb-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.consent_personal}
                onChange={(e) => update({ consent_personal: e.target.checked })}
              />
              Согласен на обработку ПДн
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.consent_marketing}
                onChange={(e) => update({ consent_marketing: e.target.checked })}
              />
              Получать новости и акции
            </label>
          </div>
        )}

        {/* controls */}
        <div className="mt-6 flex items-center justify-between">
          {step > 0 ? (
            <button className="button" onClick={prev}>
              Назад
            </button>
          ) : (
            <span />
          )}
          {step < totalSteps - 1 ? (
            <div className="flex gap-2">
              {step >= 3 && step <= 4 && (
                <button className="button" onClick={skip}>
                  Пропустить
                </button>
              )}
              <button className="button primary" onClick={next}>
                Далее
              </button>
            </div>
          ) : (
            <button
              className="button primary"
              onClick={handleSubmit}
              disabled={!data.consent_personal || !data.contact_value}
            >
              Получить 3 лука
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

