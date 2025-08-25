import { describe, it, expect } from "vitest";
import { validateFile } from "../src/components/quiz/PhotoStep";

function makeFile(type: string, size: number) {
  return new File([new ArrayBuffer(size)], "test", { type });
}

describe("validateFile", () => {
  it("rejects unsupported type", () => {
    const err = validateFile(makeFile("image/gif", 1000));
    expect(err).toBe("Неподдерживаемый формат файла");
  });

  it("rejects large file", () => {
    const err = validateFile(makeFile("image/jpeg", 16 * 1024 * 1024));
    expect(err).toBe("Файл слишком большой. До 15 МБ");
  });

  it("accepts valid file", () => {
    const err = validateFile(makeFile("image/png", 1024));
    expect(err).toBeNull();
  });
});
