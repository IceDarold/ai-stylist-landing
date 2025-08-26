"use client";

import { useState } from "react";
import clsx from "clsx";

export interface MeasurementsData {
  sizes_unit: "metric" | "imperial";
  top_size_ru?: number;
  bottom_size_ru?: number;
  jeans_waist_in?: number;
  jeans_inseam_cm?: number;
  bust_cm?: number;
  waist_cm?: number;
  hips_cm?: number;
  top_fit?: "tight" | "regular" | "relaxed" | "oversized";
  pants_cut?: "straight" | "slim" | "wide" | "flare";
  sizes_autopick: boolean;
}

interface MeasurementsStepProps {
  data: MeasurementsData;
  onChange: (data: Partial<MeasurementsData>) => void;
}

export default function MeasurementsStep({ data, onChange }: MeasurementsStepProps) {
  const { sizes_unit: unit, sizes_autopick } = data;
  const [guideOpen, setGuideOpen] = useState(false);

  const toDisplay = (cm?: number) => {
    if (cm == null) return "";
    return unit === "metric" ? String(Math.round(cm)) : String(Math.round(cm / 2.54));
  };

  const handleMeasure = (field: keyof MeasurementsData, value: string) => {
    if (!value) {
      onChange({ [field]: undefined });
      return;
    }
    let num = Number(value);
    if (field.endsWith("_cm") || field === "jeans_inseam_cm") {
      if (unit === "imperial") num = Math.round(num * 2.54);
      onChange({ [field]: num });
      return;
    }
    onChange({ [field]: num });
  };

  const handleUnit = (u: "metric" | "imperial") => {
    if (u !== unit) onChange({ sizes_unit: u });
  };

  const toggleAuto = () => {
    onChange({ sizes_autopick: !sizes_autopick });
  };

  return (
    <div>
      <h2 className="mb-2 text-xl font-semibold">Размеры</h2>
      <p className="mb-4 text-sm text-gray-600">
        Не уверены в параметрах? Нажмите «Не знаю», и наши алгоритмы подберут их автоматически.
      </p>

      <div className="mb-4">
        <div className="inline-flex overflow-hidden rounded border">
          <button
            type="button"
            className={clsx(
              "px-3 py-1 text-sm",
              unit === "metric"
                ? "bg-[var(--brand-500)] text-white"
                : "bg-white text-gray-700"
            )}
            onClick={() => handleUnit("metric")}
          >
            см
          </button>
          <button
            type="button"
            className={clsx(
              "px-3 py-1 text-sm",
              unit === "imperial"
                ? "bg-[var(--brand-500)] text-white"
                : "bg-white text-gray-700"
            )}
            onClick={() => handleUnit("imperial")}
          >
            inch
          </button>
        </div>
      </div>

      <div className={clsx("grid gap-4", "sm:grid-cols-2")}
        aria-disabled={sizes_autopick}
      >
        <div className={clsx(sizes_autopick && "opacity-60")}
        >
          <label className="mb-1 block text-sm">Верх (RU)</label>
          <select
            className="input w-full"
            value={data.top_size_ru ?? ""}
            onChange={(e) => handleMeasure("top_size_ru", e.target.value)}
            disabled={sizes_autopick}
          >
            <option value="">Выберите размер</option>
            {Array.from({ length: 10 }, (_, i) => 38 + i * 2).map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className={clsx(sizes_autopick && "opacity-60")}
        >
          <label className="mb-1 block text-sm">Низ (RU)</label>
          <select
            className="input w-full"
            value={data.bottom_size_ru ?? ""}
            onChange={(e) => handleMeasure("bottom_size_ru", e.target.value)}
            disabled={sizes_autopick}
          >
            <option value="">Выберите размер</option>
            {Array.from({ length: 10 }, (_, i) => 38 + i * 2).map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className={clsx("sm:col-span-2", sizes_autopick && "opacity-60")}
        >
          <label className="mb-1 block text-sm">Джинсы</label>
          <div className="flex gap-2">
            <input
              type="number"
              className="input w-24"
              placeholder="W"
              value={data.jeans_waist_in ?? ""}
              onChange={(e) => handleMeasure("jeans_waist_in", e.target.value)}
              disabled={sizes_autopick}
            />
            <input
              type="number"
              className="input w-24"
              placeholder={`L (${unit === "metric" ? "см" : "inch"})`}
              value={toDisplay(data.jeans_inseam_cm)}
              onChange={(e) => handleMeasure("jeans_inseam_cm", e.target.value)}
              disabled={sizes_autopick}
            />
          </div>
        </div>
        <div className={clsx("sm:col-span-2", sizes_autopick && "opacity-60")}
        >
          <label className="mb-1 block text-sm">
            Грудь / Талия / Бёдра ({unit === "metric" ? "см" : "inch"})
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              className="input flex-1"
              placeholder="Грудь"
              value={toDisplay(data.bust_cm)}
              onChange={(e) => handleMeasure("bust_cm", e.target.value)}
              disabled={sizes_autopick}
            />
            <input
              type="number"
              className="input flex-1"
              placeholder="Талия"
              value={toDisplay(data.waist_cm)}
              onChange={(e) => handleMeasure("waist_cm", e.target.value)}
              disabled={sizes_autopick}
            />
            <input
              type="number"
              className="input flex-1"
              placeholder="Бёдра"
              value={toDisplay(data.hips_cm)}
              onChange={(e) => handleMeasure("hips_cm", e.target.value)}
              disabled={sizes_autopick}
            />
          </div>
        </div>
        <div className={clsx(sizes_autopick && "opacity-60")}
        >
          <label className="mb-1 block text-sm">Посадка верха</label>
          <div className="flex flex-wrap gap-2">
            {["tight", "regular", "relaxed", "oversized"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => onChange({ top_fit: data.top_fit === f ? undefined : (f as any) })}
                className={clsx(
                  "rounded-full border px-3 py-1 text-sm",
                  data.top_fit === f
                    ? "border-[var(--brand-500)] bg-[var(--brand-50)] text-[var(--brand-700)]"
                    : "border-gray-300 text-gray-600"
                )}
                disabled={sizes_autopick}
              >
                {f === "tight"
                  ? "Облегающий"
                  : f === "regular"
                  ? "Regular"
                  : f === "relaxed"
                  ? "Свободный"
                  : "Oversized"}
              </button>
            ))}
          </div>
        </div>
        <div className={clsx(sizes_autopick && "opacity-60")}
        >
          <label className="mb-1 block text-sm">Крой брюк</label>
          <div className="flex flex-wrap gap-2">
            {["straight", "slim", "wide", "flare"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => onChange({ pants_cut: data.pants_cut === f ? undefined : (f as any) })}
                className={clsx(
                  "rounded-full border px-3 py-1 text-sm",
                  data.pants_cut === f
                    ? "border-[var(--brand-500)] bg-[var(--brand-50)] text-[var(--brand-700)]"
                    : "border-gray-300 text-gray-600"
                )}
                disabled={sizes_autopick}
              >
                {f === "straight"
                  ? "Straight"
                  : f === "slim"
                  ? "Slim"
                  : f === "wide"
                  ? "Wide/Loose"
                  : "Flare"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="button"
          className="text-sm text-gray-600 underline"
          onClick={() => setGuideOpen(true)}
        >
          Как снять мерки
        </button>
        <button
          type="button"
          onClick={toggleAuto}
          className={clsx(
            "rounded-full border px-3 py-1 text-sm",
            sizes_autopick
              ? "border-[var(--brand-500)] bg-[var(--brand-50)] text-[var(--brand-700)]"
              : "border-gray-300 text-gray-600"
          )}
        >
          Не знаю — подобрать автоматически
        </button>
      </div>

      {guideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-sm rounded-lg bg-white p-6 text-sm">
            <h3 className="mb-2 text-lg font-semibold">Как снять мерки</h3>
            <p className="mb-2">
              Грудь: сантиметр горизонтально по самым выступающим точкам.
            </p>
            <p className="mb-2">Талия: самая узкая часть, не втягивайте живот.</p>
            <p className="mb-4">
              Бёдра: по самым выступающим точкам ягодиц. Сантиметр не натягивайте.
            </p>
            <button
              type="button"
              className="button primary w-full"
              onClick={() => setGuideOpen(false)}
            >
              Понятно
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

