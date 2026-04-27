// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/getAccessToken/route";
import { cookies } from "next/headers";
import { logOutUser } from "@/features/auth/application/userAuth";
import { decryptRefresh, encryptAccess } from "@/server/auth/session";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/features/auth/application/userAuth", () => ({
  logOutUser: vi.fn(),
}));

vi.mock("@/server/auth/session", () => ({
  decryptRefresh: vi.fn(),
  encryptAccess: vi.fn(),
}));

vi.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({ body, init }),
  },
}));

function cookieStore(refreshToken?: string) {
  return {
    get: (name: string) =>
      name === "refreshToken" && refreshToken ? { value: refreshToken } : undefined,
  };
}

describe("POST /api/getAccessToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 and logs out when refresh token is missing", async () => {
    vi.mocked(cookies).mockResolvedValue(cookieStore() as never);

    const response = await POST();

    expect(logOutUser).toHaveBeenCalled();
    expect(response.body).toEqual({ status: 401 });
  });

  it("returns new access token and sessionExpiring=true when refresh expires soon", async () => {
    vi.mocked(cookies).mockResolvedValue(cookieStore("refresh") as never);
    vi.mocked(decryptRefresh).mockResolvedValue({
      email: "user@example.com",
      userId: 1,
      exp: Math.floor(Date.now() / 1000) + 60,
    } as never);
    vi.mocked(encryptAccess).mockResolvedValue("new-access-token" as never);

    const response = await POST();

    expect(response.init?.status).toBe(200);
    expect(response.body).toEqual({
      accessToken: "new-access-token",
      sessionExpiring: true,
    });
  });

  it("returns new access token and setExpiring=false when refresh is not expiring soon", async () => {
    vi.mocked(cookies).mockResolvedValue(cookieStore("refresh") as never);
    vi.mocked(decryptRefresh).mockResolvedValue({
      email: "user@example.com",
      userId: 1,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    } as never);
    vi.mocked(encryptAccess).mockResolvedValue("new-access-token" as never);

    const response = await POST();

    expect(response.init?.status).toBe(200);
    expect(response.body).toEqual({
      accessToken: "new-access-token",
      setExpiring: false,
    });
  });

  it("returns 401 when refresh token is present but invalid", async () => {
    vi.mocked(cookies).mockResolvedValue(cookieStore("refresh") as never);
    vi.mocked(decryptRefresh).mockResolvedValue(undefined);

    const response = await POST();

    expect(response.body).toEqual({ status: 401 });
  });
});
