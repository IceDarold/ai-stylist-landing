import { describe, it, expect, vi } from "vitest";
import { GET as searchGET } from "../src/app/api/brands/search/route";
import { GET as popularGET } from "../src/app/api/brands/popular/route";

vi.mock("../src/lib/supabase-server", () => ({
  getAdminClient: () => ({
    rpc: (fn: string) => {
      if (fn === "search_brands" || fn === "get_popular_brands") {
        return Promise.resolve({
          data: [
            { id: "1", name: "Zara", tier: "mass", logo_url: "zara.png" },
          ],
          error: null,
        });
      }
      return Promise.resolve({ data: [], error: null });
    },
  }),
}));

describe("GET /api/brands/search", () => {
  it("returns results", async () => {
    const res = await searchGET(
      new Request("http://localhost/api/brands/search?q=zara")
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      items: [{ id: "1", name: "Zara", tier: "mass", logo_url: "zara.png" }],
    });
  });

  it("requires q", async () => {
    const res = await searchGET(
      new Request("http://localhost/api/brands/search?q=z")
    );
    expect(res.status).toBe(400);
  });
});

describe("GET /api/brands/popular", () => {
  it("returns popular brands", async () => {
    const res = await popularGET(
      new Request("http://localhost/api/brands/popular")
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      items: [{ id: "1", name: "Zara", tier: "mass", logo_url: "zara.png" }],
    });
  });
});
