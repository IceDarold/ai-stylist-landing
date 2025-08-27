import { describe, it, expect } from "vitest";
import { GET as search } from "../src/app/api/brands/search/route";
import { POST as saveBrands } from "../src/app/api/quiz/brands/route";
import { GET as getBrands } from "../src/app/api/quiz/[quizId]/brands/route";

const ZARA_ID = "00000000-0000-0000-0000-000000000001";
const COS_ID = "00000000-0000-0000-0000-000000000002";

describe("Brand search", () => {
  it("finds by transliteration and alias", async () => {
    let res = await search(
      new Request("http://localhost/api/brands/search?q=zarra&region=ru")
    );
    expect(res.status).toBe(200);
    let json = await res.json();
    expect(json.items[0].name).toBe("Zara");

    res = await search(
      new Request("http://localhost/api/brands/search?q=косс&region=ru")
    );
    json = await res.json();
    expect(json.items[0].name).toBe("COS");
  });
});

describe("Quiz brand selection", () => {
  it("validates limit and retrieves selection", async () => {
    const quiz_id = "123e4567-e89b-12d3-a456-426614174001";
    let res = await saveBrands(
      new Request("http://localhost/api/quiz/brands", {
        method: "POST",
        body: JSON.stringify({
          quiz_id,
          favorite_brand_ids: [ZARA_ID, COS_ID],
          custom_brand_names: ["BrandX", "BrandY"],
        }),
      })
    );
    expect(res.status).toBe(400);

    res = await saveBrands(
      new Request("http://localhost/api/quiz/brands", {
        method: "POST",
        body: JSON.stringify({
          quiz_id,
          favorite_brand_ids: [ZARA_ID],
          custom_brand_names: ["Local Atelier"],
        }),
      })
    );
    expect(res.status).toBe(200);

    const getRes = await getBrands(
      new Request(`http://localhost/api/quiz/${quiz_id}/brands`),
      { params: { quizId: quiz_id } }
    );
    const saved = await getRes.json();
    expect(saved.favorite_brand_ids).toEqual([ZARA_ID]);
    expect(saved.custom_brand_names).toEqual(["Local Atelier"]);
  });
});
