import { useState } from "react";
import clsx from "clsx";
import type { SizeProfile, UnitSystem, Fit, PantsCut } from "../../types/sizes";

interface SizeStepProps {
  profile: SizeProfile;
  onChange: (profile: SizeProfile) => void;
}

const SIZE_OPTIONS = Array.from({ length: 10 }, (_, i) => 38 + i * 2);

function formatSize(ru: number) {
  const eu = ru + 2;
  const us = ru >= 54 ? "XL" : ru >= 50 ? "L" : ru >= 46 ? "M" : ru >= 42 ? "S" : "XS";
  return `RU ${ru} • EU ${eu} • US ${us}`;
}

export default function SizeStep({ profile, onChange }: SizeStepProps) {
  const [showGuide, setShowGuide] = useState(false);
  const unit = profile.unit;

  const setUnit = (u: UnitSystem) => {
    if (u === unit) return;
    onChange({ ...profile, unit: u });
  };

  const handleInput = (field: keyof SizeProfile, value: string) => {
    if (field === "jeans_waist_in") {
      const num = value ? Number(value) : undefined;
      onChange({ ...profile, jeans_waist_in: num });
      return;
    }
    if (field === "top_size_ru" || field === "bottom_size_ru") {
      const num = value ? Number(value) : undefined;
      onChange({ ...profile, [field]: num });
      return;
    }
    if (field === "jeans_inseam") {
      const num = value ? Number(value) : undefined;
      const cm = unit === "metric" ? num : num !== undefined ? Math.round(num * 2.54) : undefined;
      onChange({ ...profile, jeans_inseam: cm });
      return;
    }
    const num = value ? Number(value) : undefined;
    const cm = unit === "metric" ? num : num !== undefined ? Math.round(num * 2.54) : undefined;
    onChange({ ...profile, [field]: cm } as SizeProfile);
  };

  const display = (field: keyof SizeProfile) => {
    const v = profile[field];
    if (v == null) return "";
    if (field === "jeans_waist_in") return String(v);
    if (field === "top_size_ru" || field === "bottom_size_ru") return String(v);
    if (field === "jeans_inseam") {
      return unit === "metric" ? String(v) : (v / 2.54).toFixed(0);
    }
    return unit === "metric" ? String(v) : (v / 2.54).toFixed(0);
  };

  const fitOptions: { id: Fit; label: string }[] = [
    { id: "tight", label: "Облегающий" },
    { id: "regular", label: "Regular" },
    { id: "relaxed", label: "Свободный" },
    { id: "oversized", label: "Oversized" },
  ];
  const cutOptions: { id: PantsCut; label: string }[] = [
    { id: "straight", label: "Straight" },
    { id: "slim", label: "Slim" },
    { id: "wide", label: "Wide/Loose" },
    { id: "flare", label: "Flare" },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-end text-sm">
        <button
          type="button"
          onClick={() => setUnit("metric")}
          className={clsx(unit === "metric" && "font-semibold")}
        >
          см
        </button>
        <span className="mx-1">/</span>
        <button
          type="button"
          onClick={() => setUnit("imperial")}
          className={clsx(unit === "imperial" && "font-semibold")}
        >
          inch
        </button>
      </div>
      <div className={clsx(profile.autopick && "opacity-50")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <select
            className="input w-full"
            value={display("top_size_ru")}
            onChange={(e) => handleInput("top_size_ru", e.target.value)}
          >
            <option value="">Верх (RU/EU/US)</option>
            {SIZE_OPTIONS.map((ru) => (
              <option key={ru} value={ru}>{formatSize(ru)}</option>
            ))}
          </select>
          <select
            className="input w-full"
            value={display("bottom_size_ru")}
            onChange={(e) => handleInput("bottom_size_ru", e.target.value)}
          >
            <option value="">Низ (RU/EU/US)</option>
            {SIZE_OPTIONS.map((ru) => (
              <option key={ru} value={ru}>{formatSize(ru)}</option>
            ))}
          </select>
          <div>
            <div className="flex gap-2">
              <input
                type="number"
                className="input w-full"
                placeholder="W — талия в дюймах"
                value={display("jeans_waist_in")}
                onChange={(e) => handleInput("jeans_waist_in", e.target.value)}
              />
              <input
                type="number"
                className="input w-full"
                placeholder="L — длина по внутреннему шву"
                value={display("jeans_inseam")}
                onChange={(e) => handleInput("jeans_inseam", e.target.value)}
              />
            </div>
            <div className="mt-1 text-xs text-gray-500">
              W — талия в дюймах. L — длина по внутреннему шву (если не знаете — оставьте пустым).
            </div>
          </div>
          <div>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                className="input"
                placeholder="Грудь"
                value={display("bust_cm")}
                onChange={(e) => handleInput("bust_cm", e.target.value)}
              />
              <input
                type="number"
                className="input"
                placeholder="Талия"
                value={display("waist_cm")}
                onChange={(e) => handleInput("waist_cm", e.target.value)}
              />
              <input
                type="number"
                className="input"
                placeholder="Бёдра"
                value={display("hips_cm")}
                onChange={(e) => handleInput("hips_cm", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-2 text-sm">Посадка верха</div>
            <div className="flex flex-wrap gap-2">
              {fitOptions.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={profile.top_fit === o.id}
                  onClick={() => onChange({ ...profile, top_fit: o.id })}
                  className={clsx(
                    "rounded-full border px-3 py-1 text-sm",
                    profile.top_fit === o.id
                      ? "border-[var(--brand-500)] bg-[var(--brand-50)]"
                      : "border-gray-300"
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm">Крой брюк</div>
            <div className="flex flex-wrap gap-2">
              {cutOptions.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={profile.pants_cut === o.id}
                  onClick={() => onChange({ ...profile, pants_cut: o.id })}
                  className={clsx(
                    "rounded-full border px-3 py-1 text-sm",
                    profile.pants_cut === o.id
                      ? "border-[var(--brand-500)] bg-[var(--brand-50)]"
                      : "border-gray-300"
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="rounded-full border px-3 py-1 text-sm text-gray-600"
          onClick={() => setShowGuide(true)}
        >
          Как снять мерки
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...profile, autopick: !profile.autopick })}
          className={clsx(
            "rounded-full border px-3 py-1 text-sm",
            profile.autopick
              ? "border-[var(--brand-500)] bg-[var(--brand-50)]"
              : "border-gray-300 text-gray-600"
          )}
        >
          {profile.autopick
            ? "Не знаю — определяем автоматически"
            : "Не знаю — определить автоматически"}
        </button>
      </div>
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-w-sm rounded bg-white p-4">
            <h3 className="mb-2 text-lg font-semibold">Как снять мерки</h3>
            <p className="mb-2 text-sm">
              Грудь: сантиметр горизонтально по самым выступающим точкам. Талия: самая узкая часть, не втягивайте живот. Бёдра: по самым выступающим точкам ягодиц. Сантиметр не натягивайте.
            </p>
            <button
              type="button"
              className="mt-2 rounded bg-[var(--brand-500)] px-3 py-1 text-white"
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
