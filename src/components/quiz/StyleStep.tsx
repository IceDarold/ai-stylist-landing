import { useEffect, useState } from "react";
import clsx from "clsx";

export interface StyleStepProps {
  selected: string[];
  onChange: (styles: string[]) => void;
  useCase?: string;
}

interface StyleOption {
  id: string;
  title: string;
  tags: string[];
  cover: string;
}

const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 100'%3E%3Crect width='80' height='100' fill='%23E5E7EB'/%3E%3Cpath d='M20 65l12-15 8 10 12-16 8 21H20z' fill='%239CA3AF'/%3E%3C/svg%3E";

const OPTIONS: StyleOption[] = [
  {
    id: "minimal",
    title: "Минимализм",
    tags: ["чистые линии", "натуральные ткани"],
    cover: "/quiz/styles/minimal.jpg",
  },
  {
    id: "casual",
    title: "Кэжуал",
    tags: ["свободно", "ежедневно"],
    cover: "/quiz/styles/casual.jpg",
  },
  {
    id: "classic",
    title: "Классика",
    tags: ["строго", "структурно"],
    cover: "/quiz/styles/classic.jpg",
  },
  {
    id: "sport",
    title: "Спорт-шик",
    tags: ["удобно", "активно"],
    cover: "/quiz/styles/sport.jpg",
  },
];

const AUTO_PICK: Record<string, string[]> = {
  office: ["casual", "classic"],
  office_casual: ["casual", "classic"],
  date: ["casual", "classic"],
  weekend: ["casual", "sport"],
  season: ["minimal", "sport"],
  season_update: ["minimal", "sport"],
};

export default function StyleStep({ selected, onChange, useCase }: StyleStepProps) {
  const [auto, setAuto] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [limitHit, setLimitHit] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (auto) {
      const defaults = AUTO_PICK[useCase || ""] || [];
      onChange(defaults.slice(0, 2));
    }
  }, [auto, useCase, onChange]);

  useEffect(() => {
    if (limitHit) {
      const t = setTimeout(() => setLimitHit(false), 600);
      const to = setTimeout(() => setToast(null), 2000);
      return () => {
        clearTimeout(t);
        clearTimeout(to);
      };
    }
  }, [limitHit]);

  useEffect(() => {
    OPTIONS.forEach((opt) => sendEvent("style_card_view", { id: opt.id }));
  }, []);

  const toggle = (id: string) => {
    let current = selected;
    if (auto) {
      const agree = confirm("Отключить автоматический выбор и выбрать вручную?");
      if (!agree) return;
      setAuto(false);
      current = [];
      onChange([]);
    }

    const exists = current.includes(id);
    if (exists) {
      const next = current.filter((s) => s !== id);
      onChange(next);
      sendEvent("style_deselect", { id, total: next.length });
      return;
    }

    if (current.length >= 2) {
      setToast("Не более двух стилей");
      setLimitHit(true);
      sendEvent("style_limit_hit");
      return;
    }

    const next = [...current, id];
    onChange(next);
    sendEvent("style_select", { id, total: next.length });
  };

  const handleAuto = () => {
    const next = !auto;
    setAuto(next);
    if (next) {
      const defaults = AUTO_PICK[useCase || ""] || [];
      onChange(defaults.slice(0, 2));
    } else {
      onChange([]);
    }
    sendEvent("style_auto_pick_toggle", { value: next });
  };

  const count = selected.length;
  const counterClass = clsx("text-sm", limitHit ? "text-red-500 animate-shake" : "text-gray-500");

  return (
    <div>
      <div className="mb-4">
        <div className="text-xs text-gray-500">Шаг 9/14</div>
        <div className="my-1 h-1.5 w-full rounded bg-[#E9EAEC]">
          <div className="h-full rounded bg-[var(--brand-500)]" style={{ width: `${(9 / 14) * 100}%` }} />
        </div>
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold">Стиль (до 2)</h2>
          <span className={counterClass}>{limitHit ? "3/2" : `${count}/2`}</span>
        </div>
      </div>
      <p className="text-gray-600">Выберите, как вы хотите выглядеть. Можно пропустить.</p>
      <p className="mt-1 text-sm text-gray-500">Можно выбрать до двух. Не уверены — мы подскажем.</p>
      {toast && <div className="mt-2 rounded bg-red-50 px-3 py-2 text-sm text-red-600">{toast}</div>}
      <div
        role="listbox"
        aria-multiselectable="true"
        className="mt-4 flex gap-4 overflow-x-auto md:grid md:grid-cols-3 md:gap-4 lg:grid-cols-4"
      >
        {OPTIONS.map((opt) => {
          const isSelected = selected.includes(opt.id);
          const blocked = count >= 2 && !isSelected;
          const isDisabled = auto || blocked;
          return (
            <button
              key={opt.id}
              type="button"
              role="option"
              aria-selected={isSelected}
              aria-disabled={isDisabled}
              onClick={() => toggle(opt.id)}
              className={clsx(
                "relative flex w-[calc(50%-8px)] flex-shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-[#E8E9ED] bg-[#F7F7F8] text-left shadow-[0_6px_20px_rgba(0,0,0,0.06)] transition md:w-auto",
                "focus:outline-none",
                !isDisabled &&
                  "hover:-translate-y-0.5 hover:border-[var(--brand-500)] focus-visible:border-[var(--brand-500)]",
                isDisabled && "cursor-not-allowed opacity-40",
                isSelected && "border-2 border-[var(--brand-500)]"
              )}
            >
              <div className="relative aspect-[4/5] w-full">
                <img
                  src={opt.cover}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK;
                  }}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-3">
                <div className="font-medium">{opt.title}</div>
                <div className="mt-1 flex flex-wrap gap-1 text-xs text-gray-600">
                  {opt.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/60 px-2 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {isSelected && (
                <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand-500)] text-white">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={handleAuto}
            className={clsx(
              "rounded-full border px-4 py-1 text-sm",
              auto
                ? "border-[var(--brand-500)] bg-[var(--brand-50)] text-[var(--brand-700)]"
                : "border-gray-300 text-gray-600"
            )}
          >
            Не уверен — выбрать за меня
          </button>
          {auto && <div className="mt-2 text-xs text-gray-500">Мы подберём стиль на основе ваших ответов</div>}
        </div>
        <button
          type="button"
          className="text-sm text-[var(--brand-600)] underline"
          onClick={() => {
            setShowExamples(true);
            sendEvent("style_examples_open");
          }}
        >
          Примеры
        </button>
      </div>
      {showExamples && <ExamplesModal onClose={() => setShowExamples(false)} />}
    </div>
  );
}

function ExamplesModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState(OPTIONS[0].id);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="max-h-full w-full max-w-2xl overflow-auto rounded-xl bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex flex-wrap gap-2">
          {OPTIONS.map((opt) => (
            <button
              key={opt.id}
              className={clsx(
                "rounded-full px-3 py-1 text-sm",
                tab === opt.id
                  ? "bg-[var(--brand-500)] text-white"
                  : "bg-gray-100 text-gray-700"
              )}
              onClick={() => setTab(opt.id)}
            >
              {opt.title}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={`/quiz/styles/examples/${tab}-${i}.jpg`}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK;
                  }}
                />
              </div>
              <div className="text-sm text-gray-600">как комбинировать</div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-right">
          <button className="button" onClick={onClose}>
            Закрыть
          </button>
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

