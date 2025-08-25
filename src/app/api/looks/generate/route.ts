import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ looks: [], refresh_left: 0 });
}
