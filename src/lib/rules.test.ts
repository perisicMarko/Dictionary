import { describe, expect, it } from "vitest";
import {
  GenerateSchema,
  LoginSchema,
  SchoolSignupSchema,
  SignupSchema,
} from "./rules";

describe("SignupSchema", () => {
  it("accepts valid signup payload", () => {
    const result = SignupSchema.safeParse({
      name: "Marko",
      lastName: "Petrovic",
      email: "marko@example.com",
      password: "Passw0rd!",
      confirmPassword: "Passw0rd!",
    });

    expect(result.success).toBe(true);
  });

  it("rejects name with non-letter characters", () => {
    const result = SignupSchema.safeParse({
      name: "Marko1",
      lastName: "Petrovic",
      email: "marko@example.com",
      password: "Passw0rd!",
      confirmPassword: "Passw0rd!",
    });

    expect(result.success).toBe(false);
  });

  it("rejects password mismatch", () => {
    const result = SignupSchema.safeParse({
      name: "Marko",
      lastName: "Petrovic",
      email: "marko@example.com",
      password: "Passw0rd!",
      confirmPassword: "Passw0rd?",
    });

    expect(result.success).toBe(false);
  });

  it("accepts password with minimum length of 5 when all constraints are met", () => {
    const result = SignupSchema.safeParse({
      name: "Marko",
      lastName: "Petrovic",
      email: "marko@example.com",
      password: "Aa1!a",
      confirmPassword: "Aa1!a",
    });

    expect(result.success).toBe(true);
  });

  it("rejects password that has no number", () => {
    const result = SignupSchema.safeParse({
      name: "Marko",
      lastName: "Petrovic",
      email: "marko@example.com",
      password: "Pass!word",
      confirmPassword: "Pass!word",
    });

    expect(result.success).toBe(false);
  });

  it("rejects password that has no letter", () => {
    const result = SignupSchema.safeParse({
      name: "Marko",
      lastName: "Petrovic",
      email: "marko@example.com",
      password: "12345!",
      confirmPassword: "12345!",
    });

    expect(result.success).toBe(false);
  });

  it("rejects password that has no special character", () => {
    const result = SignupSchema.safeParse({
      name: "Marko",
      lastName: "Petrovic",
      email: "marko@example.com",
      password: "Passw0rd",
      confirmPassword: "Passw0rd",
    });

    expect(result.success).toBe(false);
  });
});

describe("LoginSchema", () => {
  it("rejects invalid email", () => {
    const result = LoginSchema.safeParse({
      email: "not-an-email",
      password: "abc",
    });

    expect(result.success).toBe(false);
  });

  it("trims email and password before validation output", () => {
    const result = LoginSchema.safeParse({
      email: "  user@example.com  ",
      password: "  abc123  ",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("user@example.com");
      expect(result.data.password).toBe("abc123");
    }
  });
});

describe("SchoolSignupSchema", () => {
  it("rejects password without special character", () => {
    const result = SchoolSignupSchema.safeParse({
      name: "School",
      email: "school@example.com",
      password: "Passw0rd",
      confirmPassword: "Passw0rd",
    });

    expect(result.success).toBe(false);
  });
});

describe("GenerateSchema", () => {
  it("accepts valid email", () => {
    const result = GenerateSchema.safeParse({
      email: "student@example.com",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = GenerateSchema.safeParse({
      email: "student",
    });

    expect(result.success).toBe(false);
  });

  it("trims email before validation output", () => {
    const result = GenerateSchema.safeParse({
      email: "  student@example.com  ",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("student@example.com");
    }
  });
});
