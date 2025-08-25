"use client";

import { useEffect, useState } from "react";

interface Props {
  onClose: () => void;
}

const goals = [
  { value: "office_casual", label: "В офис" },
  { value: "date", label: "На свидание" },
  { value: "weekend", label: "На выходные" },
  { value: "season_update", label: "Обновить сезон" },
];

function genId() {
  return "q_" + Math.random().toString(36).slice(2);
}

export function QuizModal({ onClose }: Props) {
  const [step, setStep] = useState(0); // 0..5
  const [quizId, setQuizId] = useState<string | null>(null);

  const [data, setData] = useState<Record<string, unknown>>({});

  const totalSteps = 6;

  useEffect(() => {
    const existing = window.localStorage.getItem("quiz_id");
    if (existing) {
      setQuizId(existing);
    } else {
      fetch("/api/quiz/start", { method: "POST" })
        .then((r) => r.json())
        .then((res) => {
          setQuizId(res.quiz_id || genId());
          window.localStorage.setItem("quiz_id", res.quiz_id || genId());
        })
        .catch(() => {
          const id = genId();
          setQuizId(id);
          window.localStorage.setItem("quiz_id", id);
        });
    }
  }, []);

  const submitStep = async (payload: Record<string, unknown>) => {
    if (!quizId) return;
    await fetch("/api/quiz/step", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quiz_id: quizId, step_id: `step_${step + 1}`, payload }),
    }).catch(() => {});
  };

  const next = async () => {
    await submitStep(data);
    if (step === totalSteps - 1) return;
    setStep((s) => s + 1);
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  // Step components
  const Step1 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-medium">Под что собираем капсулу?</h3>
      <div className="grid grid-cols-2 gap-2">
        {goals.map((g) => (
          <label key={g.value} className="flex items-center gap-2">
            <input
              type="radio"
              name="goal"
              value={g.value}
              checked={data.goal === g.value}
              onChange={(e) => setData({ ...data, goal: e.target.value })}
            />
            {g.label}
          </label>
        ))}
      </div>
      <div>
        <label className="block mb-1">Бюджет</label>
        <input
          type="range"
          min={10000}
          max={60000}
          step={500}
          value={data.budget || 25000}
          onChange={(e) => setData({ ...data, budget: Number(e.target.value) })}
          className="w-full"
        />
        <div className="mt-1 text-sm text-black/70">
          {Intl.NumberFormat("ru-RU").format(data.budget || 25000)} ₽
        </div>
        <div className="flex gap-2 mt-2">
          {[15000, 25000, 35000].map((v) => (
            <button
              key={v}
              type="button"
              className="px-2 py-1 rounded border"
              onClick={() => setData({ ...data, budget: v })}
            >
              {Intl.NumberFormat("ru-RU").format(v)} ₽
            </button>
          ))}
          <button
            type="button"
            className="px-2 py-1 rounded border"
            onClick={() => setData({ ...data, budget: 0 })}
          >
            Без ограничений
          </button>
        </div>
      </div>
      <div>
        <label className="block mb-1" htmlFor="city">
          Город
        </label>
        <input
          id="city"
          type="text"
          value={data.city || ""}
          onChange={(e) => setData({ ...data, city: e.target.value })}
          className="input w-full"
        />
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-medium">Фото или параметры</h3>
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          className={`px-3 py-1 rounded border ${data.mode === "photo" ? "bg-black text-white" : ""}`}
          onClick={() => setData({ ...data, mode: "photo" })}
        >
          Фото
        </button>
        <button
          type="button"
          className={`px-3 py-1 rounded border ${data.mode === "params" ? "bg-black text-white" : ""}`}
          onClick={() => setData({ ...data, mode: "params" })}
        >
          Без фото
        </button>
      </div>
      {data.mode !== "params" && (
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setData({ ...data, photo: e.target.files?.[0] })}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.no_face ?? true}
              onChange={(e) => setData({ ...data, no_face: e.target.checked })}
            />
            Скрыть лицо
          </label>
        </div>
      )}
      {data.mode === "params" && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block mb-1">Рост (см)</label>
            <input
              type="number"
              min={150}
              max={210}
              value={data.height_cm || ""}
              onChange={(e) => setData({ ...data, height_cm: Number(e.target.value) })}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Вес (кг)</label>
            <input
              type="number"
              min={45}
              max={160}
              value={data.weight_kg || ""}
              onChange={(e) => setData({ ...data, weight_kg: Number(e.target.value) })}
              className="input w-full"
            />
          </div>
          <div className="col-span-2">
            <label className="block mb-1">Возраст</label>
            <select
              value={data.age_band || ""}
              onChange={(e) => setData({ ...data, age_band: e.target.value })}
              className="input w-full"
            >
              <option value="">—</option>
              <option value="18_24">18-24</option>
              <option value="25_34">25-34</option>
              <option value="35_44">35-44</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );

  const Step3 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-medium">Размеры и посадка</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block mb-1">Размер верха</label>
          <select
            value={data.top_size || ""}
            onChange={(e) => setData({ ...data, top_size: e.target.value })}
            className="input w-full"
          >
            <option value="">—</option>
            {Array.from({ length: 9 }, (_, i) => 44 + i * 2).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
            <option value="dont_know">Не знаю</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Обхват талии</label>
          <input
            type="number"
            value={data.bottom_waist || ""}
            onChange={(e) => setData({ ...data, bottom_waist: Number(e.target.value) })}
            className="input w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Длина штанов</label>
          <input
            type="number"
            value={data.bottom_length || ""}
            onChange={(e) => setData({ ...data, bottom_length: Number(e.target.value) })}
            className="input w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Размер обуви</label>
          <input
            type="number"
            min={38}
            max={47}
            value={data.shoe_ru || ""}
            onChange={(e) => setData({ ...data, shoe_ru: Number(e.target.value) })}
            className="input w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Посадка верха</label>
          <select
            value={data.fit_pref_top || ""}
            onChange={(e) => setData({ ...data, fit_pref_top: e.target.value })}
            className="input w-full"
          >
            <option value="">—</option>
            <option value="slim">Облегающий</option>
            <option value="regular">Стандарт</option>
            <option value="relaxed">Свободный</option>
            <option value="any">Любой</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Посадка низа</label>
          <select
            value={data.fit_pref_bottom || ""}
            onChange={(e) => setData({ ...data, fit_pref_bottom: e.target.value })}
            className="input w-full"
          >
            <option value="">—</option>
            <option value="tapered">Зауженные</option>
            <option value="straight">Прямые</option>
            <option value="relaxed">Свободные</option>
            <option value="any">Любые</option>
          </select>
        </div>
      </div>
    </div>
  );

  const Step4 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-medium">Стиль и цвета</h3>
      <div>
        <label className="block mb-1">Стиль (до 2)</label>
        <div className="flex flex-wrap gap-2">
          {[
            "minimal",
            "smart_casual",
            "sport_casual",
            "street_light",
          ].map((s) => (
            <button
              key={s}
              type="button"
              className={`px-2 py-1 rounded border ${data.style?.includes(s) ? "bg-black text-white" : ""}`}
              onClick={() => {
                const set = new Set(data.style || []);
                if (set.has(s)) set.delete(s);
                else if (set.size < 2) set.add(s);
                setData({ ...data, style: Array.from(set) });
              }}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block mb-1">Нелюбимые цвета (до 3)</label>
        <div className="flex flex-wrap gap-2">
          {[
            "black",
            "white",
            "blue",
            "beige",
            "green",
            "brown",
            "grey",
            "bright",
          ].map((c) => (
            <button
              key={c}
              type="button"
              className={`px-2 py-1 rounded border ${data.color_dislike?.includes(c) ? "bg-black text-white" : ""}`}
              onClick={() => {
                const set = new Set(data.color_dislike || []);
                if (set.has(c)) set.delete(c);
                else if (set.size < 3) set.add(c);
                setData({ ...data, color_dislike: Array.from(set) });
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block mb-1">Известные бренды</label>
        <input
          type="text"
          value={data.brands_known || ""}
          onChange={(e) => setData({ ...data, brands_known: e.target.value })}
          className="input w-full"
        />
      </div>
    </div>
  );

  const Step5 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-medium">Где покупать?</h3>
      <div>
        <label className="block mb-1">Маркетплейсы</label>
        <div className="flex flex-wrap gap-2">
          {["wb", "ozon", "ymarket", "any"].map((m) => (
            <button
              key={m}
              type="button"
              className={`px-2 py-1 rounded border ${data.marketplaces?.includes(m) ? "bg-black text-white" : ""}`}
              onClick={() => {
                const set = new Set(data.marketplaces || []);
                if (set.has(m)) set.delete(m);
                else set.add(m);
                setData({ ...data, marketplaces: Array.from(set) });
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block mb-1">Исключить</label>
        <div className="flex flex-wrap gap-2">
          {[
            "leather",
            "wool",
            "logos",
            "shorts",
            "light_wash",
          ].map((m) => (
            <button
              key={m}
              type="button"
              className={`px-2 py-1 rounded border ${data.avoid_items?.includes(m) ? "bg-black text-white" : ""}`}
              onClick={() => {
                const set = new Set(data.avoid_items || []);
                if (set.has(m)) set.delete(m);
                else set.add(m);
                setData({ ...data, avoid_items: Array.from(set) });
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block mb-1">Обувь</label>
        <select
          value={data.footwear_pref || ""}
          onChange={(e) => setData({ ...data, footwear_pref: e.target.value })}
          className="input w-full"
        >
          <option value="">—</option>
          <option value="sneakers">Кроссовки</option>
          <option value="loafers">Лоферы</option>
          <option value="any">Любая</option>
        </select>
      </div>
    </div>
  );

  const Step6 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-medium">Куда прислать подборку?</h3>
      <div>
        <label className="block mb-1">Телефон или email</label>
        <input
          type="text"
          value={data.contact || ""}
          onChange={(e) => setData({ ...data, contact: e.target.value })}
          className="input w-full"
        />
      </div>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={data.consent_personal_data || false}
          onChange={(e) => setData({ ...data, consent_personal_data: e.target.checked })}
        />
        Согласен на обработку ПДн
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={data.consent_marketing || false}
          onChange={(e) => setData({ ...data, consent_marketing: e.target.checked })}
        />
        Получать новости и акции
      </label>
    </div>
  );

  const stepsUI = [Step1, Step2, Step3, Step4, Step5, Step6];

  const onFinish = async () => {
    if (!quizId) return;
    await fetch("/api/quiz/finish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quiz_id: quizId, ...data }),
    }).catch(() => {});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-lg max-h-[95vh] overflow-y-auto rounded-lg bg-white p-6">
        <div className="sticky top-0 mb-4 flex items-center justify-between bg-white pb-2">
          <div className="text-sm">Шаг {step + 1} / {totalSteps}</div>
          <button aria-label="Закрыть" onClick={onClose}>
            ✕
          </button>
        </div>
        {stepsUI[step]()}        
        <div className="mt-6 flex justify-between">
          <button disabled={step===0} onClick={back} className="button">Назад</button>
          {step < totalSteps - 1 ? (
            <button onClick={next} className="button primary">Далее</button>
          ) : (
            <button onClick={onFinish} className="button primary">Получить 3 лука</button>
          )}
        </div>
      </div>
    </div>
  );
}

