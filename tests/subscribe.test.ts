import { describe, it, expect, vi } from "vitest";
import { POST } from "../src/app/api/subscribe/route";

vi.mock("../src/lib/supabase-server", () => ({
  getAdminClient: () => ({
    from: () => {
      return {
        upsert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: { id: "lead1" }, error: null }),
          }),
        }),
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

describe("POST /api/subscribe", () => {
  it("returns ok for valid email", async () => {
    const res = await POST(
      new Request("http://localhost/api/subscribe", {
        method: "POST",
        body: JSON.stringify({ email: "user@example.com", source: "test" }),
      })
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("rejects invalid email", async () => {
    const res = await POST(
      new Request("http://localhost/api/subscribe", {
        method: "POST",
        body: JSON.stringify({ email: "bad" }),
      })
    );
    expect(res.status).toBe(400);
  });
});
