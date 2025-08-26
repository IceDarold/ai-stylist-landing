import { useEffect, useState } from "react";
import clsx from "clsx";
import { USECASES, type SelectedUseCase, SUBPROP_LABELS } from "@/lib/usecases";

interface UseCaseStepProps {
  selected: SelectedUseCase[];
  onChange: (value: SelectedUseCase[]) => void;
  auto: boolean;
  onAutoChange: (v: boolean) => void;
}

export default function UseCaseStep({ selected, onChange, auto, onAutoChange }: UseCaseStepProps) {
  const [showMore, setShowMore] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [limitHit, setLimitHit] = useState(false);

  useEffect(() => {
    USECASES.forEach((u) => sendEvent("usecase_card_view", { id: u.id }));
  }, []);

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

  const toggle = (id: SelectedUseCase["id"]) => {
    if (auto) return;
    const exists = selected.find((u) => u.id === id);
    if (exists) {
      const next = selected.filter((u) => u.id !== id).map((u, i) => ({ ...u, priority: (i + 1) as 1 | 2 | 3 }));
      onChange(next);
      sendEvent("usecase_deselect", { id, total: next.length });
      return;
    }
    if (selected.length >= 3) {
      setToast("Не более трёх сценариев");
      setLimitHit(true);
      sendEvent("usecase_limit_hit");
      return;
    }
    const next = [...selected, { id, priority: (selected.length + 1) as 1 | 2 | 3 }];
    onChange(next);
    sendEvent("usecase_select", { id, total: next.length });
  };

  const handleReorder = (from: number, to: number) => {
    if (to < 0 || to >= selected.length) return;
    const next = [...selected];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next.map((u, i) => ({ ...u, priority: (i + 1) as 1 | 2 | 3 })));
    sendEvent("usecase_reorder", { from: from + 1, to: to + 1 });
  };

  const handlePropChange = (id: SelectedUseCase["id"], key: string, value: string) => {
    const next = selected.map((u) =>
      u.id === id ? { ...u, props: { ...u.props, [key]: value } } : u
    );
    onChange(next);
    sendEvent("usecase_subprop_set", { id, key, value });
  };

  const handleAuto = () => {
    const next = !auto;
    onAutoChange(next);
    if (next) onChange([]);
    sendEvent("usecase_autopick_toggle", { value: next });
  };

  const top = USECASES.filter((u) => u.popular);
  const extra = USECASES.filter((u) => !u.popular);
  const options = showMore ? [...top, ...extra] : top;
  const count = selected.length;
  const counterClass = clsx("text-sm", limitHit ? "text-red-500 animate-shake" : "text-gray-500");

  return (
    <div>
      <div className="mb-4">
        <div className="text-xs text-gray-500">Шаг 1/14</div>
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold">Под что собираем капсулу?</h2>
          <span className={counterClass}>{limitHit ? "4/3" : `${count}/3`}</span>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Можно выбрать до трёх. Перетащите выбранные, чтобы задать приоритет
        </p>
        {toast && <div className="mt-2 rounded bg-red-50 px-3 py-2 text-sm text-red-600">{toast}</div>}
      </div>

      {count > 0 && (
        <ul className="mb-4 flex gap-2" aria-label="Выбранные сценарии">
          {selected.map((s, idx) => {
            const uc = USECASES.find((u) => u.id === s.id);
            if (!uc) return null;
            return (
              <li key={s.id} className="flex items-center gap-1 rounded-full bg-[var(--brand-50)] px-2 py-1 text-sm">
                <span>
                  {idx + 1}. {uc.title}
                </span>
                <div className="flex flex-col">
                  <button
                    aria-label="Вверх"
                    disabled={idx === 0}
                    onClick={() => handleReorder(idx, idx - 1)}
                  >
                    ▲
                  </button>
                  <button
                    aria-label="Вниз"
                    disabled={idx === selected.length - 1}
                    onClick={() => handleReorder(idx, idx + 1)}
                  >
                    ▼
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div
        role="listbox"
        aria-multiselectable="true"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
      >
        {options.map((opt) => {
          const isSelected = selected.some((s) => s.id === opt.id);
          const blocked = count >= 3 && !isSelected;
          return (
            <button
              key={opt.id}
              type="button"
              role="option"
              aria-selected={isSelected}
              aria-disabled={auto || blocked}
              onClick={() => toggle(opt.id)}
              className={clsx(
                "relative flex flex-col items-center rounded-2xl border p-4 text-center shadow-[0_6px_20px_rgba(0,0,0,0.06)] transition",
                !auto && !blocked &&
                  "hover:-translate-y-0.5 hover:border-[var(--brand-500)] focus-visible:border-[var(--brand-500)]",
                (auto || blocked) && "cursor-not-allowed opacity-40",
                isSelected && "border-2 border-[var(--brand-500)]",
                "focus:outline-none"
              )}
            >
              <img src={opt.icon} alt="" className="mb-2 h-12 w-12" />
              <div>{opt.title}</div>
              {isSelected && (
                <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand-500)] text-white">
                  {selected.findIndex((s) => s.id === opt.id) + 1}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selected.map((s) => {
        const uc = USECASES.find((u) => u.id === s.id);
        if (!uc?.subprops) return null;
        return (
          <div key={s.id} className="mt-4">
            <h3 className="mb-2 text-sm font-medium">{uc.title}</h3>
            <div className="flex flex-wrap gap-2">
              {uc.subprops.map((sp) => (
                <label key={sp.key} className="flex flex-col text-sm">
                  <span className="mb-1">{sp.key}</span>
                  <select
                    className="input h-9"
                    value={s.props?.[sp.key] ?? ""}
                    onChange={(e) => handlePropChange(s.id, sp.key, e.target.value)}
                  >
                    <option value="">—</option>
                    {sp.options.map((o) => (
                      <option key={o} value={o}>
                        {SUBPROP_LABELS[sp.key]?.[o] || o}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </div>
        );
      })}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleAuto}
          className="rounded-full border px-3 py-1 text-sm"
        >
          {auto ? "Сбросить автоподбор" : "Не знаю — выбрать за меня"}
        </button>
        {!showMore && (
          <button
            type="button"
            onClick={() => setShowMore(true)}
            className="rounded-full border px-3 py-1 text-sm"
          >
            Показать больше сценариев
          </button>
        )}
      </div>
    </div>
  );
}

function sendEvent(event: string, props?: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    const win = window as { plausible?: (e: string, o?: Record<string, unknown>) => void };
    win.plausible?.(event, props);
  }
}

