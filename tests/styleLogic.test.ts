import { describe, it, expect } from "vitest";
import { toggleStyle } from "../src/components/quiz/styleLogic";

describe("toggleStyle", () => {
  it("adds style if limit not reached", () => {
    const { next, limitHit } = toggleStyle([], "minimal");
    expect(next).toEqual(["minimal"]);
    expect(limitHit).toBe(false);
  });

  it("removes style if already selected", () => {
    const { next, limitHit } = toggleStyle(["minimal"], "minimal");
    expect(next).toEqual([]);
    expect(limitHit).toBe(false);
  });

  it("signals limit when adding beyond", () => {
    const { next, limitHit } = toggleStyle(["a", "b"], "c");
    expect(next).toEqual(["a", "b"]);
    expect(limitHit).toBe(true);
  });
});
