// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

type CookieStore = {
  get: (name: string) => { value: string } | undefined;
  set: () => void;
  delete: () => void;
};

function createCookieStore(tokens?: {
  refreshToken?: string;
  sessionToken?: string;
}): CookieStore {
  return {
    get: (name: string) => {
      if (name === "refreshToken" && tokens?.refreshToken) {
        return { value: tokens.refreshToken };
      }

      if (name === "sessionToken" && tokens?.sessionToken) {
        return { value: tokens.sessionToken };
      }

      return undefined;
    },
    set: () => undefined,
    delete: () => undefined,
  };
}

async function loadSessionModule() {
  const session = await import("./index");
  const { cookies } = await import("next/headers");
  return { session, cookiesMock: vi.mocked(cookies) };
}

describe("manageSession tokens", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env.ACCESS_SECRET = "test-access-secret";
    process.env.REFRESH_SECRET = "test-refresh-secret";
  });

  it("encrypts and decrypts access token", async () => {
    const { session, cookiesMock } = await loadSessionModule();
    cookiesMock.mockResolvedValue(createCookieStore() as never);

    const token = await session.encryptAccess({ email: "user@example.com", userId: 12 });
    const payload = await session.decryptAccess(token);

    expect(payload?.email).toBe("user@example.com");
    expect(payload?.userId).toBe(12);
    expect(typeof payload?.exp).toBe("number");
  });

  it("encrypts and decrypts refresh token", async () => {
    const { session, cookiesMock } = await loadSessionModule();
    cookiesMock.mockResolvedValue(createCookieStore() as never);

    const token = await session.encryptRefresh({ email: "user@example.com", userId: 7 });
    const payload = await session.decryptRefresh(token);

    expect(payload?.email).toBe("user@example.com");
    expect(payload?.userId).toBe(7);
    expect(typeof payload?.exp).toBe("number");
  });

  it("returns undefined for invalid access token", async () => {
    const { session, cookiesMock } = await loadSessionModule();
    cookiesMock.mockResolvedValue(createCookieStore() as never);

    const payload = await session.decryptAccess("invalid-token");

    expect(payload).toBeUndefined();
  });

  it("verifySession returns VALID_ACCESS for valid access token", async () => {
    const { session, cookiesMock } = await loadSessionModule();
    cookiesMock.mockResolvedValue(createCookieStore() as never);
    const access = await session.encryptAccess({ email: "user@example.com", userId: 1 });

    const status = await session.verifySession(access);

    expect(status).toBe(session.STATUS.VALID_ACCESS);
  });

  it("verifySession returns ACCESS_NEEDED when access is invalid but refresh exists", async () => {
    const { session, cookiesMock } = await loadSessionModule();
    const refresh = await session.encryptRefresh({ email: "user@example.com", userId: 1 });
    cookiesMock.mockResolvedValue(createCookieStore({ refreshToken: refresh }) as never);

    const status = await session.verifySession("invalid-access-token");

    expect(status).toBe(session.STATUS.ACCESS_NEEDED);
  });

  it("verifySession returns UNAUTHORIZED when neither token is valid", async () => {
    const { session, cookiesMock } = await loadSessionModule();
    cookiesMock.mockResolvedValue(createCookieStore() as never);

    const status = await session.verifySession("invalid-access-token");

    expect(status).toBe(session.STATUS.UNAUTHORIZED);
  });

  it("createSession stores sessionToken and decryptSession reads it", async () => {
    let sessionToken = "";
    const cookieStore = {
      get: (name: string) =>
        name === "sessionToken" && sessionToken ? { value: sessionToken } : undefined,
      set: (_name: string, value: string) => {
        sessionToken = value;
      },
      delete: () => undefined,
    };

    const { session, cookiesMock } = await loadSessionModule();
    cookiesMock.mockResolvedValue(cookieStore as never);

    await session.createSession("school@example.com", 3);
    const payload = await session.decryptSession();

    expect(sessionToken).not.toBe("");
    expect(payload?.email).toBe("school@example.com");
    expect(payload?.schoolId).toBe(3);
  });

  it("returns undefined for invalid refresh token", async () => {
    const { session, cookiesMock } = await loadSessionModule();
    cookiesMock.mockResolvedValue(createCookieStore() as never);

    const payload = await session.decryptRefresh("invalid-token");

    expect(payload).toBeUndefined();
  });

  it("decryptSession returns undefined when session cookie is missing", async () => {
    const { session, cookiesMock } = await loadSessionModule();
    cookiesMock.mockResolvedValue(createCookieStore() as never);

    const payload = await session.decryptSession();

    expect(payload).toBeUndefined();
  });

  it("decryptSession returns undefined for malformed session token", async () => {
    const { session, cookiesMock } = await loadSessionModule();
    cookiesMock.mockResolvedValue(
      createCookieStore({ sessionToken: "invalid-session-token" }) as never,
    );

    const payload = await session.decryptSession();

    expect(payload).toBeUndefined();
  });
});
