import Image from "next/image";
import { useEffect, useState } from "react";

export type Brand = {
  id: string;
  name: string;
  tier: "mass" | "premium" | "luxury";
  logo_url?: string;
};

interface State {
  selected: Brand[];
  custom: string[];
  autoPick: boolean;
}

export function FavoriteBrandsStep({
  initial = [],
  onChange,
}: {
  initial?: Brand[];
  onChange: (state: State) => void;
}) {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Brand[]>(initial);
  const [custom, setCustom] = useState<string[]>([]);
  const [autoPick, setAutoPick] = useState(false);
  const [tierTab, setTierTab] = useState<Brand["tier"]>("mass");
  const [popular, setPopular] = useState<Brand[]>([]);
  const [results, setResults] = useState<Brand[]>([]);
  const limit = 3;

  // fetch popular by tier
  useEffect(() => {
    fetch(`/api/brands/popular?tier=${tierTab}`)
      .then((r) => r.json())
      .then(setPopular)
      .catch(() => setPopular([]));
  }, [tierTab]);

  // search (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      if (!q.trim()) return setResults([]);
      fetch(`/api/brands/search?q=${encodeURIComponent(q.trim())}&tier=${tierTab}`)
        .then((r) => r.json())
        .then(setResults)
        .catch(() => setResults([]));
    }, 250);
    return () => clearTimeout(t);
  }, [q, tierTab]);

  useEffect(() => onChange({ selected, custom, autoPick }), [selected, custom, autoPick, onChange]);

  const canAdd = selected.length < limit && !autoPick;

  const add = (b: Brand) => {
    if (autoPick) {
      const disable = confirm("Выключить автоподбор?");
      if (!disable) return;
      setAutoPick(false);
    }
    if (selected.length >= limit) {
      alert("Не более трёх брендов");
      sendEvent("brand_limit_hit");
      return;
    }
    if (selected.find((x) => x.id === b.id)) return;
    setSelected((s) => [...s, b]);
    setQ("");
    setResults([]);
    sendEvent("brand_select", { id: b.id, name: b.name, total: selected.length + 1 });
  };
  const remove = (id: string) => {
    setSelected((s) => s.filter((x) => x.id !== id));
    sendEvent("brand_deselect", { id, total: selected.length - 1 });
  };

  const handleAuto = () => {
    const next = !autoPick;
    setAutoPick(next);
    if (next) setSelected([]);
    sendEvent("brand_auto_pick_toggle", { value: next });
  };

  const handleAddCustom = () => {
    if (selected.length >= limit) {
      alert("Не более трёх брендов");
      sendEvent("brand_limit_hit");
      return;
    }
    const name = prompt("Введите название бренда");
    if (!name) return;
    setCustom((c) => [...c, name]);
    sendEvent("brand_add_custom", { name });
  };

  const count = selected.length;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">Любимые бренды (до 3)</h2>
        <div className="text-sm text-gray-500">{count}/{limit}</div>
      </div>
      <p className="mb-4 text-sm text-gray-500">Выберите любимые бренды. Можно пропустить.</p>

      <div className="space-y-5">
        {/* Combobox */}
        <div className="relative">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={autoPick ? "Автовыбор включён" : "Начните вводить: Zara, COS…"}
            disabled={!canAdd}
            aria-disabled={!canAdd}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none disabled:bg-black/5"
          />
          {q && results.length > 0 && (
            <ul
              role="listbox"
              className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg"
            >
              {results.map((b) => (
                <li
                  key={b.id}
                  role="option"
                  onClick={() => add(b)}
                  className="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-black/5"
                >
                  {b.logo_url ? (
                    <Image src={b.logo_url} alt="" width={24} height={24} className="h-6 w-6 object-contain" />
                  ) : (
                    <div className="h-6 w-6 rounded bg-black/10" />
                  )}
                  <span className="flex-1">{b.name}</span>
                  <span className="text-xs text-black/50 uppercase">{b.tier}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Selected chips */}
        <div className="flex flex-wrap gap-2">
          {selected.map((b) => (
            <span
              key={b.id}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1"
            >
              {b.logo_url ? (
                <Image src={b.logo_url} alt="" width={16} height={16} className="h-4 w-4 object-contain" />
              ) : null}
              <span className="text-sm">{b.name}</span>
              <button
                onClick={() => remove(b.id)}
                aria-label={`Убрать ${b.name}`}
                className="text-black/50 hover:text-black"
              >
                ×
              </button>
            </span>
          ))}
          {selected.length === 0 && (
            <span className="text-sm text-black/50">Вы пока ничего не выбрали</span>
          )}
        </div>

        {/* Tabs + popular */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2 rounded-full bg-black/5 p-1">
            {(["mass", "premium", "luxury"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTierTab(t)}
                className={`rounded-full px-3 py-1 text-sm ${
                  tierTab === t ? "bg-white shadow border border-black/10" : "text-black/60"
                }`}
              >
                {t === "mass" ? "Mass" : t === "premium" ? "Premium" : "Luxury"}
              </button>
            ))}
          </div>
          <div className="text-sm text-black/50">{count}/{limit}</div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {popular.map((b) => {
            const chosen = !!selected.find((x) => x.id === b.id);
            const disabled = !chosen && !canAdd;
            return (
              <button
                key={b.id}
                onClick={() => (chosen ? remove(b.id) : add(b))}
                disabled={disabled}
                aria-pressed={chosen}
                className={`group relative flex items-center justify-center rounded-2xl border px-3 py-4 transition ${
                  chosen
                    ? "border-amber-400 bg-amber-50"
                    : "border-black/10 bg-white hover:bg-black/5"
                } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {b.logo_url ? (
                  <Image src={b.logo_url} alt={b.name} width={80} height={32} className="h-8 w-auto object-contain" />
                ) : (
                  <span className="text-sm">{b.name}</span>
                )}
                {chosen && (
                  <span className="absolute right-2 top-2 rounded-full bg-amber-400 px-1.5 text-[11px] text-white">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleAuto}
            className={`rounded-full px-3 py-1 text-sm ${
              autoPick ? "bg-black/90 text-white" : "bg-black/5 text-black/70"
            }`}
          >
            Не знаю брендов — подобрать по стилю
          </button>

          <button
            onClick={handleAddCustom}
            disabled={!canAdd}
            className="rounded-full bg-black/5 px-3 py-1 text-sm text-black/70 disabled:opacity-50"
          >
            Добавить другой
          </button>
        </div>
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

export default FavoriteBrandsStep;

