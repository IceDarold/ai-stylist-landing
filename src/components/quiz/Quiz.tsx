"use client";

import { useEffect, useState, FormEvent } from "react";
import clsx from "clsx";

interface QuizProps {
  onClose: () => void;
}

type Goal = "office_casual" | "date" | "weekend" | "season_update";
type AgeBand = "18_24" | "25_34" | "35_44";

type StepId =
  | "goal_budget"
  | "photo_params"
  | "sizes_fit"
  | "style_color"
  | "shopping_limits"
  | "contact";

interface GoalBudgetState {
  goal: Goal;
  budget: number;
  city: string;
}

type PhotoParamsState =
  | { mode: "photo"; file?: File; no_face?: boolean }
  | { mode: "params"; height_cm?: number; weight_kg?: number; age_band?: AgeBand };

interface SizesState {
  top_size?: string;
  bottom_waist?: number;
  bottom_length?: number;
  shoe_ru?: number;
  fit_pref_top?: string;
  fit_pref_bottom?: string;
}

interface StyleState {
  style?: string[];
  color_dislike?: string[];
  brands_known?: string;
}

interface ShoppingState {
  marketplaces?: string[];
  avoid_items?: string[];
  footwear_pref?: string;
}

interface ContactState {
  type?: string;
  contact?: string;
  consent_personal_data?: boolean;
  consent_marketing?: boolean;
}

interface FormState {
  goal_budget?: GoalBudgetState;
  photo_params?: PhotoParamsState;
  sizes_fit?: SizesState;
  style_color?: StyleState;
  shopping_limits?: ShoppingState;
  contact?: ContactState;
}

type StepValueMap = {
  goal_budget: GoalBudgetState;
  photo_params: PhotoParamsState;
  sizes_fit: SizesState;
  style_color: StyleState;
  shopping_limits: ShoppingState;
  contact: ContactState;
};

const steps: { id: StepId; title: string; optional?: boolean }[] = [
  { id: "goal_budget", title: "Под что собираем капсулу?" },
  { id: "photo_params", title: "Фото или параметры" },
  { id: "sizes_fit", title: "Размеры и посадка" },
  { id: "style_color", title: "Стиль и цвета", optional: true },
  { id: "shopping_limits", title: "Где покупать?", optional: true },
  { id: "contact", title: "Куда прислать подборку?" },
];

export function Quiz({ onClose }: QuizProps) {
  const [step, setStep] = useState(0);
  const [quizId, setQuizId] = useState<string | null>(null);

  // aggregated state
  const [form, setForm] = useState<FormState>({});

  // init quiz id
  useEffect(() => {
    const existing = localStorage.getItem("quiz_id");
    if (existing) {
      setQuizId(existing);
    } else {
      fetch("/api/quiz/start", { method: "POST" })
        .then((r) => r.json())
        .then((d) => {
          if (d.quiz_id) {
            localStorage.setItem("quiz_id", d.quiz_id);
            setQuizId(d.quiz_id);
          }
        })
        .catch(() => {});
    }
  }, []);

  const submitStep = async (payload?: unknown) => {
    if (!quizId) return;
    try {
      await fetch("/api/quiz/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quiz_id: quizId, step_id: steps[step].id, payload }),
      });
    } catch {
      // ignore network errors for now
    }
  };

  const next = async () => {
    const stepId = steps[step].id;
    await submitStep(form[stepId as StepId]);
    if (step < steps.length - 1) setStep(step + 1);
    else await finish();
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const finish = async () => {
    if (!quizId) return;
    try {
      await fetch("/api/quiz/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quiz_id: quizId, ...form }),
      });
    } catch {
      // ignore
    }
    onClose();
  };

  const update = <K extends StepId>(stepId: K, data: StepValueMap[K]) => {
    setForm((f) => ({ ...f, [stepId]: { ...(f[stepId] as object | undefined), ...data } }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative h-full w-full overflow-y-auto bg-white md:h-[90vh] md:w-[420px] md:rounded-2xl">
        {/* Progress bar */}
        <div className="sticky top-0 flex items-center justify-between gap-2 border-b bg-white p-4">
          <button onClick={back} disabled={step === 0} className="text-sm text-blue-600 disabled:text-gray-300">
            Назад
          </button>
          <div className="text-sm font-medium">
            {step + 1}/{steps.length}
          </div>
          <button
            onClick={() => (steps[step].optional ? next() : onClose())}
            className="text-sm text-blue-600"
          >
            {steps[step].optional ? "Пропустить" : "Закрыть"}
          </button>
        </div>

        {/* Step content */}
        <div className="p-4 pb-24">
          {steps[step].id === "goal_budget" && (
            <StepGoalBudget value={form.goal_budget} onChange={(v) => update("goal_budget", v)} />
          )}
          {steps[step].id === "photo_params" && (
            <StepPhotoParams value={form.photo_params} onChange={(v) => update("photo_params", v)} />
          )}
          {steps[step].id === "sizes_fit" && (
            <StepSizes value={form.sizes_fit} onChange={(v) => update("sizes_fit", v)} />
          )}
          {steps[step].id === "style_color" && (
            <StepStyle value={form.style_color} onChange={(v) => update("style_color", v)} />
          )}
          {steps[step].id === "shopping_limits" && (
            <StepShopping value={form.shopping_limits} onChange={(v) => update("shopping_limits", v)} />
          )}
          {steps[step].id === "contact" && (
            <StepContact value={form.contact} onChange={(v) => update("contact", v)} />
          )}
        </div>

        {/* Nav buttons */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t bg-white p-4">
          <button onClick={back} disabled={step === 0} className="button" type="button">
            Назад
          </button>
          <button onClick={next} className="button primary" type="button">
            {step === steps.length - 1 ? "Получить 3 лука" : "Далее"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Step components ---

function StepGoalBudget({ value, onChange }: { value?: GoalBudgetState; onChange: (v: GoalBudgetState) => void }) {
  const { goal = "office_casual", budget = 25000, city = "" } = value || {};

  const handleChange = (e: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    onChange({
      goal: formData.get("goal") as Goal,
      budget: Number(formData.get("budget")),
      city: formData.get("city")?.toString() || "",
    });
  };

  return (
    <form onChange={handleChange} className="space-y-4" aria-label="Цель и бюджет">
      <div>
        <p className="mb-2 font-medium">Под что собираем капсулу?</p>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { key: "office_casual", label: "Работа" },
              { key: "date", label: "Свидание" },
              { key: "weekend", label: "Выходные" },
              { key: "season_update", label: "Сезон" },
            ] as { key: Goal; label: string }[]
          ).map((g) => (
            <label
              key={g.key}
              className={clsx(
                "cursor-pointer rounded border p-2 text-center",
                goal === g.key ? "border-blue-600" : "border-gray-300"
              )}
            >
              <input type="radio" name="goal" value={g.key} className="sr-only" defaultChecked={goal === g.key} />
              {g.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="budget" className="block font-medium">
          Бюджет
        </label>
        <input
          id="budget"
          name="budget"
          type="range"
          min={10000}
          max={60000}
          step={500}
          defaultValue={budget}
          className="w-full"
        />
        <div className="mt-1 text-sm">{budget.toLocaleString("ru-RU") + " ₽"}</div>
        <div className="mt-2 flex gap-2">
          {[15000, 25000, 35000].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange({ goal, budget: p, city })}
              className="rounded border px-2 py-1 text-sm"
            >
              {p.toLocaleString("ru-RU")}
            </button>
          ))}
          <button type="button" onClick={() => onChange({ goal, budget: 0, city })} className="rounded border px-2 py-1 text-sm">
            Без ограничений
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="city" className="block font-medium">
          Город (необязательно)
        </label>
        <input
          id="city"
          name="city"
          defaultValue={city}
          type="text"
          className="input w-full"
          placeholder="Например, Москва"
        />
      </div>
    </form>
  );
}

function StepPhotoParams({ value, onChange }: { value?: PhotoParamsState; onChange: (v: PhotoParamsState) => void }) {
  const { mode = "photo" } = value || ({} as PhotoParamsState);
  const tabs = [
    { key: "photo", label: "Фото" },
    { key: "params", label: "Без фото" },
  ] as const;

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onChange({ ...(value || {}), mode: t.key })}
            className={clsx(
              "flex-1 rounded border px-2 py-1", 
              mode === t.key ? "border-blue-600" : "border-gray-300"
            )}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </div>

      {mode === "photo" ? (
        (() => {
          const photoValue: Extract<PhotoParamsState, { mode: "photo" }> =
            value && value.mode === "photo" ? value : { mode: "photo" };
          return (
            <div className="space-y-4">
              <div>
                <label className="block font-medium" htmlFor="photo">
                  Загрузить фото
                </label>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    onChange({ ...photoValue, file: e.target.files?.[0] })
                  }
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked={photoValue.no_face ?? true}
                  onChange={(e) =>
                    onChange({ ...photoValue, no_face: e.target.checked })
                  }
                />
                Скрыть лицо
              </label>
            </div>
          );
        })()
      ) : (
        <form
          onChange={(e: FormEvent<HTMLFormElement>) => {
            const fd = new FormData(e.currentTarget);
            onChange({
              mode,
              height_cm: Number(fd.get("height_cm")),
              weight_kg: Number(fd.get("weight_kg")),
              age_band: fd.get("age_band") as AgeBand,
            });
          }}
          className="space-y-4"
          aria-label="Параметры"
        >
          <div>
            <label className="block" htmlFor="height_cm">
              Рост (см)
            </label>
            <input id="height_cm" name="height_cm" type="number" className="input w-full" min={150} max={210} />
          </div>
          <div>
            <label className="block" htmlFor="weight_kg">
              Вес (кг)
            </label>
            <input id="weight_kg" name="weight_kg" type="number" className="input w-full" min={45} max={160} />
          </div>
          <div>
            <label className="block mb-1">Возраст</label>
            <select name="age_band" className="input w-full">
              <option value="18_24">18-24</option>
              <option value="25_34">25-34</option>
              <option value="35_44">35-44</option>
            </select>
          </div>
        </form>
      )}
    </div>
  );
}

function StepSizes({ value, onChange }: { value?: SizesState; onChange: (v: SizesState) => void }) {
  return (
    <form
      onChange={(e: FormEvent<HTMLFormElement>) => {
        const fd = new FormData(e.currentTarget);
        onChange({
          top_size: fd.get("top_size")?.toString(),
          bottom_waist: fd.get("bottom_waist") ? Number(fd.get("bottom_waist")) : undefined,
          bottom_length: fd.get("bottom_length") ? Number(fd.get("bottom_length")) : undefined,
          shoe_ru: fd.get("shoe_ru") ? Number(fd.get("shoe_ru")) : undefined,
          fit_pref_top: fd.get("fit_pref_top")?.toString(),
          fit_pref_bottom: fd.get("fit_pref_bottom")?.toString(),
        });
      }}
      className="space-y-4"
    >
      <div>
        <label className="block" htmlFor="top_size">
          Размер верха
        </label>
        <select id="top_size" name="top_size" className="input w-full">
          <option value="">Не знаю</option>
          {Array.from({ length: 9 }).map((_, i) => {
            const val = 44 + i * 2;
            return (
              <option key={val} value={val} selected={value?.top_size == val.toString()}>
                {val}
              </option>
            );
          })}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block" htmlFor="bottom_waist">
            Талия (см)
          </label>
          <input id="bottom_waist" name="bottom_waist" type="number" className="input w-full" />
        </div>
        <div>
          <label className="block" htmlFor="bottom_length">
            Длина (см)
          </label>
          <input id="bottom_length" name="bottom_length" type="number" className="input w-full" />
        </div>
      </div>
      <div>
        <label className="block" htmlFor="shoe_ru">
          Обувь (RU)
        </label>
        <input id="shoe_ru" name="shoe_ru" type="number" className="input w-full" min={38} max={47} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block" htmlFor="fit_pref_top">
            Посадка верха
          </label>
          <select id="fit_pref_top" name="fit_pref_top" className="input w-full">
            <option value="any">Любая</option>
            <option value="slim">Приталенный</option>
            <option value="regular">Обычный</option>
            <option value="relaxed">Свободный</option>
          </select>
        </div>
        <div>
          <label className="block" htmlFor="fit_pref_bottom">
            Посадка низа
          </label>
          <select id="fit_pref_bottom" name="fit_pref_bottom" className="input w-full">
            <option value="any">Любая</option>
            <option value="tapered">Зауженные</option>
            <option value="straight">Прямые</option>
            <option value="relaxed">Свободные</option>
          </select>
        </div>
      </div>
    </form>
  );
}

function StepStyle({ value, onChange }: { value?: StyleState; onChange: (v: StyleState) => void }) {
  const styles = [
    { key: "minimal", label: "Minimal" },
    { key: "smart_casual", label: "Smart casual" },
    { key: "sport_casual", label: "Sport" },
    { key: "street_light", label: "Street" },
  ];
  const colors = [
    "black",
    "white",
    "blue",
    "beige",
    "green",
    "brown",
    "grey",
    "bright",
  ];
  const chosenStyles: string[] = value?.style || [];
  const chosenColors: string[] = value?.color_dislike || [];

  const toggle = (arr: string[], val: string, limit: number) => {
    let next = arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
    if (next.length > limit) next = next.slice(1);
    return next;
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 font-medium">Стиль (до 2)</p>
        <div className="grid grid-cols-2 gap-2">
          {styles.map((s) => (
            <label
              key={s.key}
              className={clsx(
                "cursor-pointer rounded border p-2 text-center",
                chosenStyles.includes(s.key) ? "border-blue-600" : "border-gray-300"
              )}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={chosenStyles.includes(s.key)}
                onChange={() => onChange({ ...value, style: toggle(chosenStyles, s.key, 2) })}
              />
              {s.label}
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 font-medium">Нелюбимые цвета (до 3)</p>
        <div className="grid grid-cols-3 gap-2">
          {colors.map((c) => (
            <label
              key={c}
              className={clsx(
                "cursor-pointer rounded border p-2 text-center text-sm",
                chosenColors.includes(c) ? "border-blue-600" : "border-gray-300"
              )}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={chosenColors.includes(c)}
                onChange={() => onChange({ ...value, color_dislike: toggle(chosenColors, c, 3) })}
              />
              {c}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block mb-1" htmlFor="brands_known">
          Любимые бренды (до 3)
        </label>
        <input
          id="brands_known"
          type="text"
          className="input w-full"
          defaultValue={value?.brands_known || ""}
          onChange={(e) => onChange({ ...value, brands_known: e.target.value })}
          placeholder="Например, Zara"
        />
      </div>
    </div>
  );
}

function StepShopping({ value, onChange }: { value?: ShoppingState; onChange: (v: ShoppingState) => void }) {
  const marketplaces = [
    { key: "wb", label: "Wildberries" },
    { key: "ozon", label: "Ozon" },
    { key: "ymarket", label: "Яндекс" },
    { key: "any", label: "Любой" },
  ];
  const avoid = ["leather", "wool", "logos", "shorts", "light_wash"];

  const toggle = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 font-medium">Маркетплейсы</p>
        <div className="flex flex-col gap-2">
          {marketplaces.map((m) => (
            <label key={m.key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={value?.marketplaces?.includes(m.key)}
                onChange={() =>
                  onChange({
                    ...value,
                    marketplaces: toggle(value?.marketplaces || [], m.key),
                  })
                }
              />
              {m.label}
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 font-medium">Избегать</p>
        <div className="flex flex-col gap-2">
          {avoid.map((a) => (
            <label key={a} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={value?.avoid_items?.includes(a)}
                onChange={() =>
                  onChange({
                    ...value,
                    avoid_items: toggle(value?.avoid_items || [], a),
                  })
                }
              />
              {a}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block mb-1" htmlFor="footwear_pref">
          Обувь
        </label>
        <select
          id="footwear_pref"
          className="input w-full"
          value={value?.footwear_pref || "any"}
          onChange={(e) => onChange({ ...value, footwear_pref: e.target.value })}
        >
          <option value="any">Любая</option>
          <option value="sneakers">Кроссовки</option>
          <option value="loafers">Лоферы</option>
        </select>
      </div>
    </div>
  );
}

function StepContact({ value, onChange }: { value?: ContactState; onChange: (v: ContactState) => void }) {
  const { type = "email", contact = "", consent_personal_data = false, consent_marketing = false } = value || {};
  return (
    <form
      onChange={(e: FormEvent<HTMLFormElement>) => {
        const fd = new FormData(e.currentTarget);
        onChange({
          type: fd.get("type")?.toString(),
          contact: fd.get("contact")?.toString() || "",
          consent_personal_data: fd.get("consent_personal_data") === "on",
          consent_marketing: fd.get("consent_marketing") === "on",
        });
      }}
      className="space-y-4"
      aria-label="Контакты"
    >
      <div className="flex gap-4">
        <label className="flex items-center gap-1">
          <input type="radio" name="type" value="phone_ru" defaultChecked={type === "phone_ru"} />
          Телефон
        </label>
        <label className="flex items-center gap-1">
          <input type="radio" name="type" value="email" defaultChecked={type === "email"} />
          Email
        </label>
      </div>
      <div>
        <input
          type={type === "email" ? "email" : "tel"}
          name="contact"
          className="input w-full"
          defaultValue={contact}
          placeholder={type === "email" ? "mail@example.com" : "+7 (___) ___-__-__"}
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="consent_personal_data"
          defaultChecked={consent_personal_data}
          required
        />
        Согласен на обработку ПДн
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="consent_marketing"
          defaultChecked={consent_marketing}
        />
        Получать новости
      </label>
    </form>
  );
}
