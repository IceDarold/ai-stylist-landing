import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    quiz_id: "q_" + Math.random().toString(36).slice(2),
    started_at: new Date().toISOString(),
    utm: {},
    ab: {},
  });
}
