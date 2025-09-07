import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_MODE_COOKIE,
  ADMIN_SESSION_COOKIE,
  createAdminSession,
} from "@/lib/admin";

export async function POST(req: Request) {
  const form = await req.formData();
  const password = String(form.get("password") || "");
  const expected = process.env.ADMIN_PASSWORD || "";

  if (!expected) {
    return new NextResponse("ADMIN_PASSWORD is not set", { status: 500 });
  }

  if (password !== expected) {
    return new NextResponse("Invalid password", { status: 401 });
  }

  const token = createAdminSession();
  const res = NextResponse.json({ ok: true });

  // httpOnly cookie for auth
  const isProd = process.env.NODE_ENV === "production";

  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  // non-httpOnly flag just to show UI overlay
  res.cookies.set(ADMIN_MODE_COOKIE, "1", {
    httpOnly: false,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
