import { describe, it, expect, vi } from "vitest";
import { POST } from "../src/app/api/quiz/brands/route";
import { GET } from "../src/app/api/quiz/[quizId]/brands/route";

const mockFrom = (table: string) => {
  if (table === "brands") {
    return {
      select: () => ({
        in: () => ({
          eq: () =>
            Promise.resolve({
              data: [{ id: "11111111-1111-1111-1111-111111111111" }],
              error: null,
            }),
        }),
      }),
    };
  }
  if (table === "quiz_brand_selection") {
    return {
      delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
      insert: () => Promise.resolve({ error: null }),
      select: () => ({
        eq: () => ({
          order: () =>
            Promise.resolve({
              data: [
                {
                  brand_id: "11111111-1111-1111-1111-111111111111",
                  order_index: 0,
                },
              ],
              error: null,
            }),
        }),
      }),
    };
  }
  if (table === "quiz_custom_brands") {
    return {
      delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
      insert: () => Promise.resolve({ error: null }),
      select: () => ({ eq: () => Promise.resolve({ data: [{ name: "Local" }], error: null }) }),
    };
  }
  if (table === "quiz_brand_flags") {
    return {
      upsert: () => Promise.resolve({ error: null }),
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: { auto_pick: false }, error: null }),
        }),
      }),
    };
  }
  return {} as unknown;
};

vi.mock("../src/lib/supabase-server", () => ({
  getAdminClient: () => ({
    from: mockFrom,
  }),
}));

describe("POST /api/quiz/brands", () => {
  it("saves selection", async () => {
    const res = await POST(
      new Request("http://localhost/api/quiz/brands", {
        method: "POST",
        body: JSON.stringify({
          quiz_id: "123e4567-e89b-12d3-a456-426614174000",
          favorite_brand_ids: ["11111111-1111-1111-1111-111111111111"],
          custom_brand_names: ["Local"],
          auto_pick_brands: false,
        }),
      })
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      saved: {
        favorite_brand_ids: ["11111111-1111-1111-1111-111111111111"],
        custom_brand_names: ["Local"],
        auto_pick_brands: false,
      },
    });
  });

  it("rejects over limit", async () => {
    const res = await POST(
      new Request("http://localhost/api/quiz/brands", {
        method: "POST",
        body: JSON.stringify({
          quiz_id: "123e4567-e89b-12d3-a456-426614174000",
          favorite_brand_ids: [
            "11111111-1111-1111-1111-111111111111",
            "22222222-2222-2222-2222-222222222222",
            "33333333-3333-3333-3333-333333333333",
            "44444444-4444-4444-4444-444444444444",
          ],
        }),
      })
    );
    expect(res.status).toBe(400);
  });
});

describe("GET /api/quiz/:id/brands", () => {
  it("returns selection", async () => {
    const res = await GET(
      new Request(
        "http://localhost/api/quiz/123e4567-e89b-12d3-a456-426614174000/brands"
      ),
      { params: { quizId: "123e4567-e89b-12d3-a456-426614174000" } }
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      favorite_brand_ids: ["11111111-1111-1111-1111-111111111111"],
      custom_brand_names: ["Local"],
      auto_pick_brands: false,
    });
  });
});
