import { useState } from "react";
import clsx from "clsx";

export interface ColorDislikeStepProps {
  selected: string[];
  onChange: (colors: string[]) => void;
}

interface ColorOption {
  id: string;
  label: string;
  hex?: string;
  gradient?: [string, string];
  border?: string;
  group: "neutral" | "hue" | "intensity";
  pattern?: "diagonal";
}

const COLORS: ColorOption[] = [
  { id: "black", label: "черный", hex: "#191C1A", group: "neutral" },
  { id: "white", label: "белый", hex: "#FFFFFF", border: "#E8E9ED", group: "neutral" },
  { id: "grey", label: "серый", hex: "#B8BFC7", group: "neutral" },
  { id: "beige", label: "бежевый", hex: "#CDAF93", group: "neutral" },
  { id: "brown", label: "коричневый", hex: "#7A5236", group: "neutral" },
  { id: "blue", label: "синий", hex: "#3C6EE0", group: "hue" },
  { id: "green", label: "зеленый", hex: "#2E9A5F", group: "hue", pattern: "diagonal" },
  { id: "bright", label: "яркие", gradient: ["#FF3E6C", "#33F0FF"], group: "intensity" },
];

const GROUPS: { id: ColorOption["group"]; title: string }[] = [
  { id: "neutral", title: "Нейтральные" },
  { id: "hue", title: "Оттенки" },
  { id: "intensity", title: "Интенсивность" },
];

export default function ColorDislikeStep({ selected, onChange }: ColorDislikeStepProps) {
  const [toast, setToast] = useState(false);
  const [auto, setAuto] = useState(false);
  const [shake, setShake] = useState(false);

  const count = selected.length;

  const toggle = (id: string) => {
    if (auto) setAuto(false);
    const exists = selected.includes(id);
    if (exists) {
      onChange(selected.filter((c) => c !== id));
      sendEvent("color_dislike_deselect", { id, total: selected.length - 1 });
      return;
    }
    if (selected.length >= 3) {
      setToast(true);
      setShake(true);
      setTimeout(() => setToast(false), 2000);
      setTimeout(() => setShake(false), 300);
      sendEvent("color_dislike_limit_hit", { id });
      return;
    }
    onChange([...selected, id]);
    sendEvent("color_dislike_select", { id, total: selected.length + 1 });
  };

  const clearAll = () => {
    onChange([]);
    setAuto(false);
    sendEvent("color_dislike_clear_all");
  };

  const handleAuto = () => {
    const next = !auto;
    setAuto(next);
    if (next) onChange([]);
    sendEvent("color_dislike_autopick_toggle", { on: next });
  };

  const renderSwatch = (opt: ColorOption) => {
    const isSelected = selected.includes(opt.id);
    const disabled = !isSelected && count >= 3;
    const bg = opt.gradient
      ? `linear-gradient(135deg, ${opt.gradient[0]}, ${opt.gradient[1]})`
      : opt.hex;
    const checkColor = opt.id === "white" ? "#000" : "#fff";
    return (
      <button
        key={opt.id}
        type="button"
        role="option"
        aria-selected={isSelected}
        aria-disabled={disabled}
        disabled={disabled || auto}
        onClick={() => toggle(opt.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle(opt.id);
          }
        }}
        className={clsx(
          "flex w-16 flex-col items-center focus:outline-none", // width ensures label width
          disabled && "cursor-not-allowed opacity-40"
        )}
      >
        <span
          className={clsx(
            "relative mb-1 flex h-9 w-9 items-center justify-center rounded-full border",
            isSelected && "ring-2 ring-[var(--brand-500)]"
          )}
          style={{
            background: bg,
            borderColor: opt.border || "#E8E9ED",
          }}
        >
          {opt.pattern === "diagonal" && (
            <span
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0 2px, transparent 2px 4px)",
              }}
            />
          )}
          {isSelected && <span style={{ color: checkColor }}>✓</span>}
        </span>
        <span className="text-xs text-gray-700">{opt.label}</span>
        {isSelected && <span className="sr-only">(выбран)</span>}
      </button>
    );
  };

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">Не любим цвета (до 3)</h2>
        <div className="text-sm text-gray-500">{count}/3</div>
      </div>
      <p className="mb-4 text-sm text-gray-500">
        Выберите до трёх цветов, которые не любите. Можно пропустить.
      </p>
      <div
        className={clsx("space-y-4", shake && "animate-shake")}
        role="listbox"
        aria-multiselectable="true"
      >
        {GROUPS.map((g) => (
          <div key={g.id}>
            <h3 className="mb-2 text-xs text-gray-500">{g.title}</h3>
            <div
              className={clsx(
                g.id === "hue"
                  ? "grid grid-cols-3 gap-3 sm:grid-cols-4"
                  : "flex gap-3"
              )}
            >
              {COLORS.filter((c) => c.group === g.id).map(renderSwatch)}
            </div>
          </div>
        ))}
      </div>
      {toast && (
        <div
          role="alert"
          className="mt-4 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700"
        >
          Не более трёх цветов
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={clearAll}
          className="rounded-full border px-3 py-1 text-sm text-gray-600"
        >
          Мне всё ок
        </button>
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
      </div>
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.3s;
        }
      `}</style>
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

