"use client";

import Image from "next/image";
import { useState } from "react";

export interface StyleStepProps {
  selected: string[];
  goal: string;
  onChange: (values: string[]) => void;
}

interface StyleOption {
  id: string;
  title: string;
  chips: string[];
  image: string;
  examples: string[];
}

const OPTIONS: StyleOption[] = [
  {
    id: "minimal",
    title: "Минимализм",
    chips: ["чистые линии", "нейтральная палитра"],
    image: "/styles/minimalism.jpg",
    examples: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=60",
    ],
  },
  {
    id: "smart_casual",
    title: "Смарт-кэжуал",
    chips: ["офис-поседневно", "слои"],
    image: "/styles/smart-casual.jpg",
    examples: [
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1539109136881-3be061c0271a?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1543320460-322271e0b37c?auto=format&fit=crop&w=400&q=60",
    ],
  },
  {
    id: "sport_casual",
    title: "Спорт-кэжуал",
    chips: ["комфорт", "функционально"],
    image: "/styles/sport-casual.jpg",
    examples: [
      "https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1548027131-3fdcedf4a3fa?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1602810311526-090c1f3ba3fb?auto=format&fit=crop&w=400&q=60",
    ],
  },
  {
    id: "street_light",
    title: "Стрит-лайт",
    chips: ["свободный крой", "акцент-пара"],
    image: "/styles/street-light.jpg",
    examples: [
      "https://images.unsplash.com/photo-1550246140-29f40b909e03?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1520975918318-3eea9f1f5a3a?auto=format&fit=crop&w=400&q=60",
      "https://images.unsplash.com/photo-1535920527001-756c657b5fd1?auto=format&fit=crop&w=400&q=60",
    ],
  },
];

const AUTO_PICK: Record<string, string[]> = {
  office_casual: ["smart_casual", "minimal"],
  date: ["smart_casual", "street_light"],
  weekend: ["smart_casual", "street_light"],
  season_update: ["minimal", "sport_casual"],
};

export function StyleStep({ selected, goal, onChange }: StyleStepProps) {
  const [autoPick, setAutoPick] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [tab, setTab] = useState(OPTIONS[0].id);

  const toggle = (id: string) => {
    let next = selected;
    const isActive = selected.includes(id);
    if (autoPick) setAutoPick(false);
    if (isActive) {
      next = selected.filter((s) => s !== id);
    } else {
      if (selected.length >= 2) {
        alert("Можно выбрать до двух");
        return;
      }
      next = [...selected, id];
    }
    onChange(next);
  };

  const handleAutoPick = () => {
    if (autoPick) {
      setAutoPick(false);
      onChange([]);
      return;
    }
    const picked = AUTO_PICK[goal] ?? [];
    setAutoPick(true);
    onChange(picked.slice(0, 2));
  };

  const current = OPTIONS.find((o) => o.id === tab)!;

  return (
    <div>
      <h2 className="mb-2 text-xl font-semibold">
        Стиль (до 2) <span className="text-sm text-fg-secondary">{selected.length}/2</span>
      </h2>
      <p className="mb-4 text-sm text-fg-secondary">
        Выберите, как вы хотите выглядеть. Можно пропустить
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {OPTIONS.map((opt) => {
          const active = selected.includes(opt.id);
          const disabled = selected.length >= 2 && !active;
          return (
            <div
              key={opt.id}
              role="button"
              tabIndex={0}
              aria-pressed={active}
              onClick={() => !disabled && toggle(opt.id)}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && !disabled) {
                  e.preventDefault();
                  toggle(opt.id);
                }
              }}
              className={`relative flex flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm transition transform ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:shadow-md hover:scale-[1.02]"} ${active ? "ring-2 ring-brand-500" : ""}`}
              style={{ aspectRatio: "4/5" }}
            >
              <div className="relative h-3/5 w-full flex-1">
                <Image src={opt.image} alt="" fill className="object-cover" />
                {active && (
                  <div className="absolute right-2 top-2 rounded-full bg-brand-500 p-1 text-white">
                    ✓
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="font-medium">{opt.title}</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {opt.chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full bg-accent-50 px-2 py-1 text-[11px] uppercase text-accent-700"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {selected.length === 2 && (
        <div className="mt-2 text-sm text-fg-secondary">Можно менять выбор</div>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleAutoPick}
          className={`pill text-sm ${autoPick ? "bg-brand-500 text-white" : ""}`}
        >
          Не уверен — выбрать за меня
        </button>
        <button
          type="button"
          onClick={() => {
            setTab(OPTIONS[0].id);
            setShowExamples(true);
          }}
          className="text-sm underline"
        >
          Примеры
        </button>
      </div>

      {showExamples && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-full w-full max-w-2xl overflow-auto rounded-xl bg-white p-4 shadow-lg">
            <div className="mb-4 flex justify-between">
              <div className="flex gap-4">
                {OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    className={`text-sm ${o.id === tab ? "font-semibold" : "text-fg-secondary"}`}
                    onClick={() => setTab(o.id)}
                  >
                    {o.title}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowExamples(false)}>✕</button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {current.examples.map((src) => (
                <figure key={src} className="aspect-[3/4] overflow-hidden rounded-md">
                  <Image src={src} alt="Пример" fill className="object-cover" />
                  <figcaption className="sr-only">как комбинировать</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StyleStep;

