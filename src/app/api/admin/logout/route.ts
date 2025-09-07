import { NextResponse } from "next/server";
import { ADMIN_MODE_COOKIE, ADMIN_SESSION_COOKIE } from "@/lib/admin";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set(ADMIN_MODE_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}

