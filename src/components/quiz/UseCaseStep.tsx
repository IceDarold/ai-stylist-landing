import { useEffect, useState } from "react";
import clsx from "clsx";
import type { SelectedUseCase, UseCase } from "@/types/usecases";
import { USE_CASES } from "./usecases.config";

interface UseCaseStepProps {
  selected: SelectedUseCase[];
  autoPick: boolean;
  onChange: (usecases: SelectedUseCase[]) => void;
  onAutoPickChange: (v: boolean) => void;
}

const SUBPROP_LABELS: Record<string, string> = {
  dress_code: "Дресс-код",
  climate: "Климат",
  trip_duration: "Длительность",
  season: "Сезон",
  event_type: "Тип события",
  formality: "Формальность",
  place: "Место",
};

const OPTION_LABELS: Record<string, Record<string, string>> = {
  dress_code: {
    business_formal: "Строгий",
    smart_casual: "Smart casual",
    free: "Свободный",
  },
  climate: { hot: "Жарко", mild: "Умеренно", cold: "Холодно" },
  trip_duration: { "2-3d": "2-3 дня", "1w": "1 неделя", "2w+": "2+ недели" },
  season: { ss: "SS", aw: "AW", spring: "Весна", summer: "Лето", autumn: "Осень", winter: "Зима" },
  event_type: {
    wedding: "Свадьба",
    grad: "Выпускной",
    cocktail: "Коктейль",
    corporate: "Корпоратив",
    other: "Другое",
  },
  formality: { relaxed: "Спокойно", smart_casual: "Smart casual" },
  place: { restaurant: "Ресторан", walk: "Прогулка", cinema: "Кино" },
};

export default function UseCaseStep({ selected, autoPick, onChange, onAutoPickChange }: UseCaseStepProps) {
  const [showMore, setShowMore] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const limitHit = toast !== null;

  useEffect(() => {
    USE_CASES.forEach((c) => sendEvent("usecase_card_view", { id: c.id }));
  }, []);

  const visibleCases = showMore ? USE_CASES : USE_CASES.filter((c) => c.popular);

  const toggle = (id: UseCase["id"]) => {
    if (autoPick) {
      const agree = confirm("Отключить автоматический выбор и выбрать вручную?");
      if (!agree) return;
      onAutoPickChange(false);
      onChange([]);
    }
    const exists = selected.find((u) => u.id === id);
    if (exists) {
      const next = selected
        .filter((u) => u.id !== id)
        .map((u, i) => ({ ...u, priority: (i + 1) as 1 | 2 | 3 }));
      onChange(next);
      sendEvent("usecase_deselect", { id, total: next.length });
      return;
    }
    if (selected.length >= 3) {
      setToast("Не более трёх сценариев");
      setTimeout(() => setToast(null), 2000);
      sendEvent("usecase_limit_hit");
      return;
    }
    const next = [...selected, { id, priority: (selected.length + 1) as 1 | 2 | 3 }];
    onChange(next);
    sendEvent("usecase_select", { id, total: next.length });
  };

  const reorder = (from: number, to: number) => {
    if (to < 0 || to >= selected.length) return;
    const arr = [...selected];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    const next = arr.map((u, i) => ({ ...u, priority: (i + 1) as 1 | 2 | 3 }));
    onChange(next);
    sendEvent("usecase_reorder", { from: from + 1, to: to + 1 });
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === idx) return;
    reorder(dragIndex, idx);
    setDragIndex(idx);
  };

  const handleDragStart = (idx: number) => setDragIndex(idx);
  const handleDragEnd = () => setDragIndex(null);

  const handleAuto = () => {
    const next = !autoPick;
    onAutoPickChange(next);
    if (next) onChange([]);
    sendEvent("usecase_autopick_toggle", { value: next });
  };

  const updateProp = (id: UseCase["id"], key: string, value: string) => {
    const next = selected.map((u) =>
      u.id === id ? { ...u, props: { ...u.props, [key]: value } } : u
    );
    onChange(next);
    sendEvent("usecase_subprop_set", { id, key, value });
  };

  return (
    <div>
      <h2 className="mb-1 text-xl font-semibold">Под что собираем капсулу?</h2>
      <p className="mb-4 text-sm text-gray-500">
        Можно выбрать до трёх. Перетащите выбранные, чтобы задать приоритет
      </p>
      {selected.length > 0 && (
        <div className="mb-4 flex gap-2 overflow-x-auto">
          {selected.map((u, idx) => {
            const conf = USE_CASES.find((c) => c.id === u.id)!;
            return (
              <div
                key={u.id}
                className="flex items-center gap-1 rounded-full border px-3 py-1 text-sm"
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
              >
                <span className="font-medium">{idx + 1}.</span>
                <span>{conf.title}</span>
                <div className="ml-1 flex flex-col">
                  <button
                    aria-label="Вверх"
                    onClick={() => reorder(idx, idx - 1)}
                    disabled={idx === 0}
                    className="leading-none"
                  >
                    ▲
                  </button>
                  <button
                    aria-label="Вниз"
                    onClick={() => reorder(idx, idx + 1)}
                    disabled={idx === selected.length - 1}
                    className="leading-none"
                  >
                    ▼
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {toast && (
        <div className="mb-2 rounded bg-red-50 px-3 py-2 text-sm text-red-600">
          {toast}
        </div>
      )}
      <div
        role="listbox"
        aria-multiselectable="true"
        className={clsx(
          "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
          limitHit && "animate-shake"
        )}
      >
        {visibleCases.map((uc) => {
          const isSelected = selected.some((u) => u.id === uc.id);
          const disabled = autoPick || (!isSelected && selected.length >= 3);
          const index = selected.findIndex((u) => u.id === uc.id);
          return (
            <button
              key={uc.id}
              type="button"
              role="option"
              aria-selected={isSelected}
              aria-disabled={disabled}
              disabled={disabled}
              onClick={() => toggle(uc.id)}
              className={clsx(
                "relative flex flex-col items-center rounded-2xl border border-[#E8E9ED] bg-[#F7F7F8] p-4 text-center shadow transition",
                !disabled &&
                  "hover:-translate-y-0.5 hover:border-[var(--brand-500)] focus-visible:border-[var(--brand-500)]",
                disabled && "cursor-not-allowed opacity-40",
                isSelected && "border-2 border-[var(--brand-500)]"
              )}
            >
              <img src={uc.icon} alt="" className="mb-2 h-12 w-12" />
              <span>{uc.title}</span>
              {isSelected && (
                <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand-500)] text-white">
                  {index + 1}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleAuto}
          className="rounded-full border px-3 py-1 text-sm"
        >
          {autoPick ? "Выбрать вручную" : "Не знаю — выбрать за меня"}
        </button>
        {USE_CASES.some((c) => !c.popular) && (
          <button
            type="button"
            onClick={() => setShowMore((s) => !s)}
            className="rounded-full border px-3 py-1 text-sm"
          >
            {showMore ? "Скрыть сценарии" : "Показать больше сценариев"}
          </button>
        )}
      </div>
      {selected.map((u) => {
        const conf = USE_CASES.find((c) => c.id === u.id);
        if (!conf?.subprops) return null;
        return (
          <div key={u.id} className="mt-4 space-y-2">
            {conf.subprops.map((sp) => (
              <div key={sp.key} className="flex items-center gap-2">
                <label className="w-40 text-sm" htmlFor={`${u.id}-${sp.key}`}>
                  {SUBPROP_LABELS[sp.key]}
                </label>
                <select
                  id={`${u.id}-${sp.key}`}
                  className="input flex-1"
                  value={u.props?.[sp.key] ?? ""}
                  onChange={(e) => updateProp(u.id, sp.key, e.target.value)}
                >
                  <option value="">—</option>
                  {sp.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {OPTION_LABELS[sp.key][opt]}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        );
      })}
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
