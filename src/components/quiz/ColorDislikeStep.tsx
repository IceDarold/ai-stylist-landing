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
  group: "neutral" | "hue" | "intensity";
  border?: string;
  pattern?: "diagonal";
}

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

const GROUPS: { id: ColorOption["group"]; title: string }[] = [
  { id: "neutral", title: "Нейтральные" },
  { id: "hue", title: "Оттенки" },
  { id: "intensity", title: "Интенсивность" },
];

export default function ColorDislikeStep({ selected, onChange }: ColorDislikeStepProps) {
  const [toast, setToast] = useState(false);
  const [shake, setShake] = useState(false);

  const count = selected.length;

  const toggle = (id: string) => {
    const exists = selected.includes(id);
    if (exists) {
      const next = selected.filter((c) => c !== id);
      onChange(next);
      sendEvent("color_dislike_deselect", { id, total: next.length });
      return;
    }
    if (selected.length >= 3) {
      setToast(true);
      setShake(true);
      sendEvent("color_dislike_limit_hit");
      setTimeout(() => setToast(false), 2000);
      setTimeout(() => setShake(false), 300);
      return;
    }
    const next = [...selected, id];
    onChange(next);
    sendEvent("color_dislike_select", { id, total: next.length });
  };

  const clearAll = () => {
    onChange([]);
    sendEvent("color_dislike_clear_all");
  };

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">Не любим цвета (до 3)</h2>
        <div className={clsx("text-sm", count === 3 ? "text-red-600" : "text-gray-500")}>{count}/3</div>
      </div>
      <p className="mb-4 text-sm text-gray-500">Выберите до трёх цветов, которые не любите. Можно пропустить.</p>
      <div
        role="listbox"
        aria-multiselectable="true"
        className={clsx("space-y-4", shake && "animate-shake")}
      >
        {GROUPS.map((g) => {
          const opts = OPTIONS.filter((o) => o.group === g.id);
          if (!opts.length) return null;
          return (
            <div key={g.id}>
              <div className="mb-2 text-sm text-gray-500">{g.title}</div>
              <div
                className={
                  g.id === "neutral"
                    ? "flex flex-wrap gap-3"
                    : g.id === "hue"
                    ? "grid grid-cols-3 gap-3 sm:grid-cols-4"
                    : "flex gap-3"
                }
              >
                {opts.map((opt) => {
                  const isSelected = selected.includes(opt.id);
                  const disabled = !isSelected && count >= 3;
                  const style = opt.gradient
                    ? { backgroundImage: `linear-gradient(90deg, ${opt.gradient[0]}, ${opt.gradient[1]})` }
                    : { backgroundColor: opt.hex };
                  const borderColor = opt.border || "#E8E9ED";
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={disabled}
                      onClick={() => toggle(opt.id)}
                      disabled={disabled}
                      className={clsx(
                        "flex flex-col items-center text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2", 
                        disabled && "cursor-not-allowed opacity-40"
                      )}
                    >
                      <span
                        className={clsx(
                          "mb-1 flex h-9 w-9 items-center justify-center rounded-full border", 
                          isSelected && "ring-2 ring-[var(--brand-500)]"
                        )}
                        style={{ borderColor }}
                      >
                        <span
                          className="absolute inset-0 rounded-full"
                          style={{ ...style }}
                        ></span>
                        {opt.pattern && (
                          <span
                            className="absolute inset-0 rounded-full"
                            style={{
                              backgroundImage:
                                "repeating-linear-gradient(45deg, rgba(255,255,255,.5) 0, rgba(255,255,255,.5) 1px, transparent 1px, transparent 4px)",
                            }}
                          />
                        )}
                        {isSelected && <span className="relative z-10 text-white">✓</span>}
                      </span>
                      <span className="uppercase">
                        {opt.label}
                        {isSelected && <span className="sr-only"> (выбран)</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
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
          onClick={() => sendEvent("color_dislike_autopick")}
          className="rounded-full border px-3 py-1 text-sm text-gray-600"
        >
          Не уверен — выбрать за меня
        </button>
      </div>
      <div className="mt-4 flex h-4 overflow-hidden rounded">
        {OPTIONS.filter((o) => !selected.includes(o.id)).map((o) => {
          const style = o.gradient
            ? { backgroundImage: `linear-gradient(90deg, ${o.gradient[0]}, ${o.gradient[1]})` }
            : { backgroundColor: o.hex };
          return <div key={o.id} className="flex-1" style={style} />;
        })}
      </div>
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded bg-black px-3 py-2 text-sm text-white">
          Не более трёх цветов
        </div>
      )}
      <style jsx>{`
        .animate-shake { animation: shake 0.3s; }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
}

function sendEvent(event: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const win = window as unknown as {
    plausible?: (e: string, o?: Record<string, unknown>) => void;
    ym?: (id: number, type: string, name: string) => void;
  };
  win.plausible?.(event, props);
  const ymId = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID;
  if (ymId) win.ym?.(Number(ymId), "reachGoal", event);
}
