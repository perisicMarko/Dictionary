import { describe, expect, it } from "vitest";
import calc from "./spacedRepetition";

describe("spacedRepetition calc", () => {
  it("sets day=1 and increments repetitions for first successful recall", () => {
    const result = calc(5, 0, 0, 2.5);

    expect(result.days).toBe(1);
    expect(result.repetitions).toBe(1);
    expect(result.easeFactor).toBeCloseTo(2.6, 5);
  });

  it("sets day=6 for second successful recall", () => {
    const result = calc(4, 1, 1, 2.5);

    expect(result.days).toBe(6);
    expect(result.repetitions).toBe(2);
    expect(result.easeFactor).toBeCloseTo(2.5, 5);
  });

  it("uses previous interval * ease factor for later successful recalls", () => {
    const result = calc(3, 6, 2, 2.5);

    expect(result.days).toBe(15);
    expect(result.repetitions).toBe(3);
    expect(result.easeFactor).toBeCloseTo(2.36, 5);
  });

  it("resets repetitions and days for failed recall", () => {
    const result = calc(2, 8, 4, 2.1);

    expect(result.days).toBe(1);
    expect(result.repetitions).toBe(0);
    expect(result.easeFactor).toBeCloseTo(2.1, 5);
  });

  it("never allows ease factor below 1.3", () => {
    const result = calc(3, 1, 2, 1.0);

    expect(result.days).toBe(1);
    expect(result.repetitions).toBe(3);
    expect(result.easeFactor).toBe(1.3);
  });
});
