import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type Brand = { id: string; name: string; logo_url?: string; tier?: "mass" | "premium" | "luxury" | null };

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
  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState<Brand[]>(initialSelected);
  const [custom, setCustom] = useState<string[]>(initialCustom);
  const [autoPick, setAutoPick] = useState(initialAutoPick);
  const [popular, setPopular] = useState<Brand[]>([]);
  const [results, setResults] = useState<Brand[]>([]);
  const listRef = useRef<HTMLUListElement>(null);
  const limit = 3;
  const totalSelected = selected.length + custom.length;
  const canAdd = totalSelected < limit && !autoPick;

  useEffect(() => {
    fetch(`/api/brands/popular`)
      .then((r) => r.json())
      .then(setPopular)
      .catch(() => setPopular([]));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!q.trim()) {
        setResults([]);
        return;
      }
      fetch(`/api/brands/search?q=${encodeURIComponent(q.trim())}`)
        .then((r) => r.json())
        .then(setResults)
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

  const addCustomFromQuery = () => {
    if (!canAdd) return;
    const name = q.trim();
    if (!name) return;
    setCustom((c) => [...c, name]);
    setQ("");
    setResults([]);
  };

  const showDropdown = focused && canAdd && ((q.trim() && results.length >= 0) || (!q.trim() && popular.length > 0));
  const dropdownItems: Brand[] = q.trim() ? results : popular;

  return (
    <div className="space-y-5">
      {/* Combobox */}
      <div className="relative">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            // delay to allow click on dropdown
            setTimeout(() => setFocused(false), 150);
          }}
          placeholder={autoPick ? "Автовыбор включён" : "Начните вводить: Zara, COS…"}
          disabled={!canAdd}
          aria-disabled={!canAdd}
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none disabled:bg-black/5"
        />

        {showDropdown && (
          <ul
            ref={listRef}
            role="listbox"
            className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg max-h-72 overflow-y-auto"
          >
            {(dropdownItems || []).map((b) => (
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
              </li>
            ))}

            {/* Offer to add custom when no results */}
            {q.trim() && results.length === 0 && (
              <li
                role="option"
                onClick={addCustomFromQuery}
                className="cursor-pointer px-4 py-2 text-sm text-black/70 hover:bg-black/5"
              >
                Добавить «{q.trim()}»
              </li>
            )}
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

      {/* Popular grid (random) */}
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
      </div>
    </div>
  );
}

