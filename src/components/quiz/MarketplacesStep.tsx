import Image from "next/image";
import { useEffect, useState } from "react";
import clsx from "clsx";

export type MarketplaceId =
  | "wb"
  | "ozon"
  | "ym"
  | "lamoda"
  | "brandstores"
  | "showroom"
  | "sber"
  | "kazan";

export type DeliveryPref = {
  pickup?: boolean;
  courier?: boolean;
  locker?: boolean;
};
export type PaymentPref = {
  card?: boolean;
  split?: boolean;
};
export type LoyaltyPref = Partial<Record<MarketplaceId, boolean>>;

export interface MarketplacesAnswer {
  any_ok: boolean;
  preferred: MarketplaceId[];
  excluded: MarketplaceId[];
  delivery?: DeliveryPref;
  payment?: PaymentPref;
  tryon?: boolean;
  loyalty?: LoyaltyPref;
}

interface MarketplacesStepProps {
  initialState: MarketplacesAnswer;
  onChange: (state: MarketplacesAnswer) => void;
}

const ALL_MARKETPLACES: { id: MarketplaceId; label: string; logo?: string }[] = [
  { id: "wb", label: "Wildberries", logo: "/partners/wb.svg" },
  { id: "ozon", label: "Ozon", logo: "/partners/ozon.svg" },
  { id: "ym", label: "Я.Маркет", logo: "/partners/yamarket.svg" },
  { id: "lamoda", label: "Lamoda" },
  { id: "brandstores", label: "Brand stores" },
  { id: "showroom", label: "Оффлайн шоу-румы" },
  { id: "sber", label: "SberMega" },
  { id: "kazan", label: "KazanExpress" },
];

const PRIMARY_COUNT = 6;

export default function MarketplacesStep({ initialState, onChange }: MarketplacesStepProps) {
  const [state, setState] = useState<MarketplacesAnswer>(initialState);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    onChange(state);
  }, [state, onChange]);

  const togglePreferred = (id: MarketplaceId) => {
    const exists = state.preferred.includes(id);
    const preferred = exists
      ? state.preferred.filter((x) => x !== id)
      : [...state.preferred, id];
    setState({
      ...state,
      any_ok: false,
      preferred,
      excluded: state.excluded.filter((x) => x !== id),
    });
    sendEvent(exists ? "mp_card_deselect" : "mp_card_select", { id });
  };

  const toggleExcluded = (id: MarketplaceId) => {
    const exists = state.excluded.includes(id);
    const excluded = exists
      ? state.excluded.filter((x) => x !== id)
      : [...state.excluded, id];
    setState({
      ...state,
      any_ok: false,
      excluded,
      preferred: state.preferred.filter((x) => x !== id),
    });
    sendEvent("mp_card_exclude_toggle", { id, excluded: !exists });
  };

  const toggleAny = () => {
    const next = !state.any_ok;
    setState({
      any_ok: next,
      preferred: [],
      excluded: [],
      delivery: {},
      payment: {},
      tryon: false,
      loyalty: {},
    });
    sendEvent("mp_any_toggle", { value: next });
  };

  const toggleDelivery = (k: keyof DeliveryPref) => {
    const next = { ...(state.delivery || {}) };
    next[k] = !next[k];
    setState({ ...state, delivery: next });
    sendEvent("mp_pref_options_change", {
      delivery: next,
      payment: state.payment,
      tryon: state.tryon,
    });
  };

  const togglePayment = (k: keyof PaymentPref) => {
    const next = { ...(state.payment || {}) };
    next[k] = !next[k];
    setState({ ...state, payment: next });
    sendEvent("mp_pref_options_change", {
      delivery: state.delivery,
      payment: next,
      tryon: state.tryon,
    });
  };

  const toggleTryon = () => {
    const next = !state.tryon;
    setState({ ...state, tryon: next });
    sendEvent("mp_pref_options_change", {
      delivery: state.delivery,
      payment: state.payment,
      tryon: next,
    });
  };

  const toggleLoyalty = (id: MarketplaceId) => {
    const next = { ...(state.loyalty || {}) };
    next[id] = !next[id];
    setState({ ...state, loyalty: next });
  };

  const chipClass = (active?: boolean) =>
    clsx(
      "rounded-full border px-3 py-1 text-sm",
      active
        ? "border-[var(--brand-500)] bg-[var(--brand-50)]"
        : "border-black/10 bg-black/5"
    );

  const marketplaces = showAll
    ? ALL_MARKETPLACES
    : ALL_MARKETPLACES.slice(0, PRIMARY_COUNT);

  const labelById = (id: MarketplaceId) =>
    ALL_MARKETPLACES.find((m) => m.id === id)?.label || id;

  return (
    <div>
      <h2 className="mb-2 text-xl font-semibold">Маркетплейсы</h2>
      <p className="mb-4 text-sm text-gray-500">
        Выберите, где удобно покупать. Можно несколько — или <strong>Любой</strong>
      </p>
      <div
        role="listbox"
        aria-multiselectable="true"
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {marketplaces.map((m) => {
          const selected = state.preferred.includes(m.id);
          const excluded = state.excluded.includes(m.id);
          return (
            <div
              key={m.id}
              role="option"
              aria-selected={selected}
              onClick={() => togglePreferred(m.id)}
              className={clsx(
                "relative cursor-pointer select-none rounded-2xl border p-4 text-center transition",
                selected && "border-[var(--brand-500)] bg-[var(--brand-50)]",
                excluded && "border-red-400 bg-red-50",
                !selected && !excluded && "border-[#E8E9ED] bg-white hover:shadow"
              )}
            >
              <button
                type="button"
                aria-label="Не показывать"
                aria-pressed={excluded}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExcluded(m.id);
                }}
                className="absolute right-2 top-2 text-sm"
              >
                🚫
              </button>
              {m.logo ? (
                <Image
                  src={m.logo}
                  alt=""
                  width={64}
                  height={32}
                  className="mx-auto h-8 w-auto object-contain"
                />
              ) : (
                <span className="block h-8" />
              )}
              <span className="mt-2 block text-sm">
                {excluded ? "Не показывать" : m.label}
              </span>
              {selected && (
                <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand-500)] text-white">
                  ✓
                </span>
              )}
            </div>
          );
        })}
      </div>
      {ALL_MARKETPLACES.length > PRIMARY_COUNT && (
        <button
          type="button"
          onClick={() => setShowAll((s) => !s)}
          className="mt-3 text-sm text-[var(--brand-500)] underline"
        >
          {showAll ? "Скрыть" : "Показать больше площадок"}
        </button>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={state.any_ok}
        onClick={toggleAny}
        className={clsx(
          "mt-4 w-full rounded-2xl border px-4 py-3",
          state.any_ok
            ? "border-[var(--brand-500)] bg-[var(--brand-50)]"
            : "border-[#E8E9ED]"
        )}
      >
        Любой
      </button>
      {!state.any_ok &&
        state.preferred.length === 0 &&
        state.excluded.length === 0 && (
          <p className="mt-2 text-sm text-gray-500">
            Можно оставить пустым — подберём по наличию
          </p>
        )}

      {state.preferred.length > 0 && (
        <div className="mt-6 space-y-4">
          <div>
            <div className="mb-1 font-medium">Доставка</div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => toggleDelivery("pickup")}
                className={chipClass(state.delivery?.pickup)}
              >
                самовывоз
              </button>
              <button
                type="button"
                onClick={() => toggleDelivery("courier")}
                className={chipClass(state.delivery?.courier)}
              >
                курьер
              </button>
              <button
                type="button"
                onClick={() => toggleDelivery("locker")}
                className={chipClass(state.delivery?.locker)}
              >
                постамат
              </button>
            </div>
          </div>
          <div>
            <div className="mb-1 font-medium">Оплата</div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => togglePayment("card")}
                className={chipClass(state.payment?.card)}
              >
                карта
              </button>
              <button
                type="button"
                onClick={() => togglePayment("split")}
                className={chipClass(state.payment?.split)}
              >
                сплит/рассрочка
              </button>
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={state.tryon ?? false}
              onChange={toggleTryon}
            />
            хочу с примеркой
          </label>
          <div>
            <div className="mb-1 font-medium">Лояльность</div>
            <div className="space-y-2">
              {state.preferred.map((id) => (
                <label key={id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!state.loyalty?.[id]}
                    onChange={() => toggleLoyalty(id)}
                  />
                  {labelById(id)} — есть подписка/баллы
                </label>
              ))}
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

