import { useEffect, useState } from "react";
import clsx from "clsx";

interface StyleOption {
  id: string;
  name: string;
  tags: string[];
  image: string;
  examples: string[];
}

const STYLE_OPTIONS: StyleOption[] = [
  {
    id: "minimal",
    name: "Минимализм",
    tags: ["чистые линии", "нейтральная палитра"],
    image: "/styles/minimal.jpg",
    examples: [
      "/styles/examples/minimal-1.jpg",
      "/styles/examples/minimal-2.jpg",
      "/styles/examples/minimal-3.jpg",
    ],
  },
  {
    id: "smart_casual",
    name: "Смарт-кэжуал",
    tags: ["офис-поседневно", "слои"],
    image: "/styles/smart.jpg",
    examples: [
      "/styles/examples/smart-1.jpg",
      "/styles/examples/smart-2.jpg",
      "/styles/examples/smart-3.jpg",
    ],
  },
  {
    id: "sport_casual",
    name: "Спорт-кэжуал",
    tags: ["комфорт", "функционально"],
    image: "/styles/sport.jpg",
    examples: [
      "/styles/examples/sport-1.jpg",
      "/styles/examples/sport-2.jpg",
      "/styles/examples/sport-3.jpg",
    ],
  },
  {
    id: "street_light",
    name: "Стрит-лайт",
    tags: ["свободный крой", "акцент-пара"],
    image: "/styles/street.jpg",
    examples: [
      "/styles/examples/street-1.jpg",
      "/styles/examples/street-2.jpg",
      "/styles/examples/street-3.jpg",
    ],
  },
];

interface StyleStepProps {
  value: string[];
  onChange: (value: string[]) => void;
  goal: string;
}

export function StyleStep({ value, onChange, goal }: StyleStepProps) {
  const max = 2;
  const [auto, setAuto] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [examplesTab, setExamplesTab] = useState(STYLE_OPTIONS[0].id);
  const [showLimit, setShowLimit] = useState(false);

  const track = (e: string, props?: Record<string, unknown>) => {
    if (typeof window !== "undefined") {
      const win = window as {
        plausible?: (e: string, o?: Record<string, unknown>) => void;
      };
      win.plausible?.(e, { props });
    }
  };

  useEffect(() => {
    if (auto) {
      let picks: string[] = [];
      switch (goal) {
        case "office_casual":
          picks = ["smart_casual", "minimal"];
          break;
        case "date":
        case "weekend":
          picks = ["smart_casual", "street_light"];
          break;
        case "season_update":
          picks = ["minimal", "sport_casual"];
          break;
        default:
          picks = ["minimal"];
      }
      onChange(picks.slice(0, max));
    }
  }, [auto, goal, onChange]);

  const toggle = (id: string) => {
    const isSelected = value.includes(id);
    if (isSelected) {
      const next = value.filter((v) => v !== id);
      onChange(next);
      track("style_card_deselect", { style: id, goal });
      setAuto(false);
      return;
    }
    if (value.length >= max) {
      setShowLimit(true);
      setTimeout(() => setShowLimit(false), 2000);
      return;
    }
    const next = [...value, id];
    onChange(next);
    track("style_card_select", { style: id, goal });
    setAuto(false);
  };

  const selectedCount = value.length;
  const limitReached = selectedCount >= max;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowExamples(false);
    };
    if (showExamples) {
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [showExamples]);

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">Стиль (до 2)</h2>
        <span className="text-sm text-gray-500">{selectedCount}/2</span>
      </div>
      <p className="mb-4 text-sm text-gray-600">
        Выберите, как вы хотите выглядеть. Можно пропустить
      </p>
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {STYLE_OPTIONS.map((opt) => {
          const isSelected = value.includes(opt.id);
          const disabled = !isSelected && limitReached;
          return (
            <button
              key={opt.id}
              type="button"
              role="button"
              aria-pressed={isSelected}
              disabled={disabled}
              onClick={() => toggle(opt.id)}
              className={clsx(
                "relative aspect-[4/5] overflow-hidden rounded-lg border p-3 text-left transition", // base
                disabled
                  ? "cursor-not-allowed opacity-40"
                  : "cursor-pointer hover:shadow-md hover:scale-[1.02]",
                isSelected &&
                  "border-brand-500 ring-2 ring-brand-500/50 shadow-md"
              )}
            >
              <img
                src={opt.image}
                alt=""
                className="mb-2 h-24 w-full object-cover"
                loading="lazy"
              />
              <div className="mb-1 font-semibold">{opt.name}</div>
              <div className="flex flex-wrap gap-1">
                {opt.tags.map((t) => (
                  <span
                    key={t}
                    className="badge neutral uppercase text-[12px]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {isSelected && (
                <span className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-white">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
      {limitReached && selectedCount === max && (
        <div className="mb-4 text-sm text-gray-500">Можно менять выбор</div>
      )}
      {showLimit && (
        <div className="mb-2 text-sm text-red-500">Можно выбрать до двух</div>
      )}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => {
            const next = !auto;
            setAuto(next);
            track("style_autopick_toggle", { on: next, goal });
          }}
          className={clsx(
            "pill text-sm",
            auto ? "bg-brand-100" : ""
          )}
        >
          Не уверен — выбрать за меня
        </button>
        <button
          type="button"
          onClick={() => {
            setShowExamples(true);
            track("style_examples_open", { goal });
          }}
          className="text-sm underline"
        >
          Примеры
        </button>
      </div>
      {showExamples && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowExamples(false)}
        >
          <div
            className="max-h-full w-full max-w-xl overflow-auto rounded-lg bg-bg-elev p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex gap-2">
              {STYLE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setExamplesTab(opt.id)}
                  className={clsx(
                    "badge",
                    examplesTab === opt.id ? "brand" : "neutral"
                  )}
                >
                  {opt.name}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {STYLE_OPTIONS.find((s) => s.id === examplesTab)!.examples.map(
                (img) => (
                  <div key={img} className="text-center text-xs">
                    <img
                      src={img}
                      alt=""
                      className="mb-1 h-32 w-full rounded object-cover"
                      loading="lazy"
                    />
                    как комбинировать
                  </div>
                )
              )}
            </div>
            <div className="mt-4 text-right">
              <button
                type="button"
                className="button secondary"
                onClick={() => setShowExamples(false)}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

