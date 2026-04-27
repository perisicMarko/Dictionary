// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authenticateSignUp } from "@/features/auth/application/userAuth";
import { GetUserInfoByEmail, InsertUserInfo } from "@/features/auth/infrastructure/usersRepository";
import { GetSubscription } from "@/features/schools/infrastructure/repository";
import { generateVerificationMail } from "@/features/auth/application/sendVerificationEmail";

vi.mock("@/features/auth/infrastructure/usersRepository", () => ({
  GetUserInfoByEmail: vi.fn(),
  InsertUserInfo: vi.fn(),
}));

vi.mock("@/features/schools/infrastructure/repository", () => ({
  GetSubscription: vi.fn(),
}));

vi.mock("@/features/auth/application/sendVerificationEmail", () => ({
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
