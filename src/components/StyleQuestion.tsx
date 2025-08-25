"use client";

import { useEffect, useRef, useState } from "react";

interface StyleOption {
  id: string;
  title: string;
  img: string;
  tags: string[];
  examples: string[];
}

interface StyleStepProps {
  selected: string[];
  onChange: (styles: string[]) => void;
  goal: string;
  budget: number;
}

const OPTIONS: StyleOption[] = [
  {
    id: "minimalism",
    title: "Минимализм",
    img: "/styles/minimalism.jpg",
    tags: ["чистые линии", "нейтральная палитра"],
    examples: [
      "https://via.placeholder.com/300x375?text=min1",
      "https://via.placeholder.com/300x375?text=min2",
      "https://via.placeholder.com/300x375?text=min3",
    ],
  },
  {
    id: "smart_casual",
    title: "Смарт-кэжуал",
    img: "/styles/smart-casual.jpg",
    tags: ["офис-повседневно", "слои"],
    examples: [
      "https://via.placeholder.com/300x375?text=sm1",
      "https://via.placeholder.com/300x375?text=sm2",
      "https://via.placeholder.com/300x375?text=sm3",
    ],
  },
  {
    id: "sport_casual",
    title: "Спорт-кэжуал",
    img: "/styles/sport-casual.jpg",
    tags: ["комфорт", "функционально"],
    examples: [
      "https://via.placeholder.com/300x375?text=sp1",
      "https://via.placeholder.com/300x375?text=sp2",
      "https://via.placeholder.com/300x375?text=sp3",
    ],
  },
  {
    id: "street_light",
    title: "Стрит-лайт",
    img: "/styles/street-light.jpg",
    tags: ["свободный крой", "акцент-пара"],
    examples: [
      "https://via.placeholder.com/300x375?text=st1",
      "https://via.placeholder.com/300x375?text=st2",
      "https://via.placeholder.com/300x375?text=st3",
    ],
  },
];

const GOAL_DEFAULTS: Record<string, string[]> = {
  office_casual: ["smart_casual", "minimalism"],
  date: ["smart_casual", "street_light"],
  weekend: ["smart_casual", "street_light"],
  season_update: ["minimalism", "sport_casual"],
};

export function StyleQuestion({ selected, onChange, goal, budget }: StyleStepProps) {
  const max = 2;
  const [auto, setAuto] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const [examplesOpen, setExamplesOpen] = useState(false);
  const [tab, setTab] = useState(OPTIONS[0].id);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const baseAnalytics = {
    quiz_id: typeof window !== "undefined" ? localStorage.getItem("quiz_id") : undefined,
    ab_variant: typeof window !== "undefined" ? localStorage.getItem("ab_variant") : undefined,
    goal,
    budget,
  };

  const track = (event: string, props?: Record<string, unknown>) => {
    if (typeof window !== "undefined") {
      const win = window as unknown as {
        plausible?: (e: string, o?: { props: Record<string, unknown> }) => void;
        ym?: (id: number, type: string, name: string) => void;
      };
      win.plausible?.(event, { props: { ...baseAnalytics, ...props } });
      const ymId = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID;
      if (ymId) win.ym?.(Number(ymId), "reachGoal", event);
    }
  };

  useEffect(() => {
    OPTIONS.forEach((o) => track("style_card_view", { style: o.id }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const limitReached = selected.length >= max;

  const handleSelect = (id: string) => {
    setAuto(false);
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
      track("style_card_deselect", { style: id });
    } else if (limitReached) {
      setTooltip(true);
      setTimeout(() => setTooltip(false), 2000);
    } else {
      onChange([...selected, id]);
      track("style_card_select", { style: id });
    }
  };

  const toggleAuto = () => {
    const next = !auto;
    setAuto(next);
    track("style_autopick_toggle", { on: next ? "on" : "off" });
    if (next) {
      const defaults = GOAL_DEFAULTS[goal] ?? [];
      onChange(defaults.slice(0, max));
    } else {
      onChange([]);
    }
  };

  const openExamples = () => {
    setExamplesOpen(true);
    track("style_examples_open", { style: tab });
  };

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExamplesOpen(false);
    };
    if (examplesOpen) {
      window.addEventListener("keydown", esc);
    }
    return () => window.removeEventListener("keydown", esc);
  }, [examplesOpen]);

  const handleKeyNav = (e: React.KeyboardEvent<HTMLDivElement>, idx: number) => {
    const cols = typeof window !== "undefined" && window.innerWidth >= 640 ? 4 : 2;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (idx + 1) % OPTIONS.length;
      cardRefs.current[next]?.focus();
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (idx - 1 + OPTIONS.length) % OPTIONS.length;
      cardRefs.current[prev]?.focus();
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (idx + cols) % OPTIONS.length;
      cardRefs.current[next]?.focus();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (idx - cols + OPTIONS.length) % OPTIONS.length;
      cardRefs.current[prev]?.focus();
    }
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Стиль (до 2)</h2>
        <div className="text-sm text-gray-500">{selected.length}/2</div>
      </div>
      <p className="mb-4 text-sm text-gray-600">
        Выберите, как вы хотите выглядеть. Можно пропустить
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {OPTIONS.map((o, idx) => {
          const isSel = selected.includes(o.id);
          const disabled = limitReached && !isSel;
          return (
            <div
              key={o.id}
              ref={(el) => (cardRefs.current[idx] = el)}
              role="button"
              aria-pressed={isSel}
              tabIndex={0}
              onClick={() => !disabled && handleSelect(o.id)}
              onKeyDown={(e) => {
                if (disabled) return;
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  handleSelect(o.id);
                }
                handleKeyNav(e, idx);
              }}
              className={`relative flex flex-col overflow-hidden rounded-xl border bg-white transition
              ${isSel ? "border-[var(--brand-500)] shadow-[0_0_0_2px_rgba(232,132,93,.4)]" : "border-black/10"}
              ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:shadow-md"}
              `}
              style={{ aspectRatio: "4/5" }}
            >
              <img
                src={o.img}
                alt=""
                className="h-2/3 w-full object-cover"
                loading="lazy"
              />
              <div className="p-2">
                <div className="font-semibold">{o.title}</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {o.tags.map((t) => (
                    <span key={t} className="badge neutral text-[12px] uppercase">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              {isSel && (
                <span className="absolute right-2 top-2 rounded-full bg-[var(--brand-500)] p-1 text-white">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Можно выбрать до двух. Не уверены — мы подскажем
      </p>
      {tooltip && (
        <p className="mt-2 text-sm text-red-500">Можно выбрать до двух</p>
      )}
      {selected.length === max && (
        <p className="mt-2 text-sm text-gray-500">Можно менять выбор</p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={toggleAuto}
          className={`pill ${auto ? "bg-[var(--brand-500)] text-white" : ""}`}
        >
          Не уверен — выбрать за меня
        </button>
        <button
          type="button"
          className="text-sm underline"
          onClick={openExamples}
        >
          Примеры
        </button>
      </div>
      {examplesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-lg rounded-xl bg-white p-4 shadow-lg">
            <button
              aria-label="Закрыть"
              className="absolute right-4 top-4"
              onClick={() => setExamplesOpen(false)}
            >
              ✕
            </button>
            <div className="mb-4 flex gap-2">
              {OPTIONS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setTab(o.id)}
                  className={`pill ${tab === o.id ? "bg-[var(--brand-500)] text-white" : ""}`}
                >
                  {o.title}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {OPTIONS.find((o) => o.id === tab)!.examples.map((img, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-lg border border-black/10"
                  style={{ aspectRatio: "4/5" }}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StyleQuestion;

