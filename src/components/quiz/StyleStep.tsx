import { useEffect, useState, SyntheticEvent } from "react";
import clsx from "clsx";

export interface StyleStepProps {
  selected: string[];
  autoPick: boolean;
  onAutoChange: (v: boolean) => void;
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

export default function StyleStep({
  selected,
  autoPick,
  onAutoChange,
  onChange,
  goal,
}: StyleStepProps) {
  const [showExamples, setShowExamples] = useState(false);
  const [limitHit, setLimitHit] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (autoPick) {
      const defaults = AUTO_PICK[goal] || [];
      onChange(defaults.slice(0, 2));
    }
  }, [autoPick, goal, onChange]);

  const handleImgError = (e: SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 200'%3E%3Crect width='160' height='200' fill='%23ddd'/%3E%3C/svg%3E";
  };

  const toggle = (id: string) => {
    if (autoPick) {
      const confirm = window.confirm(
        "Отключить автоматический выбор и выбрать вручную?",
      );
      if (!confirm) return;
      onAutoChange(false);
      onChange([]);
    }
    const exists = selected.includes(id);
    if (exists) {
      onChange(selected.filter((s) => s !== id));
      sendEvent("style_deselect", { id, total: selected.length - 1 });
    } else {
      if (selected.length >= 2) {
        setLimitHit(true);
        setToast(true);
        sendEvent("style_limit_hit");
        setTimeout(() => setLimitHit(false), 600);
        setTimeout(() => setToast(false), 2000);
        return;
      }
      onChange([...selected, id]);
      sendEvent("style_select", { id, total: selected.length + 1 });
    }
  };

  const handleAuto = () => {
    const next = !autoPick;
    onAutoChange(next);
    if (next) {
      const defaults = AUTO_PICK[goal] || [];
      onChange(defaults.slice(0, 2));
    } else {
      onChange([]);
    }
    sendEvent("style_auto_pick_toggle", { value: next });
  };

  const count = selected.length;

  useEffect(() => {
    OPTIONS.forEach((opt) => sendEvent("style_card_view", { id: opt.id }));
  }, []);

  return (
    <div>
      {toast && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-md bg-black px-3 py-2 text-sm text-white">
          Не более двух стилей
        </div>
      )}
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">Стиль (до 2)</h2>
        <div
          className={clsx(
            "text-sm",
            limitHit ? "text-red-600 animate-shake" : "text-gray-500",
          )}
        >
          {limitHit ? `${count + 1}/2` : `${count}/2`}
        </div>
      </div>
      <p className="mb-4 text-sm text-gray-500">
        Выберите, как вы хотите выглядеть. Можно пропустить.
      </p>
      <div
        className={clsx(
          "grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4",
          limitHit && "animate-shake",
        )}
        role="listbox"
        aria-multiselectable="true"
      >
        {OPTIONS.map((opt) => {
          const isSelected = selected.includes(opt.id);
          const disabled = !isSelected && count >= 2;
          const autoDisabled = autoPick;
          return (
            <button
              key={opt.id}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => toggle(opt.id)}
              disabled={disabled}
              aria-disabled={autoDisabled || undefined}
              className={clsx(
                "relative flex flex-col rounded-2xl border p-3 text-left transition",
                "bg-[#F7F7F8] shadow-[0_6px_20px_rgba(0,0,0,0.06)] border-[#E8E9ED]",
                "overflow-hidden",
                (disabled || autoDisabled) && "cursor-not-allowed opacity-40",
                isSelected && "border-[var(--brand-500)]",
                !isSelected && !autoDisabled && "hover:border-[var(--brand-500)]",
              )}
            >
              <div className="relative mb-3 aspect-[4/5] w-full overflow-hidden rounded-xl">
                <img
                  src={opt.image}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={handleImgError}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/40 to-transparent" />
                {isSelected && (
                  <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand-500)] text-white">
                    ✓
                  </span>
                )}
              </div>
              <div className="font-medium">{opt.title}</div>
              <div className="mt-1 flex flex-wrap gap-1 text-xs text-gray-500">
                {opt.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-gray-100 px-2 py-0.5 uppercase"
                  >
                    {chip}
                  </span>
                ))}
              </div>
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
            autoPick
              ? "border-[var(--brand-500)] bg-[var(--brand-50)] text-[var(--brand-700)]"
              : "border-gray-300 text-gray-600",
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
      {autoPick && (
        <div className="mt-2 text-xs text-gray-500">
          Мы подберём стиль на основе ваших ответов
        </div>
      )}
      {count === 2 && !autoPick && (
        <div className="mt-2 text-xs text-gray-500">Можно менять выбор</div>
      )}
      {showExamples && <ExamplesModal onClose={() => setShowExamples(false)} />}
      <style jsx>{`
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.4s; }
      `}</style>
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
                  : "bg-gray-100 text-gray-700",
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

