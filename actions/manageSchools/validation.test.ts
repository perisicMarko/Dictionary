import { describe, expect, it } from "vitest";
import { addDays, addWeeks } from "date-fns";
import { validateActivationKeyExpirationDate } from "./validation";

describe("validateActivationKeyExpirationDate", () => {
  it("returns error when course duration is longer than 9 weeks", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    const tooFar = addDays(addWeeks(now, 9), 1);

    const error = validateActivationKeyExpirationDate(now, tooFar);

    expect(error).toBe(
      "Duration of the course is longer than the longest course in your school.",
    );
  });

  it("returns error when course end date is in the past", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    const past = new Date("2025-12-31T00:00:00.000Z");

    const error = validateActivationKeyExpirationDate(now, past);

    expect(error).toBe("The time you enetered is in the past.");
  });

  it("returns null for valid course end date", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    const valid = addWeeks(now, 4);

    const error = validateActivationKeyExpirationDate(now, valid);

    expect(error).toBeNull();
  });
});
