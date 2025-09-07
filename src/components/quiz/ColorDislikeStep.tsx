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
  gradient?: string[];
  group: "neutral" | "hue" | "intensity";
  border?: string;
  pattern?: "diagonal";
}

const OPTIONS: ColorOption[] = [
  { id: "black", label: "черный", hex: "#191C1A", group: "neutral" },
  { id: "white", label: "белый", hex: "#FFFFFF", group: "neutral", border: "#E8E9ED" },
  { id: "grey", label: "серый", hex: "#B8BFC7", group: "neutral" },
  { id: "beige", label: "бежевый", hex: "#CDAF93", group: "neutral" },
  { id: "brown", label: "коричневый", hex: "#7A5236", group: "neutral" },
  { id: "blue", label: "синий", hex: "#3C6EE0", group: "hue" },
  { id: "green", label: "зеленый", hex: "#2E9A5F", group: "hue", pattern: "diagonal" },
  { id: "red", label: "красный", hex: "#E53935", group: "hue" },
  { id: "orange", label: "оранжевый", hex: "#FB8C00", group: "hue" },
  { id: "yellow", label: "желтый", hex: "#FDD835", group: "hue" },
  { id: "purple", label: "фиолетовый", hex: "#8E24AA", group: "hue" },
  { id: "pink", label: "розовый", hex: "#EC407A", group: "hue" },
  {
    id: "bright",
    label: "яркие",
    gradient: ["#FF3E6C", "#33F0FF"],
    group: "intensity",
  },
];

const GROUPS: { id: ColorOption["group"]; title: string }[] = [
  { id: "neutral", title: "Нейтральные" },
  { id: "hue", title: "Оттенки" },
  { id: "intensity", title: "Интенсивность" },
];

export default function ColorDislikeStep({ selected, onChange }: ColorDislikeStepProps) {
  const [limitHit, setLimitHit] = useState(false);
  const [auto, setAuto] = useState(false);
  const count = selected.length;

  const toggle = (id: string) => {
    const exists = selected.includes(id);
    if (exists) {
      const next = selected.filter((c) => c !== id);
      onChange(next);
      sendEvent("color_favorite_deselect", { id, total: next.length });
      return;
    }
    if (count >= 3) {
      setLimitHit(true);
      setTimeout(() => setLimitHit(false), 2000);
      sendEvent("color_favorite_limit_hit");
      return;
    }
    const next = [...selected, id];
    onChange(next);
    sendEvent("color_favorite_select", { id, total: next.length });
  };

  const clear = () => {
    onChange([]);
    sendEvent("color_favorite_clear_all");
  };

  const handleAuto = () => {
    const next = !auto;
    setAuto(next);
    if (next) {
      // базовая палитра по умолчанию: 2 нейтральных + 1 акцент
      onChange(["grey", "beige", "blue"]);
    } else {
      onChange([]);
    }
  };

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">Любимые цвета (до 3)</h2>
        <div className="text-sm text-gray-500">{count}/3</div>
      </div>
      <p className="mb-4 text-sm text-gray-500">
        Выберите до трёх любимых цветов. Мы используем их как основу палитры подбора.
      </p>
      {GROUPS.map((g) => {
        const groupOptions = OPTIONS.filter((o) => o.group === g.id);
        return (
          <div key={g.id} className="mb-4">
            <div className="mb-2 text-xs uppercase text-gray-500">{g.title}</div>
            <div
              role="listbox"
              aria-multiselectable="true"
              className={clsx("flex flex-wrap gap-3", limitHit && "animate-shake")}
            >
              {groupOptions.map((opt) => {
                const isSelected = selected.includes(opt.id);
                const disabled = !isSelected && count >= 3;
                const style: React.CSSProperties = {};
                if (opt.gradient) {
                  style.backgroundImage = `linear-gradient(135deg, ${opt.gradient[0]}, ${opt.gradient[1]})`;
                } else if (opt.hex) {
                  style.backgroundColor = opt.hex;
                }
                if (opt.pattern) {
                  const pattern =
                    "repeating-linear-gradient(45deg, rgba(0,0,0,0.2) 0 2px, rgba(0,0,0,0) 2px 4px)";
                  style.backgroundImage = style.backgroundImage
                    ? `${pattern}, ${style.backgroundImage}`
                    : `${pattern}`;
                }
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={disabled}
                    disabled={disabled}
                    onClick={() => toggle(opt.id)}
                    className={clsx(
                      "flex w-16 flex-col items-center text-xs", // width to align labels
                      disabled && "cursor-not-allowed opacity-40"
                    )}
                  >
                    <span
                      className={clsx(
                        "mb-1 flex h-9 w-9 items-center justify-center rounded-full border", // swatch size 36px approx
                        opt.border ? undefined : "border-gray-200",
                        opt.border && `border-[${opt.border}]`,
                        isSelected && "ring-2 ring-[var(--brand-500)] text-white"
                      )}
                      style={style}
                    >
                      {isSelected && "✓"}
                    </span>
                    <span className="uppercase">{opt.label}</span>
                    {isSelected && <span className="sr-only">(выбран)</span>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      {limitHit && (
        <div className="mt-2 text-sm text-red-500">Не более трёх цветов</div>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={clear}
          className="rounded-full border px-3 py-1 text-sm text-gray-600"
        >
          Пропустить
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
      <PalettePreview selected={selected} />
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

function PalettePreview({ selected }: { selected: string[] }) {
  const chosen = OPTIONS.filter((c) => selected.includes(c.id) && (c.hex || c.gradient));
  if (chosen.length === 0) return null;
  return (
    <div className="mt-6">
      <div className="mb-1 text-xs text-gray-500">Ваша палитра:</div>
      <div className="flex overflow-hidden rounded">
        {chosen.map((c) => (
          <span
            key={c.id}
            className="h-2 flex-1"
            style={c.gradient ? { backgroundImage: `linear-gradient(135deg, ${c.gradient[0]}, ${c.gradient[1]})` } : { backgroundColor: c.hex }}
          />
        ))}
      </div>
    </div>
  );
}

