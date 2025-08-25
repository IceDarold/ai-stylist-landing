"use client";

import { useEffect, useState } from "react";
import StyleQuestion from "./StyleQuestion";
import { useRouter } from "next/navigation";

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
}

export function Quiz({ onClose }: QuizProps) {
  const router = useRouter();
  const stepOrder = [
    "goal",
    "budget",
    "city",
    "photo",
    "height_cm",
    "weight_kg",
    "age_band",
    "top_size",
    "bottom_waist",
    "bottom_length",
    "shoe_ru",
    "fit_pref_top",
    "fit_pref_bottom",
    "style",
    "color_dislike",
    "brands_known",
    "marketplaces",
    "avoid_items",
    "footwear_pref",
  ] as const;
  type StepId = (typeof stepOrder)[number];

  const totalSteps = stepOrder.length;
  const [step, setStep] = useState(0);
  const stepId: StepId = stepOrder[step];
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
  });

  const next = () => setStep((s) => Math.min(s + 1, totalSteps - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const update = (fields: Partial<QuizData>) => setData((d) => ({ ...d, ...fields }));

  const handleSubmit = () => {
    console.log("quiz submit", data);
    onClose();
    router.push("/thanks");
  };

  useEffect(() => {
    const event = `quiz_step_${stepId}`;
    if (typeof window !== "undefined") {
      const win = window as {
        plausible?: (e: string, o?: Record<string, unknown>) => void;
        ym?: (id: number, type: string, name: string) => void;
      };
      win.plausible?.(event);
      const ymId = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID;
      if (ymId) win.ym?.(Number(ymId), "reachGoal", event);
    }
  }, [stepId]);

  const renderStep = () => {
    switch (stepId) {
      case "goal":
        return (
          <div>
            <h2 className="mb-6 text-xl font-semibold">Под что собираем капсулу?</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "office_casual", label: "Офис" },
                { value: "date", label: "Свидание" },
                { value: "weekend", label: "Выходные" },
                { value: "season_update", label: "Сезон" },
              ].map((g) => (
                <label
                  key={g.value}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 hover:bg-gray-50"
                >
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
          </div>
        );
      case "budget":
        return (
          <div>
            <h2 className="mb-6 text-xl font-semibold">Бюджет (₽)</h2>
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
          </div>
        );
      case "city":
        return (
          <div>
            <h2 className="mb-6 text-xl font-semibold">Город</h2>
            <input
              type="text"
              className="input w-full"
              value={data.city}
              onChange={(e) => update({ city: e.target.value })}
              placeholder="Москва"
            />
          </div>
        );
      case "photo":
        return (
          <div className="space-y-4">
            <h2 className="mb-6 text-xl font-semibold">Фото</h2>
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
        );
      case "height_cm":
        return (
          <div>
            <h2 className="mb-6 text-xl font-semibold">Рост (см)</h2>
            <input
              type="number"
              min={150}
              max={210}
              className="input w-full"
              value={data.height_cm ?? ""}
              onChange={(e) => update({ height_cm: Number(e.target.value) })}
            />
          </div>
        );
      case "weight_kg":
        return (
          <div>
            <h2 className="mb-6 text-xl font-semibold">Вес (кг)</h2>
            <input
              type="number"
              min={45}
              max={160}
              className="input w-full"
              value={data.weight_kg ?? ""}
              onChange={(e) => update({ weight_kg: Number(e.target.value) })}
            />
          </div>
        );
      case "age_band":
        return (
          <div>
            <h2 className="mb-6 text-xl font-semibold">Возраст</h2>
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
        );
      case "top_size":
        return (
          <div>
            <h2 className="mb-6 text-xl font-semibold">Размер верха (RU)</h2>
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
        );
      case "bottom_waist":
        return (
          <div>
            <h2 className="mb-6 text-xl font-semibold">Талия</h2>
            <input
              type="number"
              className="input w-full"
              value={data.bottom_waist ?? ""}
              onChange={(e) => update({ bottom_waist: Number(e.target.value) })}
            />
          </div>
        );
      case "bottom_length":
        return (
          <div>
            <h2 className="mb-6 text-xl font-semibold">Длина низа</h2>
            <input
              type="number"
              className="input w-full"
              value={data.bottom_length ?? ""}
              onChange={(e) => update({ bottom_length: Number(e.target.value) })}
            />
          </div>
        );
      case "shoe_ru":
        return (
          <div>
            <h2 className="mb-6 text-xl font-semibold">Обувь (RU)</h2>
            <input
              type="number"
              min={38}
              max={47}
              className="input w-full"
              value={data.shoe_ru ?? ""}
              onChange={(e) => update({ shoe_ru: Number(e.target.value) })}
            />
          </div>
        );
      case "fit_pref_top":
        return (
          <div>
            <h2 className="mb-6 text-xl font-semibold">Посадка верха</h2>
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
        );
      case "fit_pref_bottom":
        return (
          <div>
            <h2 className="mb-6 text-xl font-semibold">Посадка низа</h2>
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
        );
      case "style":
        return (
          <StyleQuestion
            selected={data.style}
            onChange={(style) => update({ style })}
            goal={data.goal}
            budget={data.budget}
          />
        );
      case "color_dislike":
        return (
          <div>
            <h2 className="mb-6 text-xl font-semibold">Не любим цвета (до 3)</h2>
            <div className="space-y-2">
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
          </div>
        );
      case "brands_known":
        return (
          <div>
            <h2 className="mb-6 text-xl font-semibold">Знакомые бренды (до 3)</h2>
            <div className="space-y-4">
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
        );
      case "marketplaces":
        return (
          <div>
            <h2 className="mb-6 text-xl font-semibold">Маркетплейсы</h2>
            <div className="space-y-2">
              {[
                { value: "wb", label: "Wildberries" },
                { value: "ozon", label: "Ozon" },
                { value: "ymarket", label: "Я.Маркет" },
                { value: "any", label: "Любой" },
              ].map((m) => (
                <label
                  key={m.value}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 hover:bg-gray-50"
                >
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
          </div>
        );
      case "avoid_items":
        return (
          <div>
            <h2 className="mb-6 text-xl font-semibold">Избегаем</h2>
            <div className="space-y-2">
              {[
                "leather",
                "wool",
                "logos",
                "shorts",
                "light_wash",
              ].map((a) => (
                <label
                  key={a}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 hover:bg-gray-50"
                >
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
          </div>
        );
      case "footwear_pref":
        return (
          <div>
            <h2 className="mb-6 text-xl font-semibold">Обувь</h2>
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
        );
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-full w-full max-w-lg overflow-auto rounded-xl bg-white p-6 shadow-lg">
        {/* progress */}
        <div className="mb-6 flex items-center justify-between text-sm">
          <div>
            Шаг {step + 1}/{totalSteps}
          </div>
          <button aria-label="Закрыть" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-[var(--brand-500)] transition-all"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {renderStep()}
        <div className="mt-8 flex items-center justify-between">
          {step > 0 ? (
            <button className="button" onClick={prev}>
              Назад
            </button>
          ) : (
            <span />
          )}
          {step < totalSteps - 1 ? (
            <button className="button primary" onClick={next}>
              Далее
            </button>
          ) : (
            <button className="button primary" onClick={handleSubmit}>
              Получить 3 лука
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

