
import { useState } from "react";
import clsx from "clsx";

export type UnitSystem = "metric" | "imperial";
export type Fit = "tight" | "regular" | "relaxed" | "oversized";
export type PantsCut = "straight" | "slim" | "wide" | "flare";

export interface SizeProfile {
  unit: UnitSystem;
  top_size_ru?: number;
  bottom_size_ru?: number;
  jeans_waist_in?: number;
  jeans_inseam?: number; // stored in cm
  bust_cm?: number;
  waist_cm?: number;
  hips_cm?: number;
  top_fit?: Fit;
  pants_cut?: PantsCut;
  autopick: boolean;
}

interface MeasurementsStepProps {
  profile: SizeProfile;
  onChange: (profile: SizeProfile) => void;
  height?: number;
  weight?: number;
}

const SIZE_MAP = [
  { ru: 44, eu: 46, us: "XS" },
  { ru: 46, eu: 48, us: "S" },
  { ru: 48, eu: 50, us: "M" },
  { ru: 50, eu: 52, us: "M" },
  { ru: 52, eu: 54, us: "L" },
  { ru: 54, eu: 56, us: "L" },
  { ru: 56, eu: 58, us: "XL" },
];

const cmToIn = (cm: number) => cm / 2.54;
const inToCm = (inch: number) => inch * 2.54;

export default function MeasurementsStep({ profile, onChange, height, weight }: MeasurementsStepProps) {
  const [showGuide, setShowGuide] = useState(false);

  const setField = (field: keyof SizeProfile, value: unknown) => {
    onChange({ ...profile, [field]: value });
  };

  const displayMeasure = (cm?: number) => {
    if (cm === undefined) return "";
    return profile.unit === "metric" ? String(Math.round(cm)) : String(Math.round(cmToIn(cm) * 10) / 10);
  };

  const parseMeasure = (value: string) => {
    if (!value) return undefined;
    const num = Number(value);
    if (Number.isNaN(num)) return undefined;
    return profile.unit === "metric" ? num : inToCm(num);
  };

  const handleUnitChange = (unit: UnitSystem) => {
    if (unit === profile.unit) return;
    onChange({ ...profile, unit });
  };

  const filled = [
    profile.top_size_ru,
    profile.bottom_size_ru,
    profile.jeans_waist_in,
    profile.bust_cm,
    profile.waist_cm,
    profile.hips_cm,
  ].filter((v) => v !== undefined).length;

  let summary = "Нужны уточнения";
  if (filled >= 4) summary = "Хороший";
  else if (filled > 0) summary = "Норм";

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Размеры</h2>
        <div className="flex gap-1 text-sm" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={profile.unit === "metric"}
            className={clsx("rounded px-2 py-1", profile.unit === "metric" && "bg-gray-200")}
            onClick={() => handleUnitChange("metric")}
          >
            см
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={profile.unit === "imperial"}
            className={clsx("rounded px-2 py-1", profile.unit === "imperial" && "bg-gray-200")}
            onClick={() => handleUnitChange("imperial")}
          >
            inch
          </button>
        </div>
      </div>
      <p className="mb-4 text-sm text-gray-600">Не уверены? Нажмите «Не знаю» — мы подберём автоматически</p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <select
          className="input w-full"
          value={profile.top_size_ru ?? ""}
          onChange={(e) => setField("top_size_ru", e.target.value ? Number(e.target.value) : undefined)}
          disabled={profile.autopick}
        >
          <option value="">Верх (RU/EU/US)</option>
          {SIZE_MAP.map((s) => (
            <option key={s.ru} value={s.ru}>{`RU ${s.ru} • EU ${s.eu} • US ${s.us}`}</option>
          ))}
        </select>
        <select
          className="input w-full"
          value={profile.bottom_size_ru ?? ""}
          onChange={(e) => setField("bottom_size_ru", e.target.value ? Number(e.target.value) : undefined)}
          disabled={profile.autopick}
        >
          <option value="">Низ (RU/EU/US)</option>
          {SIZE_MAP.map((s) => (
            <option key={s.ru} value={s.ru}>{`RU ${s.ru} • EU ${s.eu} • US ${s.us}`}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            type="number"
            className="input w-full"
            placeholder="W — талия"
            value={profile.jeans_waist_in ?? ""}
            onChange={(e) => setField("jeans_waist_in", e.target.value ? Number(e.target.value) : undefined)}
            disabled={profile.autopick}
          />
          <input
            type="number"
            className="input w-full"
            placeholder={profile.unit === "metric" ? "L — шаг (см)" : "L — inseam (inch)"}
            value={profile.jeans_inseam !== undefined ? displayMeasure(profile.jeans_inseam) : ""}
            onChange={(e) => setField("jeans_inseam", parseMeasure(e.target.value))}
            disabled={profile.autopick}
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            className="input"
            placeholder="Грудь"
            value={displayMeasure(profile.bust_cm)}
            onChange={(e) => setField("bust_cm", parseMeasure(e.target.value))}
            disabled={profile.autopick}
          />
          <input
            type="number"
            className="input"
            placeholder="Талия"
            value={displayMeasure(profile.waist_cm)}
            onChange={(e) => setField("waist_cm", parseMeasure(e.target.value))}
            disabled={profile.autopick}
          />
          <input
            type="number"
            className="input"
            placeholder="Бёдра"
            value={displayMeasure(profile.hips_cm)}
            onChange={(e) => setField("hips_cm", parseMeasure(e.target.value))}
            disabled={profile.autopick}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "tight", label: "Облегающий" },
            { id: "regular", label: "Regular" },
            { id: "relaxed", label: "Свободный" },
            { id: "oversized", label: "Oversized" },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={profile.top_fit === opt.id}
              className={clsx(
                "rounded-full px-3 py-1 text-sm",
                profile.top_fit === opt.id ? "bg-[var(--brand-500)] text-white" : "bg-gray-200 text-gray-700"
              )}
              onClick={() => setField("top_fit", opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "straight", label: "Straight" },
            { id: "slim", label: "Slim" },
            { id: "wide", label: "Wide/Loose" },
            { id: "flare", label: "Flare" },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={profile.pants_cut === opt.id}
              className={clsx(
                "rounded-full px-3 py-1 text-sm",
                profile.pants_cut === opt.id ? "bg-[var(--brand-500)] text-white" : "bg-gray-200 text-gray-700"
              )}
              onClick={() => setField("pants_cut", opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className={clsx("rounded-full border px-3 py-1 text-sm", profile.autopick && "bg-[var(--brand-50)]")}
          onClick={() => setField("autopick", !profile.autopick)}
        >
          Не знаю — определить автоматически
        </button>
        <button type="button" className="text-sm underline" onClick={() => setShowGuide(true)}>
          Как снять мерки
        </button>
      </div>

      {profile.autopick && (
        <div className="mt-2 text-sm text-gray-600">
          {height && weight ? "Мы предложим размер по вашему росту и весу" : "Мы подберём размеры автоматически"}
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600">
        Профиль размеров: <span className="font-medium">{summary}</span>
      </div>

      {showGuide && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-w-sm rounded-lg bg-white p-4">
            <h3 className="mb-2 text-lg font-semibold">Как снять мерки</h3>
            <p className="text-sm text-gray-600">
              Грудь: сантиметр горизонтально по самым выступающим точкам.
              Талия: самая узкая часть, не втягивайте живот.
              Бёдра: по самым выступающим точкам ягодиц. Сантиметр не натягивайте.
            </p>
            <button
              type="button"
              className="mt-4 rounded bg-[var(--brand-500)] px-4 py-2 text-white"
              onClick={() => setShowGuide(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
