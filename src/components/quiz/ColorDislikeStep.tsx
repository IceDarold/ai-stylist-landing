import { useState } from "react";
import clsx from "clsx";

interface ColorDislikeStepProps {
  selected: string[];
  onChange: (colors: string[]) => void;
}

type ColorOption = {
  id: string;
  label: string;
  hex?: string;
  gradient?: [string, string];
  group: "neutral" | "hue" | "intensity";
  border?: string;
  pattern?: "diagonal";
};

const OPTIONS: ColorOption[] = [
  { id: "black", label: "черный", hex: "#191C1A", group: "neutral" },
  { id: "white", label: "белый", hex: "#FFFFFF", border: "#E8E9ED", group: "neutral" },
  { id: "grey", label: "серый", hex: "#B8BFC7", group: "neutral" },
  { id: "beige", label: "бежевый", hex: "#CDAF93", group: "neutral" },
  { id: "brown", label: "коричневый", hex: "#7A5236", group: "neutral" },
  { id: "blue", label: "синий", hex: "#3C6EE0", group: "hue" },
  { id: "green", label: "зеленый", hex: "#2E9A5F", group: "hue", pattern: "diagonal" },
  { id: "bright", label: "яркие", gradient: ["#FF3E6C", "#33F0FF"], group: "intensity" },
];

const GROUPS = [
  { id: "neutral", title: "Нейтральные" },
  { id: "hue", title: "Оттенки" },
  { id: "intensity", title: "Интенсивность" },
] as const;

export default function ColorDislikeStep({ selected, onChange }: ColorDislikeStepProps) {
  const max = 3;
  const count = selected.length;
  const [toast, setToast] = useState(false);
  const [shake, setShake] = useState(false);

  const toggle = (id: string) => {
    const exists = selected.includes(id);
    if (exists) {
      const arr = selected.filter((c) => c !== id);
      onChange(arr);
      sendEvent("color_dislike_deselect", { id, total: arr.length });
    } else {
      if (count >= max) {
        setToast(true);
        setShake(true);
        setTimeout(() => setShake(false), 300);
        setTimeout(() => setToast(false), 2000);
        sendEvent("color_dislike_limit_hit");
        return;
      }
      const arr = [...selected, id];
      onChange(arr);
      sendEvent("color_dislike_select", { id, total: arr.length });
    }
  };

  const clearAll = () => {
    onChange([]);
    sendEvent("color_dislike_clear_all");
  };

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">Не любим цвета (до 3)</h2>
        <div className={clsx("text-sm", toast ? "text-red-600" : "text-gray-500")}>{count}/{max}</div>
      </div>
      <p className="mb-4 text-sm text-gray-500">
        Выберите до трёх цветов, которые не любите. Можно пропустить.
      </p>
      <div
        role="listbox"
        aria-multiselectable="true"
        className={clsx("space-y-4", shake && "animate-shake")}
      >
        {GROUPS.map((group) => (
          <div key={group.id}>
            <div className="mb-2 text-xs uppercase text-gray-500">{group.title}</div>
            <div
              className={clsx(
                group.id === "hue" ? "grid grid-cols-3 sm:grid-cols-4 gap-3" : "flex flex-wrap gap-3"
              )}
            >
              {OPTIONS.filter((o) => o.group === group.id).map((opt) => {
                const isSelected = selected.includes(opt.id);
                const disabled = !isSelected && count >= max;
                const style: React.CSSProperties = opt.gradient
                  ? { background: `linear-gradient(90deg, ${opt.gradient[0]}, ${opt.gradient[1]})` }
                  : { backgroundColor: opt.hex };
                if (opt.pattern === "diagonal") {
                  style.backgroundImage =
                    "repeating-linear-gradient(45deg, rgba(0,0,0,0.2) 0 2px, transparent 2px 4px)";
                }
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={disabled || undefined}
                    disabled={disabled}
                    onClick={() => toggle(opt.id)}
                    className={clsx(
                      "flex w-20 flex-col items-center text-xs uppercase focus:outline-none transition",
                      disabled && "cursor-not-allowed opacity-40"
                    )}
                  >
                    <span
                      className={clsx(
                        "mb-1 flex h-9 w-9 items-center justify-center rounded-full border",
                        isSelected && "ring-2 ring-[var(--brand-500)]",
                        opt.id === "white" ? "border-[#E8E9ED]" : "border-black/10"
                      )}
                      style={style}
                    >
                      {isSelected && (
                        <span className={clsx(opt.id === "white" ? "text-black" : "text-white")}>✓</span>
                      )}
                    </span>
                    {opt.label}
                    {isSelected && <span className="sr-only">(выбран)</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={clearAll}
          className="rounded-full border px-3 py-1 text-sm"
        >
          Мне всё ок
        </button>
        <button
          type="button"
          onClick={() => {
            clearAll();
            sendEvent("color_dislike_autopick");
          }}
          className="rounded-full border px-3 py-1 text-sm"
        >
          Не уверен — выбрать за меня
        </button>
      </div>
      {toast && <div className="mt-2 text-sm text-red-600">Не более трёх цветов</div>}
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

