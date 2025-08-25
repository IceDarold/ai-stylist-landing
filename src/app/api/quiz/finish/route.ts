import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ ok: true, user_id: "u_" + Math.random().toString(36).slice(2) });
}
