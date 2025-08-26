import Image from "next/image";
import { useEffect, useState } from "react";

export type Brand = { id: string; name: string; tier: "mass" | "premium" | "luxury"; logo_url?: string };

interface FavoriteBrandsStepProps {
  initialSelected?: Brand[];
  initialCustom?: string[];
  initialAutoPick?: boolean;
  onChange: (state: { selected: Brand[]; custom: string[]; autoPick: boolean }) => void;
}

export default function FavoriteBrandsStep({
  initialSelected = [],
  initialCustom = [],
  initialAutoPick = false,
  onChange,
}: FavoriteBrandsStepProps) {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Brand[]>(initialSelected);
  const [custom, setCustom] = useState<string[]>(initialCustom);
  const [autoPick, setAutoPick] = useState(initialAutoPick);
  const [tierTab, setTierTab] = useState<Brand["tier"]>("mass");
  const [popular, setPopular] = useState<Brand[]>([]);
  const [results, setResults] = useState<Brand[]>([]);
  const limit = 3;
  const totalSelected = selected.length + custom.length;
  const canAdd = totalSelected < limit && !autoPick;

  useEffect(() => {
    fetch(`/api/brands/popular?tier=${tierTab}`)
      .then((r) => r.json())
      .then((d) => setPopular(d.items || []))
      .catch(() => setPopular([]));
  }, [tierTab]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!q.trim()) return setResults([]);
      fetch(`/api/brands/search?q=${encodeURIComponent(q.trim())}`)
        .then((r) => r.json())
        .then((d) => setResults(d.items || []))
        .catch(() => setResults([]));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    onChange({ selected, custom, autoPick });
  }, [selected, custom, autoPick, onChange]);

  const add = (b: Brand) => {
    if (!canAdd) return;
    if (selected.find((x) => x.id === b.id)) return;
    setSelected((s) => [...s, b]);
    setQ("");
    setResults([]);
  };

  const remove = (id: string) => setSelected((s) => s.filter((x) => x.id !== id));
  const removeCustom = (idx: number) => setCustom((c) => c.filter((_, i) => i !== idx));

  const addCustom = () => {
    if (!canAdd) return;
    const name = prompt("Введите название бренда");
    if (!name) return;
    setCustom((c) => [...c, name]);
  };

  return (
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
                  <Image
                    src={b.logo_url}
                    alt=""
                    width={24}
                    height={24}
                    className="h-6 w-6 object-contain"
                  />
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
              <Image
                src={b.logo_url}
                alt=""
                width={16}
                height={16}
                className="h-4 w-4 object-contain"
              />
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
        {custom.map((name, idx) => (
          <span
            key={`c-${idx}`}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1"
          >
            <span className="text-sm">{name}</span>
            <button
              onClick={() => removeCustom(idx)}
              aria-label={`Убрать ${name}`}
              className="text-black/50 hover:text-black"
            >
              ×
            </button>
          </span>
        ))}
        {selected.length + custom.length === 0 && (
          <span className="text-sm text-black/50">Вы пока ничего не выбрали</span>
        )}
      </div>

      {/* Tabs + popular */}
      <div className="flex items-center gap-2 rounded-full bg-black/5 p-1 w-max">
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
                chosen ? "border-amber-400 bg-amber-50" : "border-black/10 bg-white hover:bg-black/5"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {b.logo_url ? (
                <Image
                  src={b.logo_url}
                  alt={b.name}
                  width={80}
                  height={32}
                  className="h-8 w-auto object-contain"
                />
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
      <div className="flex items-center gap-3">
        <button
          onClick={() => setAutoPick((v) => !v)}
          className={`rounded-full px-3 py-1 text-sm ${
            autoPick ? "bg-black/90 text-white" : "bg-black/5 text-black/70"
          }`}
        >
          Не знаю брендов — подобрать по стилю
        </button>

        <button
          onClick={addCustom}
          disabled={!canAdd}
          className="rounded-full bg-black/5 px-3 py-1 text-sm text-black/70 disabled:opacity-50"
        >
          Добавить другой
        </button>
      </div>
    </div>
  );
}

