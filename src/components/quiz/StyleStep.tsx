import { useEffect, useState } from "react";
import clsx from "clsx";

export interface StyleStepProps {
  selected: string[];
  onChange: (styles: string[]) => void;
  goal: string;
}

interface StyleOption {
  id: string;
  title: string;
  chips: string[];
  image: string;
}

const OPTIONS: StyleOption[] = [
  {
    id: "minimal",
    title: "Минимализм",
    chips: ["чистые линии", "нейтральная палитра"],
    image: "/styles/minimalism.jpg",
  },
  {
    id: "smart_casual",
    title: "Смарт-кэжуал",
    chips: ["офис-повседневно", "слои"],
    image: "/styles/smart-casual.jpg",
  },
  {
    id: "sport_casual",
    title: "Спорт-кэжуал",
    chips: ["комфорт", "функционально"],
    image: "/styles/sport-casual.jpg",
  },
  {
    id: "street_light",
    title: "Стрит-лайт",
    chips: ["свободный крой", "акцент-пара"],
    image: "/styles/street-light.jpg",
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

  useEffect(() => {
    if (auto) {
      const defaults = AUTO_PICK[goal] || [];
      onChange(defaults.slice(0, 2));
    }
  }, [auto, goal, onChange]);

  const toggle = (id: string) => {
    setAuto(false);
    const exists = selected.includes(id);
    if (exists) {
      onChange(selected.filter((s) => s !== id));
      sendEvent("style_card_deselect", { style: id });
    } else {
      if (selected.length >= 2) {
        alert("Можно выбрать до двух");
        return;
      }
      onChange([...selected, id]);
      sendEvent("style_card_select", { style: id });
    }
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
    sendEvent("style_autopick_toggle", { on: next });
  };

  const count = selected.length;

  useEffect(() => {
    OPTIONS.forEach((opt) => sendEvent("style_card_view", { style: opt.id }));
  }, []);

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">Стиль (до 2)</h2>
        <div className="text-sm text-gray-500">{count}/2</div>
      </div>
      <p className="mb-4 text-sm text-gray-500">
        Выберите, как вы хотите выглядеть. Можно пропустить
      </p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {OPTIONS.map((opt) => {
          const isSelected = selected.includes(opt.id);
          const disabled = !isSelected && count >= 2;
          return (
            <button
              key={opt.id}
              type="button"
              role="button"
              aria-pressed={isSelected}
              onClick={() => toggle(opt.id)}
              disabled={disabled}
              className={clsx(
                "relative flex flex-col rounded-xl border p-3 text-left transition",
                "aspect-[4/5] overflow-hidden",
                disabled && "cursor-not-allowed opacity-40",
                isSelected && "border-[2px] border-[var(--brand-500)] shadow",
                !isSelected && "border-black/10 hover:shadow-md"
              )}
            >
              <img
                src={opt.image}
                alt=""
                className="mb-2 h-24 w-full rounded-md object-cover"
                loading="lazy"
              />
              <div className="font-medium">{opt.title}</div>
              <div className="mt-1 flex flex-wrap gap-1 text-xs uppercase text-gray-500">
                {opt.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-gray-100 px-2 py-0.5"
                  >
                    {chip}
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
      <p className="mt-4 text-sm text-gray-500">
        Можно выбрать до двух. Не уверены — мы подскажем.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
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
      {count === 2 && (
        <div className="mt-2 text-xs text-gray-500">Можно менять выбор</div>
      )}
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
                  src={`/styles/examples/${tab}-${i}.jpg`}
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

