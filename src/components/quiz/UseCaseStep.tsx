import { useEffect, useState } from 'react';
import clsx from 'clsx';
import type { SelectedUseCase, UseCaseId } from '@/types/usecase';
import { USE_CASES, POPULAR_USE_CASES } from './usecases.config';

interface UseCaseStepProps {
  selected: SelectedUseCase[];
  autoPick: boolean;
  onChange: (selected: SelectedUseCase[]) => void;
  onAutoPickChange: (v: boolean) => void;
}

export default function UseCaseStep({
  selected,
  autoPick,
  onChange,
  onAutoPickChange,
}: UseCaseStepProps) {
  const [showMore, setShowMore] = useState(false);
  const [limitHit, setLimitHit] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    USE_CASES.forEach((opt) => sendEvent('usecase_card_view', { id: opt.id }));
  }, []);

  const toggle = (id: UseCaseId) => {
    if (autoPick) return;
    const exists = selected.find((u) => u.id === id);
    if (exists) {
      const next = selected.filter((u) => u.id !== id).map((u, i) => ({ ...u, priority: (i + 1) as 1 | 2 | 3 }));
      onChange(next);
      sendEvent('usecase_deselect', { id, total: next.length });
      return;
    }
    if (selected.length >= 3) {
      setToast('Не более трёх сценариев');
      setLimitHit(true);
      setTimeout(() => setLimitHit(false), 600);
      setTimeout(() => setToast(null), 2000);
      sendEvent('usecase_limit_hit');
      return;
    }
    const next = [...selected, { id, priority: (selected.length + 1) as 1 | 2 | 3 }];
    onChange(next);
    sendEvent('usecase_select', { id, total: next.length });
  };

  const handleAuto = () => {
    const next = !autoPick;
    onAutoPickChange(next);
    if (next) onChange([]);
    sendEvent('usecase_autopick_toggle', { value: next });
  };

  const setProp = (id: UseCaseId, key: string, value: string) => {
    const next = selected.map((u) =>
      u.id === id ? { ...u, props: { ...u.props, [key]: value } } : u
    );
    onChange(next);
    sendEvent('usecase_subprop_set', { id, key, value });
  };

  const move = (from: number, to: number) => {
    if (from === to) return;
    const next = [...selected];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    const reordered = next.map((u, i) => ({ ...u, priority: (i + 1) as 1 | 2 | 3 }));
    onChange(reordered);
    sendEvent('usecase_reorder', { from: from + 1, to: to + 1 });
  };

  const handleDrag = {
    onDragStart: (index: number) => (e: React.DragEvent) => {
      e.dataTransfer.setData('text/plain', String(index));
    },
    onDragOver: (index: number) => (e: React.DragEvent) => {
      e.preventDefault();
      const from = Number(e.dataTransfer.getData('text/plain'));
      if (from !== index) move(from, index);
    },
  };

  const renderSubprops = (id: UseCaseId) => {
    const uc = USE_CASES.find((u) => u.id === id);
    if (!uc?.subprops) return null;
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {uc.subprops.map((sp) => (
          <select
            key={sp.key}
            value={selected.find((u) => u.id === id)?.props?.[sp.key] || ''}
            onChange={(e) => setProp(id, sp.key, e.target.value)}
            className="rounded border px-2 py-1 text-sm"
          >
            <option value="" disabled>
              {sp.key}
            </option>
            {sp.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ))}
      </div>
    );
  };

  const allOptions = showMore ? USE_CASES : POPULAR_USE_CASES;

  return (
    <div>
      <div className="mb-4">
        <h2 className="mb-1 text-xl font-semibold">Под что собираем капсулу?</h2>
        <p className="text-sm text-gray-600">
          Можно выбрать до трёх. Перетащите, чтобы расставить по приоритету
        </p>
        {toast && (
          <div className="mt-2 rounded bg-red-50 px-3 py-2 text-sm text-red-600">
            {toast}
          </div>
        )}
        {selected.length > 0 && (
          <div className="mt-3 flex gap-2">
            {selected.map((uc, idx) => (
              <div
                key={uc.id}
                draggable
                onDragStart={handleDrag.onDragStart(idx)}
                onDragOver={handleDrag.onDragOver(idx)}
                className="flex items-center gap-1 rounded border bg-white px-2 py-1 text-sm shadow"
              >
                <span className="font-semibold">{idx + 1}</span>
                <span>{USE_CASES.find((u) => u.id === uc.id)?.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        role="listbox"
        aria-multiselectable="true"
        className={clsx(
          'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4',
          limitHit && 'animate-shake'
        )}
      >
        {allOptions.map((opt) => {
          const isSelected = selected.some((u) => u.id === opt.id);
          const blocked = selected.length >= 3 && !isSelected;
          const disabled = autoPick || blocked;
          return (
            <button
              key={opt.id}
              type="button"
              role="option"
              aria-selected={isSelected}
              aria-disabled={disabled}
              onClick={() => toggle(opt.id)}
              className={clsx(
                'relative flex flex-col items-center rounded-2xl border border-[#E8E9ED] bg-[#F7F7F8] p-4 shadow-sm transition',
                disabled && 'opacity-50',
                isSelected && 'ring-2 ring-[var(--brand-500)]'
              )}
            >
              <img src={opt.icon} alt="" className="mb-2 h-12 w-12" />
              <span className="text-sm">{opt.title}</span>
              {isSelected && (
                <span className="absolute right-2 top-2 rounded bg-[var(--brand-500)] px-1 text-xs text-white">
                  {selected.find((u) => u.id === opt.id)?.priority}
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
          className={clsx(
            'rounded-full border px-3 py-1 text-sm',
            autoPick ? 'border-[var(--brand-500)] text-[var(--brand-500)]' : 'border-gray-300'
          )}
        >
          Не знаю — выбрать за меня
        </button>
        {!showMore && (
          <button
            type="button"
            onClick={() => setShowMore(true)}
            className="text-sm text-[var(--brand-500)]"
          >
            Показать больше сценариев
          </button>
        )}
      </div>
      {selected.map((uc) => (
        <div key={uc.id}>{renderSubprops(uc.id)}</div>
      ))}
    </div>
  );
}
