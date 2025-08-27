import { useEffect, useState } from "react";
import clsx from "clsx";
import type {
  MarketplacesAnswer,
  MarketplaceId,
  DeliveryPref,
  PaymentPref,
} from "@/types/marketplaces";

interface MarketplacesStepProps {
  initial?: MarketplacesAnswer;
  onChange: (state: MarketplacesAnswer) => void;
}

interface MarketplaceOption {
  id: MarketplaceId;
  title: string;
  logo: string;
}

const ALL_OPTIONS: MarketplaceOption[] = [
  { id: "wb", title: "Wildberries", logo: "/quiz/marketplaces/wb.svg" },
  { id: "ozon", title: "Ozon", logo: "/quiz/marketplaces/ozon.svg" },
  { id: "ym", title: "Я.Маркет", logo: "/quiz/marketplaces/ym.svg" },
  { id: "lamoda", title: "Lamoda", logo: "/quiz/marketplaces/lamoda.svg" },
  { id: "brandstores", title: "Brand stores", logo: "/quiz/marketplaces/brandstores.svg" },
  { id: "showroom", title: "Оффлайн шоу-румы", logo: "/quiz/marketplaces/showroom.svg" },
  { id: "sbermega", title: "SberMega", logo: "/quiz/marketplaces/sbermega.svg" },
  { id: "kazanexpress", title: "KazanExpress", logo: "/quiz/marketplaces/kazanexpress.svg" },
];

const DEFAULT_STATE: MarketplacesAnswer = {
  any_ok: false,
  preferred: [],
  excluded: [],
};

export default function MarketplacesStep({ initial, onChange }: MarketplacesStepProps) {
  const [state, setState] = useState<MarketplacesAnswer>(initial ?? DEFAULT_STATE);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    onChange(state);
  }, [state, onChange]);

  const togglePreferred = (id: MarketplaceId) => {
    setState((s) => {
      const selected = s.preferred.includes(id);
      const nextPreferred = selected
        ? s.preferred.filter((x) => x !== id)
        : [...s.preferred, id];
      const next: MarketplacesAnswer = {
        ...s,
        any_ok: false,
        preferred: nextPreferred,
        excluded: s.excluded.filter((x) => x !== id),
      };
      sendEvent(selected ? "mp_card_deselect" : "mp_card_select", { id });
      return next;
    });
  };

  const toggleExcluded = (id: MarketplaceId) => {
    setState((s) => {
      const excluded = s.excluded.includes(id);
      const nextExcluded = excluded
        ? s.excluded.filter((x) => x !== id)
        : [...s.excluded, id];
      const next: MarketplacesAnswer = {
        ...s,
        any_ok: false,
        excluded: nextExcluded,
        preferred: s.preferred.filter((x) => x !== id),
      };
      sendEvent("mp_card_exclude_toggle", { id, excluded: !excluded });
      return next;
    });
  };

  const toggleAny = () => {
    setState((s) => {
      const next: MarketplacesAnswer = {
        any_ok: !s.any_ok,
        preferred: [],
        excluded: [],
      };
      sendEvent("mp_any_toggle", { value: next.any_ok });
      return next;
    });
  };

  const toggleDelivery = (key: keyof DeliveryPref) => {
    setState((s) => {
      const nextDelivery: DeliveryPref = { ...s.delivery, [key]: !s.delivery?.[key] };
      const next: MarketplacesAnswer = { ...s, delivery: nextDelivery };
      sendEvent("mp_pref_options_change", {
        delivery: nextDelivery,
        payment: s.payment,
        tryon: s.tryon,
      });
      return next;
    });
  };

  const togglePayment = (key: keyof PaymentPref) => {
    setState((s) => {
      const nextPayment: PaymentPref = { ...s.payment, [key]: !s.payment?.[key] };
      const next: MarketplacesAnswer = { ...s, payment: nextPayment };
      sendEvent("mp_pref_options_change", {
        delivery: s.delivery,
        payment: nextPayment,
        tryon: s.tryon,
      });
      return next;
    });
  };

  const toggleTryon = () => {
    setState((s) => {
      const next: MarketplacesAnswer = { ...s, tryon: !s.tryon };
      sendEvent("mp_pref_options_change", {
        delivery: s.delivery,
        payment: s.payment,
        tryon: !s.tryon,
      });
      return next;
    });
  };

  const toggleLoyalty = (id: MarketplaceId) => {
    setState((s) => {
      const nextLoyalty = { ...s.loyalty, [id]: !s.loyalty?.[id] };
      const next: MarketplacesAnswer = { ...s, loyalty: nextLoyalty };
      return next;
    });
  };

  const visibleOptions = showMore ? ALL_OPTIONS : ALL_OPTIONS.slice(0, 4);
  const hasSelection = state.preferred.length > 0;

  return (
    <div>
      <p className="mb-4 text-gray-600">
        Выберите, где удобно покупать. Можно несколько — или <strong>Любой</strong>
      </p>
      <div
        role="listbox"
        aria-multiselectable="true"
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {visibleOptions.map((opt) => {
          const selected = state.preferred.includes(opt.id);
          const excluded = state.excluded.includes(opt.id);
          return (
            <div key={opt.id} className="relative">
              <button
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => togglePreferred(opt.id)}
                className={clsx(
                  "flex w-full flex-col items-center justify-center rounded-2xl border p-4 text-center transition",
                  selected && "bg-[var(--brand-50)] border-[var(--brand-500)]",
                  !selected && !excluded && "bg-white border-gray-200 hover:border-[var(--brand-500)]",
                  excluded && "border-red-400 opacity-40"
                )}
              >
                <img
                  src={opt.logo}
                  alt=""
                  className="mb-2 h-12 w-12 object-contain"
                  loading="lazy"
                />
                <span className="text-sm">{opt.title}</span>
                {selected && (
                  <span className="absolute right-2 top-2 rounded-full bg-[var(--brand-500)] px-1 text-white">
                    ✓
                  </span>
                )}
              </button>
              <button
                type="button"
                aria-label="Исключить"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExcluded(opt.id);
                }}
                className="absolute right-1 top-1 rounded-full bg-white p-1 text-xs shadow"
              >
                🚫
              </button>
              {excluded && (
                <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-red-500">
                  <div className="absolute inset-0 flex items-center justify-center text-2xl text-red-500">
                    ✕
                  </div>
                </div>
              )}
            </div>
          );
        })}
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
          aria-checked={state.any_ok}
          onClick={toggleAny}
          className={clsx(
            "w-full rounded-2xl border px-4 py-3 text-center",
            state.any_ok
              ? "border-[var(--brand-500)] bg-[var(--brand-50)] text-[var(--brand-700)]"
              : "border-gray-200"
          )}
        >
          Любой
        </button>
      </div>
      {!state.any_ok && state.preferred.length === 0 && state.excluded.length === 0 && (
        <div className="mt-2 text-sm text-gray-500">
          Можно оставить пустым — подберём по наличию
        </div>
      )}
      {!state.any_ok && hasSelection && (
        <div className="mt-6 space-y-4">
          <div>
            <div className="mb-2 font-medium">Доставка</div>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "pickup", label: "самовывоз" },
                { key: "courier", label: "курьер" },
                { key: "locker", label: "постамат" },
              ].map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => toggleDelivery(d.key as keyof DeliveryPref)}
                  className={clsx(
                    "rounded-full border px-3 py-1 text-sm",
                    state.delivery?.[d.key as keyof DeliveryPref]
                      ? "border-[var(--brand-500)] bg-[var(--brand-50)] text-[var(--brand-700)]"
                      : "border-gray-300 text-gray-600"
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 font-medium">Оплата</div>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "card", label: "карта" },
                { key: "split", label: "сплит/рассрочка" },
              ].map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => togglePayment(p.key as keyof PaymentPref)}
                  className={clsx(
                    "rounded-full border px-3 py-1 text-sm",
                    state.payment?.[p.key as keyof PaymentPref]
                      ? "border-[var(--brand-500)] bg-[var(--brand-50)] text-[var(--brand-700)]"
                      : "border-gray-300 text-gray-600"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={state.tryon ?? false}
                onChange={toggleTryon}
              />
              <span>хочу с примеркой</span>
            </label>
          </div>
          <div>
            <div className="mb-2 font-medium">Лояльность</div>
            <div className="space-y-2">
              {state.preferred.map((id) => {
                const opt = ALL_OPTIONS.find((o) => o.id === id);
                if (!opt) return null;
                return (
                  <label key={id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!state.loyalty?.[id]}
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
    const win = window as {
      plausible?: (e: string, o?: Record<string, unknown>) => void;
    };
    win.plausible?.(event, props);
  }
}

