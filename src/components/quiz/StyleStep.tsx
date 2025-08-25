import { useEffect, useState } from "react";
import clsx from "clsx";
import { toggleStyle } from "./styleLogic";

export interface StyleStepProps {
  selected: string[];
  onChange: (styles: string[]) => void;
  goal: string;
}

interface StyleOption {
  id: string;
  title: string;
  tags: string[];
  cover: string;
}

const OPTIONS: StyleOption[] = [
  {
    id: "minimal",
    title: "Минимализм",
    tags: ["чистые линии", "нейтральная палитра"],
    cover: "/quiz/styles/minimal.jpg",
  },
  {
    id: "smart_casual",
    title: "Смарт-кэжуал",
    tags: ["офис-повседневно", "слои"],
    cover: "/quiz/styles/casual.jpg",
  },
  {
    id: "sport_casual",
    title: "Спорт-кэжуал",
    tags: ["комфорт", "функционально"],
    cover: "/quiz/styles/sport.jpg",
  },
  {
    id: "street_light",
    title: "Стрит-лайт",
    tags: ["свободный крой", "акцент-пара"],
    cover: "/quiz/styles/street.jpg",
  },
];

const AUTO_PICK: Record<string, string[]> = {
  office_casual: ["smart_casual", "minimal"],
  date: ["smart_casual", "street_light"],
  weekend: ["smart_casual", "street_light"],
  season_update: ["minimal", "sport_casual"],
};

export default function StyleStep({ selected, onChange, goal }: StyleStepProps) {
  const [auto, setAuto] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [limitHit, setLimitHit] = useState(false);

  useEffect(() => {
    if (auto) {
      const defaults = AUTO_PICK[goal] || [];
      onChange(defaults.slice(0, 2));
    }
  }, [auto, goal, onChange]);

  const handleSelect = (id: string) => {
    if (auto) {
      const proceed = confirm(
        "Отключить автоматический выбор и выбрать вручную?"
      );
      if (!proceed) return;
      setAuto(false);
    }
    const { next, limitHit } = toggleStyle(selected, id, 2);
    if (limitHit) {
      setLimitHit(true);
      sendEvent("style_limit_hit", { style: id });
      setTimeout(() => setLimitHit(false), 600);
      return;
    }
    onChange(next);
    sendEvent(next.includes(id) ? "style_select" : "style_deselect", {
      id,
      total: next.length,
    });
  };

  const handleAuto = () => {
    const next = !auto;
    setAuto(next);
    if (next) {
      const defaults = AUTO_PICK[goal] || [];
      onChange(defaults.slice(0, 2));
    } else {
      onChange([]);
    }
    sendEvent("style_auto_pick_toggle", { value: next });
  };

  const count = selected.length;

  useEffect(() => {
    OPTIONS.forEach((opt) => sendEvent("style_card_view", { id: opt.id }));
  }, []);

  const displayCount = limitHit ? count + 1 : count;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">Стиль (до 2)</h2>
        <div
          className={clsx(
            "text-sm",
            limitHit ? "text-red-500" : "text-gray-500",
            limitHit && "shake"
          )}
        >
          {displayCount}/2
        </div>
      </div>
      <p className="mb-2 text-sm text-gray-500">
        Выберите, как вы хотите выглядеть. Можно пропустить.
      </p>
      <p className="mb-4 text-xs text-gray-500">
        Можно выбрать до двух. Не уверены — мы подскажем.
      </p>
      <div
        className={clsx(
          "flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 md:grid-cols-4",
          limitHit && "shake"
        )}
        role="listbox"
        aria-multiselectable="true"
      >
        {OPTIONS.map((opt) => {
          const isSelected = selected.includes(opt.id);
          const disabled = auto || (!isSelected && count >= 2);
          return (
            <button
              key={opt.id}
              type="button"
              role="option"
              aria-selected={isSelected}
              aria-disabled={disabled}
              tabIndex={0}
              onClick={() => handleSelect(opt.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(opt.id);
                }
              }}
              className={clsx(
                "relative flex min-w-[240px] flex-col rounded-2xl border p-3 text-left transition",
                "aspect-[4/5] overflow-hidden bg-[#F7F7F8] shadow-[0_6px_20px_rgba(0,0,0,0.06)] border-[#E8E9ED]",
                disabled && "cursor-not-allowed opacity-40",
                isSelected && "border-[var(--brand-500)]",
                !isSelected && !disabled && "hover:-translate-y-0.5 hover:border-[var(--brand-500)]"
              )}
            >
              <div className="relative mb-2 aspect-[4/5] w-full overflow-hidden rounded-xl">
                <img
                  src={opt.cover}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/file.svg";
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="font-medium">{opt.title}</div>
              <div className="mt-1 flex flex-wrap gap-1 text-xs text-gray-500">
                {opt.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
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
      {limitHit && (
        <div className="mt-2 text-sm text-red-500">Не более двух стилей</div>
      )}
      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={handleAuto}
            className={clsx(
              "rounded-full border px-3 py-1 text-sm",
              auto
                ? "border-[var(--brand-500)] bg-[var(--brand-50)] text-[var(--brand-700)]"
                : "border-gray-300 text-gray-600"
            )}
          >
            Не уверен — выбрать за меня
          </button>
          {auto && (
            <div className="mt-1 text-xs text-gray-500">
              Мы подберём стиль на основе ваших ответов
            </div>
          )}
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-full w-full max-w-2xl overflow-auto rounded-xl bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex gap-2">
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

