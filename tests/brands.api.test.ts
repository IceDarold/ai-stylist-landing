import { describe, it, expect } from "vitest";
import { GET as searchGet } from "../src/app/api/brands/search/route";
import { GET as popularGet } from "../src/app/api/brands/popular/route";
import { POST as saveBrandsPost } from "../src/app/api/quiz/brands/route";
import { GET as quizBrandsGet } from "../src/app/api/quiz/[quiz_id]/brands/route";
import { BRANDS } from "../src/data/brands";

const zaraId = BRANDS.find((b) => b.name === "Zara")!.id;
const cosId = BRANDS.find((b) => b.name === "COS")!.id;

describe("/api/brands/search", () => {
  it("finds Zara by typo and transliteration", async () => {
    const res = await searchGet(new Request("http://test/api/brands/search?q=zarra"));
    expect(res.status).toBe(200);
    const json: any = await res.json();
    expect(json.items[0].name).toBe("Zara");

    const res2 = await searchGet(new Request("http://test/api/brands/search?q=зара"));
    const json2: any = await res2.json();
    expect(json2.items[0].name).toBe("Zara");
  });

  it("handles RU to EN for COS", async () => {
    const res = await searchGet(new Request("http://test/api/brands/search?q=косс"));
    const json: any = await res.json();
    expect(json.items[0].name).toBe("COS");
  });

  it("respects tier filter", async () => {
    const res = await searchGet(new Request("http://test/api/brands/search?q=zara&tier=premium"));
    const json: any = await res.json();
    expect(json.items.length).toBe(0);
  });

  it("returns empty for junk", async () => {
    const res = await searchGet(new Request("http://test/api/brands/search?q=zzzqqq"));
    const json: any = await res.json();
    expect(json.items.length).toBe(0);
  });
});

describe("/api/brands/popular", () => {
  it("returns popular premium brands", async () => {
    const res = await popularGet(new Request("http://test/api/brands/popular?tier=premium&limit=1"));
    const json: any = await res.json();
    expect(json.items.length).toBe(1);
    expect(json.items[0].tier).toBe("premium");
  });
});

describe("quiz brand selection", () => {
  const quizId = "123e4567-e89b-12d3-a456-426614174000";

  it("saves and retrieves selection", async () => {
    const res = await saveBrandsPost(
      new Request("http://test/api/quiz/brands", {
        method: "POST",
        body: JSON.stringify({
          quiz_id: quizId,
          favorite_brand_ids: [zaraId, cosId],
          custom_brand_names: ["Local"],
          auto_pick_brands: false,
        }),
      })
    );
    expect(res.status).toBe(200);
    const saved: any = await res.json();
    expect(saved.saved.favorite_brand_ids).toHaveLength(2);

    const res2 = await quizBrandsGet(
      new Request(`http://test/api/quiz/${quizId}/brands`),
      { params: { quiz_id: quizId } }
    );
    expect(res2.status).toBe(200);
    const getJson: any = await res2.json();
    expect(getJson.favorite_brand_ids).toHaveLength(2);
    expect(getJson.custom_brand_names[0]).toBe("Local");
  });

  it("enforces limit", async () => {
    const res = await saveBrandsPost(
      new Request("http://test/api/quiz/brands", {
        method: "POST",
        body: JSON.stringify({
          quiz_id: quizId,
          favorite_brand_ids: [zaraId, cosId, zaraId],
          custom_brand_names: ["One", "Two"],
        }),
      })
    );
    expect(res.status).toBe(400);
  });

  it("handles auto pick", async () => {
    const res = await saveBrandsPost(
      new Request("http://test/api/quiz/brands", {
        method: "POST",
        body: JSON.stringify({ quiz_id: quizId, auto_pick_brands: true }),
      })
    );
    expect(res.status).toBe(200);
    const res2 = await quizBrandsGet(
      new Request(`http://test/api/quiz/${quizId}/brands`),
      { params: { quiz_id: quizId } }
    );
    const json: any = await res2.json();
    expect(json.auto_pick_brands).toBe(true);
    expect(json.favorite_brand_ids.length).toBe(0);
  });
});
