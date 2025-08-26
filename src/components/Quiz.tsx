"use client";

import { useEffect, useState } from "react";
import StyleStep from "./quiz/StyleStep";
import ColorDislikeStep from "./quiz/ColorDislikeStep";
import PhotoStep from "./quiz/PhotoStep";
import FavoriteBrandsStep, { type Brand } from "./quiz/FavoriteBrandsStep";
import SizeStep from "./quiz/SizeStep";
import type { SizeProfile } from "../types/sizes";

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
  sizes: SizeProfile;
  shoe_ru?: number;
  style: string[];
  color_dislike: string[];
  favorite_brands: Brand[];
  favorite_brands_custom: string[];
  auto_pick_brands: boolean;
  marketplaces: string[];
  avoid_items: string[];
}

export function Quiz({ onClose }: QuizProps) {
  const stepOrder = [
    "goal",
    "budget",
    "city",
    "photo",
    "body",
    "age_band",
    "measurements",
    "shoe_ru",
    "style",
    "color_dislike",
    "favorite_brands",
    "marketplaces",
    "avoid_items",
    "submit",
  ] as const;
  type StepId = (typeof stepOrder)[number];

  const totalSteps = stepOrder.length;
  const [step, setStep] = useState(0);
  const stepId: StepId = stepOrder[step];
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<QuizData>({
    goal: "office_casual",
    budget: 25000,
    city: "Москва",
    photo: null,
    no_face: true,
    height_cm: 180,
    weight_kg: 75,
    age_band: "25_34",
    sizes: { unit: "metric", autopick: false },
    shoe_ru: 42,
    style: [],
    color_dislike: [],
    favorite_brands: [],
    favorite_brands_custom: [],
    auto_pick_brands: false,
    marketplaces: [],
    avoid_items: [],
  });
  const [photoValid, setPhotoValid] = useState(false);

  const next = () => setStep((s) => Math.min(s + 1, totalSteps - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const update = (fields: Partial<QuizData>) => setData((d) => ({ ...d, ...fields }));

  const handleSubmit = () => {
    console.log("quiz submit", data);
    setSubmitted(true);
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const renderStep = () => {
    switch (stepId) {
      case "goal":
        return (
          <div>
            <h2 className="mb-6 text-xl font-semibold">Под что собираем капсулу?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          <PhotoStep
            file={data.photo ?? null}
            hideFace={data.no_face}
            onChange={(f) => update({ photo: f })}
            onHideFaceChange={(v) => update({ no_face: v })}
            onValidChange={setPhotoValid}
          />
        );
      case "body":
        return (
          <div className="space-y-4">
            <h2 className="mb-6 text-xl font-semibold">Рост и вес</h2>
            <input
              type="number"
              min={150}
              max={210}
              className="input w-full"
              value={data.height_cm ?? ""}
              onChange={(e) => update({ height_cm: Number(e.target.value) })}
              placeholder="Рост (см)"
            />
            <input
              type="number"
              min={45}
              max={160}
              className="input w-full"
              value={data.weight_kg ?? ""}
              onChange={(e) => update({ weight_kg: Number(e.target.value) })}
              placeholder="Вес (кг)"
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
        case "measurements":
          return (
            <SizeStep
              profile={data.sizes}
              onChange={(p) => update({ sizes: p })}
            />
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
      case "style":
        return (
          <StyleStep
            selected={data.style}
            onChange={(style) => update({ style })}
            goal={data.goal}
          />
        );
      case "color_dislike":
        return (
          <ColorDislikeStep
            selected={data.color_dislike}
            onChange={(color_dislike) => update({ color_dislike })}
          />
        );
      case "favorite_brands":
        return (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Любимые бренды (до 3)</h2>
              <span className="text-sm text-gray-500">
                {data.favorite_brands.length + data.favorite_brands_custom.length}/3
              </span>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              Выберите любимые бренды. Можно пропустить.
            </p>
            <FavoriteBrandsStep
              initialSelected={data.favorite_brands}
              initialCustom={data.favorite_brands_custom}
              initialAutoPick={data.auto_pick_brands}
              onChange={(s) =>
                update({
                  favorite_brands: s.selected,
                  favorite_brands_custom: s.custom,
                  auto_pick_brands: s.autoPick,
                })
              }
            />
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
      case "submit":
        return <div />;
    }
  };
  if (submitted)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
        <div className="max-h-full w-full max-w-lg overflow-auto rounded-xl bg-white p-6 text-center shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Спасибо!</h2>
          <p className="mb-6 text-sm text-gray-600">Мы уже начали подбор и скоро отправим 3 лука.</p>
          <button className="button primary" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-[720px] overflow-auto rounded-2xl bg-white p-6 sm:p-8 shadow-lg">
        {/* progress */}
        <div className="mb-6 flex items-center justify-between text-sm">
          <div>
            Шаг {step + 1}/{totalSteps}
          </div>
          <button aria-label="Закрыть" onClick={onClose}>
            ✕
          </button>
        </div>
        <div
          className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemax={totalSteps}
        >
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
            <button
              className="button primary"
              onClick={() => {
                if (stepId === "color_dislike") {
                  sendEvent("quiz_next_click", {
                    step: 10,
                    dislikedColors: data.color_dislike,
                  });
                }
                next();
              }}
              disabled={stepId === "photo" && !photoValid}
            >
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

function sendEvent(event: string, props?: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    const win = window as {
      plausible?: (e: string, o?: Record<string, unknown>) => void;
    };
    win.plausible?.(event, props);
  }
}

