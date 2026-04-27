// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import bcrypt from "bcrypt";
import { authenticateLogIn } from "@/features/auth/application/userAuth";
import { GetUserInfoByEmail } from "@/features/auth/infrastructure/usersRepository";
import { encryptRefresh } from "@/server/auth/session";
import { cookies } from "next/headers";

vi.mock("@/features/auth/infrastructure/usersRepository", () => ({
  GetUserInfoByEmail: vi.fn(),
}));

vi.mock("@/server/auth/session", () => ({
  encryptRefresh: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

const LOGIN_STATUS = {
  SUCCESS: 0,
  UNVERIFIED: 1,
  WRONG_CREDENTIALS: 2,
};

function loginForm(email: string, password: string) {
  const formData = new FormData();
  formData.set("email", email);
  formData.set("password", password);
  return formData;
}

describe("authenticateLogIn integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns WRONG_CREDENTIALS for invalid form data", async () => {
    const result = await authenticateLogIn(undefined, loginForm("bad-email", "123"));

    expect(result?.status).toBe(LOGIN_STATUS.WRONG_CREDENTIALS);
    expect(result?.error?.message).toBe("Wrong email or password.");
    expect(vi.mocked(GetUserInfoByEmail)).not.toHaveBeenCalled();
  });

  it("returns WRONG_CREDENTIALS when user does not exist", async () => {
    vi.mocked(GetUserInfoByEmail).mockResolvedValue(undefined);

    const result = await authenticateLogIn(
      undefined,
      loginForm("user@example.com", "Passw0rd!"),
    );

    expect(result?.status).toBe(LOGIN_STATUS.WRONG_CREDENTIALS);
    expect(result?.error?.message).toBe("Wrong email or password.");
  });

  it("returns WRONG_CREDENTIALS when password is incorrect", async () => {
    const passwordHash = await bcrypt.hash("Passw0rd!", 10);
    vi.mocked(GetUserInfoByEmail).mockResolvedValue({
      id: 1,
      email: "user@example.com",
      password: passwordHash,
      email_verified: true,
    } as never);

    const result = await authenticateLogIn(
      undefined,
      loginForm("user@example.com", "WrongPass1!"),
    );

    expect(result?.status).toBe(LOGIN_STATUS.WRONG_CREDENTIALS);
    expect(result?.error?.message).toBe("Wrong email or password.");
  });

  it("returns UNVERIFIED for valid credentials when email is not verified", async () => {
    const passwordHash = await bcrypt.hash("Passw0rd!", 10);
    vi.mocked(GetUserInfoByEmail).mockResolvedValue({
      id: 1,
      email: "user@example.com",
      password: passwordHash,
      email_verified: false,
    } as never);

    const result = await authenticateLogIn(
      undefined,
      loginForm("user@example.com", "Passw0rd!"),
    );

    expect(result?.status).toBe(LOGIN_STATUS.UNVERIFIED);
    expect(result?.error).toBeUndefined();
  });

  it("returns SUCCESS and sets refreshToken cookie for verified user", async () => {
    const passwordHash = await bcrypt.hash("Passw0rd!", 10);
    const setCookie = vi.fn();

    vi.mocked(GetUserInfoByEmail).mockResolvedValue({
      id: 7,
      email: "user@example.com",
      password: passwordHash,
      email_verified: true,
    } as never);
    vi.mocked(encryptRefresh).mockResolvedValue("refresh-token" as never);
    vi.mocked(cookies).mockResolvedValue({
      set: setCookie,
    } as never);

    const result = await authenticateLogIn(
      undefined,
      loginForm("user@example.com", "Passw0rd!"),
    );

    expect(result?.status).toBe(LOGIN_STATUS.SUCCESS);
    expect(result?.error).toBeUndefined();
    expect(encryptRefresh).toHaveBeenCalledWith({
      email: "user@example.com",
      userId: 7,
    });
    expect(setCookie).toHaveBeenCalledWith(
      "refreshToken",
      "refresh-token",
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "lax",
      }),
    );
  });
});
