import { useState } from "react";
import clsx from "clsx";

export type MarketplaceId =
  | "wb"
  | "ozon"
  | "ym"
  | "lamoda"
  | "brandstores"
  | "showroom"
  | "sbermega"
  | "kazan";

export interface MarketplacesAnswer {
  any_ok: boolean;
  preferred: MarketplaceId[];
  excluded: MarketplaceId[];
  delivery?: { pickup?: boolean; courier?: boolean; locker?: boolean };
  payment?: { card?: boolean; split?: boolean };
  tryon?: boolean;
  loyalty?: Partial<Record<MarketplaceId, boolean>>;
}

interface MarketplacesStepProps {
  answer: MarketplacesAnswer;
  onChange: (ans: MarketplacesAnswer) => void;
}

const BASE_OPTIONS: { id: MarketplaceId; title: string; emoji: string }[] = [
  { id: "wb", title: "Wildberries", emoji: "🟣" },
  { id: "ozon", title: "Ozon", emoji: "🟦" },
  { id: "ym", title: "Я.Маркет", emoji: "🟨" },
  { id: "lamoda", title: "Lamoda", emoji: "🟫" },
  { id: "brandstores", title: "Brand stores", emoji: "🏬" },
  { id: "showroom", title: "Шоу-румы", emoji: "🛍️" },
];

const EXTRA_OPTIONS: { id: MarketplaceId; title: string; emoji: string }[] = [
  { id: "sbermega", title: "SberMega", emoji: "🟩" },
  { id: "kazan", title: "KazanExpress", emoji: "🟥" },
];

export default function MarketplacesStep({ answer, onChange }: MarketplacesStepProps) {
  const [showMore, setShowMore] = useState(false);
  const options = showMore ? [...BASE_OPTIONS, ...EXTRA_OPTIONS] : BASE_OPTIONS;

  const toggleAny = () => {
    const next = !answer.any_ok;
    onChange(
      next
        ? { any_ok: true, preferred: [], excluded: [], delivery: undefined, payment: undefined, tryon: false, loyalty: {} }
        : { ...answer, any_ok: false }
    );
    sendEvent("mp_any_toggle", { value: next });
  };

  const toggleSelect = (id: MarketplaceId) => {
    const isSelected = answer.preferred.includes(id);
    const isExcluded = answer.excluded.includes(id);
    if (isSelected) {
      const preferred = answer.preferred.filter((m) => m !== id);
      onChange({ ...answer, preferred });
      sendEvent("mp_card_deselect", { id });
      return;
    }
    const preferred = [...answer.preferred, id];
    const excluded = answer.excluded.filter((m) => m !== id);
    onChange({ ...answer, any_ok: false, preferred, excluded });
    if (isExcluded) sendEvent("mp_card_exclude_toggle", { id, excluded: false });
    sendEvent("mp_card_select", { id });
  };

  const toggleExclude = (id: MarketplaceId) => {
    const isExcluded = answer.excluded.includes(id);
    const excluded = isExcluded
      ? answer.excluded.filter((m) => m !== id)
      : [...answer.excluded.filter((m) => m !== id), id];
    const preferred = answer.preferred.filter((m) => m !== id);
    onChange({ ...answer, any_ok: false, preferred, excluded });
    sendEvent("mp_card_exclude_toggle", { id, excluded: !isExcluded });
  };

  const toggleDelivery = (key: "pickup" | "courier" | "locker") => {
    const next = { ...(answer.delivery || {}), [key]: !answer.delivery?.[key] };
    onChange({ ...answer, delivery: next });
    sendEvent("mp_pref_options_change", { delivery: next, payment: answer.payment, tryon: answer.tryon });
  };

  const togglePayment = (key: "card" | "split") => {
    const next = { ...(answer.payment || {}), [key]: !answer.payment?.[key] };
    onChange({ ...answer, payment: next });
    sendEvent("mp_pref_options_change", { delivery: answer.delivery, payment: next, tryon: answer.tryon });
  };

  const toggleTryon = () => {
    const next = !answer.tryon;
    onChange({ ...answer, tryon: next });
    sendEvent("mp_pref_options_change", { delivery: answer.delivery, payment: answer.payment, tryon: next });
  };

  const toggleLoyalty = (id: MarketplaceId) => {
    const current = answer.loyalty || {};
    const next = { ...current, [id]: !current[id] };
    onChange({ ...answer, loyalty: next });
    sendEvent("mp_pref_options_change", { delivery: answer.delivery, payment: answer.payment, tryon: answer.tryon });
  };

  const renderCard = (opt: { id: MarketplaceId; title: string; emoji: string }) => {
    const isSelected = answer.preferred.includes(opt.id);
    const isExcluded = answer.excluded.includes(opt.id);
    return (
      <button
        key={opt.id}
        type="button"
        role="option"
        aria-selected={isSelected}
        onClick={() => toggleSelect(opt.id)}
        className={clsx(
          "relative flex flex-col items-center justify-center rounded-2xl border px-4 py-3 text-sm transition focus:outline-none",
          "w-full aspect-square md:aspect-auto md:h-32",
          isSelected && "border-[var(--brand-500)] bg-[var(--brand-50)]",
          isExcluded && "border-red-500",
          !isSelected && !isExcluded && "border-[#E8E9ED] bg-white hover:border-[var(--brand-500)]",
          "focus-visible:border-[var(--brand-500)]"
        )}
      >
        <span className="text-3xl" aria-hidden>
          {opt.emoji}
        </span>
        <span className="mt-2">{opt.title}</span>
        {isSelected && (
          <span className="absolute left-2 top-2 rounded-full bg-[var(--brand-500)] px-1 text-white">✓</span>
        )}
        <button
          type="button"
          aria-pressed={isExcluded}
          title="Не показывать товары с этой площадки"
          onClick={(e) => {
            e.stopPropagation();
            toggleExclude(opt.id);
          }}
          className="absolute right-2 top-2 text-xs text-red-500"
        >
          🚫
        </button>
        {isExcluded && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-red-500">
            не показывать
          </span>
        )}
      </button>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Маркетплейсы</h2>
      <p className="mt-1 text-sm text-gray-600">
        Выберите, где удобно покупать. Можно несколько — или <strong>Любой</strong>
      </p>
      <div
        role="listbox"
        aria-multiselectable="true"
        className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        {options.map((opt) => renderCard(opt))}
      </div>
      {!showMore && (
        <button
          type="button"
          className="mt-4 text-sm text-[var(--brand-600)] underline"
          onClick={() => setShowMore(true)}
        >
          Показать больше площадок
        </button>
      )}
      <div className="mt-4">
        <button
          type="button"
          role="switch"
          aria-checked={answer.any_ok}
          onClick={toggleAny}
          className={clsx(
            "w-full rounded-full border px-4 py-2 text-center", // base
            answer.any_ok
              ? "border-[var(--brand-500)] bg-[var(--brand-50)] text-[var(--brand-700)]"
              : "border-[#E8E9ED] text-gray-700 hover:border-[var(--brand-500)]"
          )}
        >
          Любой
        </button>
      </div>
      {answer.preferred.length === 0 && !answer.any_ok && (
        <p className="mt-3 text-sm text-gray-500">
          Можно оставить пустым — подберём по наличию
        </p>
      )}
      {answer.preferred.length > 0 && (
        <div className="mt-6 space-y-4">
          <div>
            <div className="mb-1 text-sm font-medium">Доставка</div>
            <div className="flex gap-2">
              {([
                { key: "pickup", label: "самовывоз" },
                { key: "courier", label: "курьер" },
                { key: "locker", label: "постамат" },
              ] as const).map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => toggleDelivery(d.key)}
                  className={clsx(
                    "rounded-full border px-3 py-1 text-sm", // base
                    answer.delivery?.[d.key]
                      ? "border-[var(--brand-500)] bg-[var(--brand-50)] text-[var(--brand-700)]"
                      : "border-[#E8E9ED] text-gray-700 hover:border-[var(--brand-500)]"
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1 text-sm font-medium">Оплата</div>
            <div className="flex gap-2">
              {([
                { key: "card", label: "карта" },
                { key: "split", label: "сплит/рассрочка" },
              ] as const).map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => togglePayment(p.key)}
                  className={clsx(
                    "rounded-full border px-3 py-1 text-sm",
                    answer.payment?.[p.key]
                      ? "border-[var(--brand-500)] bg-[var(--brand-50)] text-[var(--brand-700)]"
                      : "border-[#E8E9ED] text-gray-700 hover:border-[var(--brand-500)]"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={!!answer.tryon} onChange={toggleTryon} />
            <span className="text-sm">хочу с примеркой</span>
          </label>
          <div>
            <div className="mb-1 text-sm font-medium">Лояльность</div>
            <div className="flex flex-col gap-1">
              {answer.preferred.map((id) => {
                const opt = [...BASE_OPTIONS, ...EXTRA_OPTIONS].find((o) => o.id === id);
                if (!opt) return null;
                return (
                  <label key={id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={!!answer.loyalty?.[id]}
                      onChange={() => toggleLoyalty(id)}
                    />
                    <span>{opt.title}: есть подписка / баллы</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function sendEvent(event: string, props?: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    const win = window as { plausible?: (e: string, o?: Record<string, unknown>) => void };
    win.plausible?.(event, props);
  }
}

