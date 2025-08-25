import { describe, it, expect, vi } from "vitest";
import { POST } from "../src/app/api/quiz/route";

vi.mock("../src/lib/supabase-server", () => ({
  getAdminClient: () => ({
    from: (table: string) => {
      if (table === "leads") {
        return {
          upsert: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: { id: "lead1" }, error: null }),
            }),
          }),
          insert: () => Promise.resolve({ data: null, error: null }),
        };
      }
      return {
        upsert: () => Promise.resolve({ data: null, error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
      };
    },
  }),
}));

vi.mock("../src/lib/notify", () => ({ notifyTG: vi.fn() }));
vi.stubGlobal(
  "fetch",
  vi.fn(() => Promise.resolve({ ok: true, json: async () => ({}) }))
);

describe("POST /api/quiz", () => {
  it("handles quiz completion", async () => {
    const res = await POST(
      new Request("http://localhost/api/quiz", {
        method: "POST",
        body: JSON.stringify({
          sessionId: "123e4567-e89b-12d3-a456-426614174000",
          email: "user@example.com",
          answers: [{ key: "height", value: 170 }],
          complete: true,
        }),
      })
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("rejects invalid payload", async () => {
    const res = await POST(
      new Request("http://localhost/api/quiz", {
        method: "POST",
        body: JSON.stringify({}),
      })
    );
    expect(res.status).toBe(400);
  });
});
