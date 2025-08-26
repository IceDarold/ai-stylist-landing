import { useEffect, useState } from "react";
import type {
  DeliveryPref,
  MarketplacesAnswer,
  MarketplaceId,
  PaymentPref,
} from "@/types/marketplaces";

interface MarketplacesStepProps {
  initial?: MarketplacesAnswer;
  onChange: (answer: MarketplacesAnswer) => void;
}

const MAIN_MARKETPLACES: { id: MarketplaceId; label: string }[] = [
  { id: "wb", label: "Wildberries" },
  { id: "ozon", label: "Ozon" },
  { id: "ym", label: "Я.Маркет" },
];

const MORE_MARKETPLACES: { id: MarketplaceId; label: string }[] = [
  { id: "lamoda", label: "Lamoda" },
  { id: "brandstores", label: "Brand stores" },
  { id: "showroom", label: "Шоу-румы" },
];

export default function MarketplacesStep({ initial, onChange }: MarketplacesStepProps) {
  const [state, setState] = useState<MarketplacesAnswer>(
    initial ?? { any_ok: false, preferred: [], excluded: [] },
  );
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    onChange(state);
  }, [state, onChange]);

  const togglePreferred = (id: MarketplaceId) => {
    setState((s) => {
      const preferred = s.preferred.includes(id)
        ? s.preferred.filter((p) => p !== id)
        : [...s.preferred, id];
      const excluded = s.excluded.filter((e) => e !== id);
      return { ...s, any_ok: false, preferred, excluded };
    });
  };

  const toggleExcluded = (id: MarketplaceId) => {
    setState((s) => {
      const excluded = s.excluded.includes(id)
        ? s.excluded.filter((e) => e !== id)
        : [...s.excluded, id];
      const preferred = s.preferred.filter((p) => p !== id);
      return { ...s, any_ok: false, preferred, excluded };
    });
  };

  const toggleAny = () => {
    setState((s) =>
      s.any_ok
        ? { ...s, any_ok: false }
        : { any_ok: true, preferred: [], excluded: [] },
    );
  };

  const toggleDelivery = (k: keyof DeliveryPref) => {
    setState((s) => ({
      ...s,
      delivery: { ...s.delivery, [k]: !s.delivery?.[k] },
    }));
  };

  const togglePayment = (k: keyof PaymentPref) => {
    setState((s) => ({
      ...s,
      payment: { ...s.payment, [k]: !s.payment?.[k] },
    }));
  };

  const toggleTryon = () => setState((s) => ({ ...s, tryon: !s.tryon }));

  const toggleLoyalty = (id: MarketplaceId) => {
    setState((s) => ({
      ...s,
      loyalty: { ...s.loyalty, [id]: !s.loyalty?.[id] },
    }));
  };

  const chosen = (id: MarketplaceId) => state.preferred.includes(id);
  const excluded = (id: MarketplaceId) => state.excluded.includes(id);

  const marketplaces = showMore
    ? [...MAIN_MARKETPLACES, ...MORE_MARKETPLACES]
    : MAIN_MARKETPLACES;

  const hasSelection = state.preferred.length > 0;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="mb-2 text-xl font-semibold">Маркетплейсы</h2>
        <p className="text-sm text-black/60">
          Выберите, где удобно покупать. Можно несколько — или <b>Любой</b>
        </p>
      </div>

      <div
        role="listbox"
        aria-multiselectable="true"
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {marketplaces.map((m) => {
          const isChosen = chosen(m.id);
          const isExcluded = excluded(m.id);
          return (
            <div
              key={m.id}
              role="option"
              aria-selected={isChosen}
              onClick={() => togglePreferred(m.id)}
              className={`relative cursor-pointer rounded-2xl border p-4 text-center transition ${
                isChosen
                  ? "border-amber-400 bg-amber-50"
                  : isExcluded
                  ? "border-red-400 bg-red-50"
                  : "border-black/10 bg-white hover:bg-black/5"
              }`}
            >
              <div className="mb-2 flex h-8 items-center justify-center">
                <span className="rounded bg-black/10 px-2 text-xs uppercase">
                  {m.label.slice(0, 2)}
                </span>
              </div>
              <div className="text-sm">
                {isExcluded ? "Не показывать" : m.label}
              </div>
              <button
                type="button"
                aria-label="Исключить"
                aria-pressed={isExcluded}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExcluded(m.id);
                }}
                className="absolute right-1 top-1 text-xs"
              >
                {isExcluded ? "↺" : "🚫"}
              </button>
            </div>
          );
        })}
      </div>

      {!showMore && (
        <button
          type="button"
          onClick={() => setShowMore(true)}
          className="text-sm text-blue-600 underline"
        >
          Показать больше площадок
        </button>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={state.any_ok}
        onClick={toggleAny}
        className={`w-full rounded-2xl border px-4 py-3 text-center ${
          state.any_ok
            ? "border-black bg-black text-white"
            : "border-black/10 bg-white"
        }`}
      >
        Любой
      </button>

      {hasSelection && (
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 font-medium">Доставка</h3>
            <div className="flex flex-wrap gap-2">
              {([
                ["pickup", "самовывоз"],
                ["courier", "курьер"],
                ["locker", "постамат"],
              ] as const).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => toggleDelivery(k)}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    state.delivery?.[k]
                      ? "border-black bg-black text-white"
                      : "border-black/10 bg-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-medium">Оплата</h3>
            <div className="flex flex-wrap gap-2">
              {([
                ["card", "карта"],
                ["split", "сплит/рассрочка"],
              ] as const).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => togglePayment(k)}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    state.payment?.[k]
                      ? "border-black bg-black text-white"
                      : "border-black/10 bg-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={state.tryon ?? false}
              onChange={toggleTryon}
            />
            <span>хочу с примеркой</span>
          </label>

          <div className="space-y-1">
            {state.preferred.map((id) => (
              <label key={id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!state.loyalty?.[id]}
                  onChange={() => toggleLoyalty(id)}
                />
                <span>
                  есть подписка / баллы — {
                    [...MAIN_MARKETPLACES, ...MORE_MARKETPLACES].find(
                      (m) => m.id === id,
                    )?.label
                  }
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
