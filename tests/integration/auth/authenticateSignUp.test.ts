// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authenticateSignUp } from "@/actions/auth/user";
import { GetUserInfoByEmail, InsertUserInfo } from "@/actions/manageUsers/db";
import { GetSubscription } from "@/actions/manageSchools/db";
import { generateVerificationMail } from "@/actions/auth/user/sendVerificationEmail";

vi.mock("@/actions/manageUsers/db", () => ({
  GetUserInfoByEmail: vi.fn(),
  InsertUserInfo: vi.fn(),
}));

vi.mock("@/actions/manageSchools/db", () => ({
  GetSubscription: vi.fn(),
}));

vi.mock("@/actions/auth/user/sendVerificationEmail", () => ({
  __esModule: true,
  default: vi.fn(),
  generateVerificationMail: vi.fn(),
}));

function signUpForm(overrides?: Partial<Record<string, string>>) {
  const defaults = {
    name: "Marko",
    lastName: "Petrovic",
    email: "marko@example.com",
    password: "Passw0rd!",
    confirmPassword: "Passw0rd!",
  };
  const values = { ...defaults, ...overrides };

  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => formData.set(key, value));
  return formData;
}

describe("authenticateSignUp integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns validation errors for invalid payload", async () => {
    const result = await authenticateSignUp(
      undefined,
      signUpForm({ email: "bad", password: "123", confirmPassword: "123" }),
    );

    expect(result?.success).toBe(false);
    expect(result?.errors).toBeTruthy();
    expect(vi.mocked(GetUserInfoByEmail)).not.toHaveBeenCalled();
  });

  it("returns email already used when user exists", async () => {
    vi.mocked(GetUserInfoByEmail).mockResolvedValue({ id: 1 } as never);

    const result = await authenticateSignUp(undefined, signUpForm());

    expect(result?.success).toBe(false);
    expect(result?.error).toBe("Email already used.");
  });

  it("creates user with school subscription id when subscription exists", async () => {
    vi.mocked(GetUserInfoByEmail).mockResolvedValue(undefined);
    vi.mocked(GetSubscription).mockResolvedValue({ school_id: 5 } as never);
    vi.mocked(InsertUserInfo).mockResolvedValue({ id: 10 } as never);
    vi.mocked(generateVerificationMail).mockResolvedValue(true);

    const result = await authenticateSignUp(undefined, signUpForm());

    expect(result?.success).toBe(true);
    expect(InsertUserInfo).toHaveBeenCalledWith(
      "Marko",
      "Petrovic",
      "marko@example.com",
      expect.any(String),
      5,
    );
    expect(generateVerificationMail).toHaveBeenCalledWith("marko@example.com");
  });

  it("falls back to school_id=1 when subscription is missing", async () => {
    vi.mocked(GetUserInfoByEmail).mockResolvedValue(undefined);
    vi.mocked(GetSubscription).mockResolvedValue(undefined);
    vi.mocked(InsertUserInfo).mockResolvedValue({ id: 10 } as never);
    vi.mocked(generateVerificationMail).mockResolvedValue(true);

    const result = await authenticateSignUp(undefined, signUpForm());

    expect(result?.success).toBe(true);
    expect(InsertUserInfo).toHaveBeenCalledWith(
      "Marko",
      "Petrovic",
      "marko@example.com",
      expect.any(String),
      1,
    );
  });
});
