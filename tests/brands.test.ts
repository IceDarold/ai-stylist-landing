import { describe, it, expect } from "vitest";
import { GET as searchGET } from "../src/app/api/brands/search/route";
import { GET as popularGET } from "../src/app/api/brands/popular/route";
import { POST as quizPost } from "../src/app/api/quiz/brands/route";
import { GET as quizGet } from "../src/app/api/quiz/[quiz_id]/brands/route";

const zaraId = "00000000-0000-0000-0000-000000000001";
const cosId = "00000000-0000-0000-0000-000000000002";

describe("brands api", () => {
  it("search handles typos and transliteration", async () => {
    let res = await searchGET(new Request("http://localhost/api/brands/search?q=zarra"));
    let data = await res.json();
    expect(res.status).toBe(200);
    expect(data.items[0].name).toBe("Zara");

    res = await searchGET(new Request("http://localhost/api/brands/search?q=зара"));
    data = await res.json();
    expect(data.items[0].name).toBe("Zara");

    res = await searchGET(new Request("http://localhost/api/brands/search?q=косс"));
    data = await res.json();
    expect(data.items[0].name).toBe("COS");
  });

  it("popular respects tier filter", async () => {
    const res = await popularGET(
      new Request("http://localhost/api/brands/popular?tier=premium")
    );
    const data = (await res.json()) as { items: { tier: string }[] };
    expect(res.status).toBe(200);
    expect(data.items.length).toBeGreaterThan(0);
    expect(data.items.every((b) => b.tier === "premium")).toBe(true);
  });

  it("saves and retrieves quiz selection", async () => {
    const saveRes = await quizPost(
      new Request("http://localhost/api/quiz/brands", {
        method: "POST",
        body: JSON.stringify({
          quiz_id: "quiz1",
          favorite_brand_ids: [zaraId, cosId],
          custom_brand_names: ["Local Atelier"],
          auto_pick_brands: false,
        }),
      })
    );
    expect(saveRes.status).toBe(200);
    const saveData = await saveRes.json();
    expect(saveData.saved.favorite_brand_ids).toEqual([zaraId, cosId]);
    expect(saveData.saved.custom_brand_names).toEqual(["Local Atelier"]);

    const getRes = await quizGet(new Request("http://localhost/api/quiz/quiz1/brands"), {
      params: { quiz_id: "quiz1" },
    });
    const getData = await getRes.json();
    expect(getData.favorite_brand_ids).toEqual([zaraId, cosId]);
    expect(getData.custom_brand_names).toEqual(["Local Atelier"]);
  });

  it("enforces total limit", async () => {
    const res = await quizPost(
      new Request("http://localhost/api/quiz/brands", {
        method: "POST",
        body: JSON.stringify({
          quiz_id: "quiz2",
          favorite_brand_ids: [zaraId, cosId, "00000000-0000-0000-0000-000000000003"],
          custom_brand_names: ["Extra"],
        }),
      })
    );
    expect(res.status).toBe(400);
  });
});
