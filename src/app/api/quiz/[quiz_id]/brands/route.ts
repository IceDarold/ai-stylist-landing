import { NextResponse } from "next/server";
import { getQuizBrands } from "@/lib/brands";

export async function GET(
  _req: Request,
  { params }: { params: { quiz_id: string } }
) {
  const state = getQuizBrands(params.quiz_id);
  return NextResponse.json(state);
}
