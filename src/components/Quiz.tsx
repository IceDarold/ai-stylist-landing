"use client";

import { useEffect, useMemo, useState } from "react";
import StyleStep from "./quiz/StyleStep";
import ColorDislikeStep from "./quiz/ColorDislikeStep";
import PhotoStep from "./quiz/PhotoStep";
import FavoriteBrandsStep, { type Brand } from "./quiz/FavoriteBrandsStep";
// import MarketplacesStep from "./quiz/MarketplacesStep";
// import type { MarketplacesAnswer } from "@/types/marketplaces";
import MeasurementsStep, { type SizeProfile } from "./quiz/MeasurementsStep";
import UseCaseStep from "./quiz/UseCaseStep";
import { type SelectedUseCase } from "./quiz/usecases.config";

interface QuizProps {
  onClose: () => void;
}

// helpers for age mapping to legacy bands
function ageToBand(age: number): string {
  if (age < 25) return "18_24";
  if (age < 35) return "25_34";
  return "35_44";
}

function bandLabel(band?: string) {
  const map: Record<string, string> = {
    "18_24": "18–24",
    "25_34": "25–34",
    "35_44": "35–44",
  };
  return band ? map[band] ?? "—" : "—";
}

// initial data structure
interface QuizData {

  usecases: SelectedUseCase[];
  auto_pick_usecases: boolean;
  budget: number;
  city: string;
  photo?: File | null;
  no_face: boolean;
  height_cm?: number;
  weight_kg?: number;
  age?: number;
  age_band?: string;
  sizes: SizeProfile;
  shoe_ru?: number;
  style: string[];
  color_dislike: string[];
  favorite_brands: Brand[];
  favorite_brands_custom: string[];
  auto_pick_brands: boolean;
  // marketplaces: MarketplacesAnswer;
  avoid_items: string[];

}


export function Quiz({ onClose }: QuizProps) {
  type StepId =
    | "usecases"
    | "budget"
    | "city"
    | "photo"
    | "body"
    | "measurements"
    | "shoe_ru"
    | "style"
    | "color_dislike"
    | "favorite_brands"
    | "avoid_items"
    | "submit";

  const [step, setStep] = useState(0);
  const [inputMode, setInputMode] = useState<"photo" | "manual">("photo");
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<QuizData>({
    usecases: [],
    auto_pick_usecases: false,
    budget: 25000,
    city: "Москва",
    photo: null,
    no_face: true,
    height_cm: 180,
    weight_kg: 75,
    age: 30,
    age_band: "25_34",
    sizes: { unit: "metric", autopick: false },
    shoe_ru: 42,
    style: [],
    color_dislike: [],
    favorite_brands: [],
    favorite_brands_custom: [],
    auto_pick_brands: false,
    // marketplaces: { any_ok: false, preferred: [], excluded: [] },
    avoid_items: [],

  });
  const [photoValid, setPhotoValid] = useState(false);

  const getStepsFor = (mode: "photo" | "manual"): StepId[] => {
    const base: StepId[] = ["usecases", "budget", "city"];
    if (mode === "photo") {
      base.push("photo", "style", "color_dislike", "favorite_brands", "avoid_items", "submit");
    } else {
      base.push("body", "measurements", "shoe_ru", "style", "color_dislike", "favorite_brands", "avoid_items", "submit");
    }
    return base;
  };

  // Dynamic step order based on input mode
  const steps = useMemo<StepId[]>(() => getStepsFor(inputMode), [inputMode]);

  const totalSteps = steps.length;
  const stepId: StepId = steps[Math.min(step, totalSteps - 1)];

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
      case "usecases":
        return (
          <UseCaseStep
            selected={data.usecases}
            autoPick={data.auto_pick_usecases}
            onChange={(usecases, auto) => update({ usecases, auto_pick_usecases: auto })}
          />
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
            onChange={(f) => update({ photo: f })}
            onValidChange={setPhotoValid}
          />
        );
      case "body":
        return (
          <div className="space-y-4">
            <h2 className="mb-6 text-xl font-semibold">Рост, вес и возраст</h2>
            <input
              type="number"
              min={16}
              max={80}
              className="input w-full"
              value={data.age ?? ""}
              onChange={(e) => {
                const val = Number(e.target.value || 0);
                const age = Math.max(16, Math.min(80, val));
                const band = ageToBand(age);
                update({ age, age_band: band });
              }}
              placeholder="Возраст"
            />
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
      case "measurements":
        return (
          <MeasurementsStep
            profile={data.sizes}
            onChange={(sizes) => update({ sizes })}
            height={data.height_cm}
            weight={data.weight_kg}
          />
        );
      case "shoe_ru":
        return (
          <div>
            <h2 className="mb-6 text-xl font-semibold">Размер обуви</h2>
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
            useCase={data.usecases[0]?.id}
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
      // case "marketplaces":
      //   return (
      //     <div>
      //       <h2 className="mb-6 text-xl font-semibold">Маркетплейсы</h2>
      //       <MarketplacesStep
      //         initial={data.marketplaces}
      //         onChange={(m) => update({ marketplaces: m })}
      //       />
      //     </div>
      //   );
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
        {/* persistent photo/manual switcher visible after early steps */}
        {(() => {
          const early: StepId[] = ["usecases", "budget", "city"];
          const show = !early.includes(stepId) && stepId !== "submit";
          if (!show) return null;
          return (
            <div className="mb-6 flex w-full justify-center">
              <div className="inline-flex w-full max-w-md justify-between rounded-full bg-gray-100 p-1 text-sm">
                <button
                  type="button"
                  className={
                    inputMode === "photo"
                      ? "rounded-full bg-white px-3 py-1 shadow"
                      : "rounded-full px-3 py-1 text-gray-600"
                  }
                  aria-pressed={inputMode === "photo"}
                  onClick={() => {
                    if (inputMode !== "photo") {
                      setInputMode("photo");
                      const nextSteps = getStepsFor("photo");
                      const idx = nextSteps.indexOf("photo");
                      if (idx >= 0) setStep(idx);
                    }
                  }}
                >
                  Загрузить фото
                </button>
                <button
                  type="button"
                  className={
                    inputMode === "manual"
                      ? "rounded-full bg-white px-3 py-1 shadow"
                      : "rounded-full px-3 py-1 text-gray-600"
                  }
                  aria-pressed={inputMode === "manual"}
                  onClick={() => {
                    if (inputMode !== "manual") {
                      setInputMode("manual");
                      const nextSteps = getStepsFor("manual");
                      const idx = nextSteps.indexOf("body");
                      if (idx >= 0) setStep(idx);
                    } else if (stepId === "photo") {
                      const nextSteps = getStepsFor("manual");
                      const idx = nextSteps.indexOf("body");
                      if (idx >= 0) setStep(idx);
                    }
                  }}
                >
                  Ввести вручную
                </button>
              </div>
            </div>
          );
        })()}

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
                if (stepId === "measurements") {
                  const filled = Object.entries(data.sizes)
                    .filter(([k, v]) => v !== undefined && !["unit","autopick"].includes(k))
                    .map(([k]) => k);
                  sendEvent("quiz_next_click", { step: 7, filled, autopick: data.sizes.autopick });}
                if (stepId === "usecases") {
                  sendEvent("quiz_next_click", {
                    step: 1,
                    auto_pick: data.auto_pick_usecases,
                    usecases: data.usecases,
                  });
                }
                if (stepId === "color_dislike") {
                  sendEvent("quiz_next_click", {
                    step: 10,
                    favoriteColors: data.color_dislike,
                  });
                }
                // removed marketplaces step telemetry
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

