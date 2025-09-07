import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin";
import { AdminLoginForm } from "./AdminLoginForm";
import { ALL_SLOTS } from "@/config/image-slots";

export default function AdminPage() {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  const isAdmin = verifyAdminSession(token);

  if (!isAdmin) {
    return (
      <section className="container py-10">
        <AdminLoginForm />
      </section>
    );
  }

  return (
    <section className="container py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Админ-панель</h1>
        <form action="/api/admin/logout" method="post">
          <button className="button" formAction="/api/admin/logout" formMethod="post">Выйти</button>
        </form>
      </div>
      <p className="text-black/70">
        Админ-режим включён. На сайте поверх картинок появились кнопки Upload. 
        Можно загружать новые версии изображений прямо в интерфейсе.
      </p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Слоты изображений</h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-black/70">
          {ALL_SLOTS.map((s) => (
            <li key={s.id}>
              <span className="font-mono">{s.id}</span> — {s.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

