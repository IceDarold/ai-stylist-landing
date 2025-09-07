"use client";

import { useState } from "react";

export function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("password", password);
      const res = await fetch("/api/admin/login", { method: "POST", body: fd });
      if (!res.ok) {
        setError("Неверный пароль");
        return;
      }
      window.location.reload();
    } catch (e) {
      setError("Ошибка входа");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-4">
      <h1 className="text-2xl font-semibold">Вход в админку</h1>
      <input
        type="password"
        placeholder="Пароль админа"
        className="input w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button type="submit" className="button primary w-full" disabled={loading}>
        {loading ? "Входим…" : "Войти"}
      </button>
      <p className="text-sm text-black/60">
        После входа на сайте появятся кнопки Upload поверх изображений (видно только вам).
      </p>
    </form>
  );
}

