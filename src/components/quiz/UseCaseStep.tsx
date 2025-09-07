import { useState } from 'react';
import clsx from 'clsx';
import { USE_CASES, type SelectedUseCase, type UseCaseId } from './usecases.config';

export interface UseCaseStepProps {
  selected: SelectedUseCase[];
  autoPick: boolean;
  onChange: (selected: SelectedUseCase[], autoPick: boolean) => void;
}

export default function UseCaseStep({ selected, autoPick, onChange }: UseCaseStepProps) {
  const [showMore, setShowMore] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const visible = USE_CASES.filter((u) => showMore || u.popular);

  const toggle = (id: UseCaseId) => {
    if (autoPick) return;
    const exists = selected.find((s) => s.id === id);
    if (exists) {
      const next = selected
        .filter((s) => s.id !== id)
        .map((s, i) => ({ ...s, priority: (i + 1) as 1 | 2 | 3 }));
      onChange(next, false);
      sendEvent('usecase_deselect', { id, total: next.length });
      return;
    }
    if (selected.length >= 3) {
      setToast('Не более трёх сценариев');
      sendEvent('usecase_limit_hit');
      setTimeout(() => setToast(null), 2000);
      return;
    }
    const next = [
      ...selected,
      { id, priority: (selected.length + 1) as 1 | 2 | 3 },
    ];
    onChange(next, false);
    sendEvent('usecase_select', { id, total: next.length });
  };

  const handleAuto = () => {
    const next = !autoPick;
    onChange([], next);
    sendEvent('usecase_autopick_toggle', { value: next });
  };

  const move = (from: number, to: number) => {
    const arr = [...selected];
    const item = arr.splice(from, 1)[0];
    arr.splice(to, 0, item);
    const next = arr.map((s, i) => ({ ...s, priority: (i + 1) as 1 | 2 | 3 }));
    onChange(next, false);
    sendEvent('usecase_reorder', { from: from + 1, to: to + 1 });
  };

  const handleProp = (id: UseCaseId, key: string, value: string) => {
    const next = selected.map((s) =>
      s.id === id ? { ...s, props: { ...(s.props || {}), [key]: value } } : s
    );
    onChange(next, false);
    sendEvent('usecase_subprop_set', { id, key, value });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Под что собираем капсулу?</h2>
      <p className="mb-4 text-sm text-gray-600">Можно выбрать до трёх.</p>

      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        role="listbox"
        aria-multiselectable="true"
      >
        {visible.map((u) => {
          const isSelected = selected.some((s) => s.id === u.id);
          const order = selected.findIndex((s) => s.id === u.id) + 1;
          return (
            <div key={u.id} className="space-y-2">
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => toggle(u.id)}
                disabled={autoPick}
                className={clsx(
                  'relative w-full rounded-2xl border p-4 text-center transition',
                  isSelected ? 'border-[var(--brand-500)] shadow' : 'border-gray-200 hover:border-gray-300',
                  autoPick && 'cursor-not-allowed opacity-50'
                )}
              >
                <div className="mx-auto mb-2 h-12 w-12">
                  <img src={u.icon} alt="" className="h-full w-full object-contain" />
                </div>
                <div>{u.title}</div>
                {isSelected && (
                  <span className="absolute right-2 top-2 rounded-full bg-[var(--brand-500)] px-2 py-1 text-xs text-white">
                    {order}
                  </span>
                )}
              </button>
              {isSelected && u.subprops && (
                <div className="flex flex-wrap gap-2">
                  {u.subprops.map((sp) => (
                    <select
                      key={sp.key}
                      className="rounded border p-1 text-sm"
                      value={selected.find((s) => s.id === u.id)?.props?.[sp.key] || ''}
                      onChange={(e) => handleProp(u.id, sp.key, e.target.value)}
                    >
                      <option value="">—</option>
                      {sp.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {toast && <div className="mt-4 text-sm text-red-600">{toast}</div>}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleAuto}
          className={clsx(
            'rounded-full border px-4 py-1 text-sm',
            autoPick ? 'border-[var(--brand-500)] bg-[var(--brand-50)] text-[var(--brand-700)]' : 'border-gray-300 text-gray-600'
          )}
        >
          Не знаю — выбрать за меня
        </button>
        {!showMore && (
          <button
            type="button"
            className="text-sm text-[var(--brand-600)] underline"
            onClick={() => setShowMore(true)}
          >
            Показать больше сценариев
          </button>
        )}
      </div>
    </div>
  );
}

function sendEvent(event: string, props?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    const win = window as { plausible?: (e: string, o?: Record<string, unknown>) => void };
    win.plausible?.(event, props);
  }
}
