// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import proxy from "./proxy";
import { decryptRefresh, decryptSession } from "./actions/manageSession";

vi.mock("./actions/manageSession", () => ({
  decryptRefresh: vi.fn(),
  decryptSession: vi.fn(),
}));

vi.mock("next/server", () => ({
  NextResponse: {
    redirect: (url: URL) => ({ type: "redirect", url: url.toString() }),
    next: () => ({ type: "next" }),
  },
}));

function createRequest(
  path: string,
  tokens?: { refreshToken?: string; sessionToken?: string },
) {
  const nextUrl = new URL(`http://localhost${path}`);
  return {
    nextUrl,
    cookies: {
      get: (name: string) => {
        if (name === "refreshToken" && tokens?.refreshToken) {
          return { value: tokens.refreshToken };
        }

        if (name === "sessionToken" && tokens?.sessionToken) {
          return { value: tokens.sessionToken };
        }

        return undefined;
      },
    },
  } as never;
}

describe("proxy route protection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(decryptRefresh).mockResolvedValue(undefined);
    vi.mocked(decryptSession).mockResolvedValue(undefined);
  });

  it("redirects protected dictionary route to / when refresh token is missing", async () => {
    const req = createRequest("/dictionary/recall");

    const res = await proxy(req);

    expect(res.type).toBe("redirect");
    expect(res.url).toBe("http://localhost/");
  });

  it("allows protected dictionary route with valid refresh token", async () => {
    vi.mocked(decryptRefresh).mockResolvedValue({ userId: 1 } as never);
    const req = createRequest("/dictionary/recall", { refreshToken: "refresh" });

    const res = await proxy(req);

    expect(res.type).toBe("next");
  });

  it("redirects invalid dictionary sub-route to /dictionary/inputWord", async () => {
    vi.mocked(decryptRefresh).mockResolvedValue({ userId: 1 } as never);
    const req = createRequest("/dictionary/unknown", { refreshToken: "refresh" });

    const res = await proxy(req);

    expect(res.type).toBe("redirect");
    expect(res.url).toBe("http://localhost/dictionary/inputWord");
  });

  it("redirects authenticated user away from public route to /dictionary/inputWord", async () => {
    vi.mocked(decryptRefresh).mockResolvedValue({ userId: 1 } as never);
    const req = createRequest("/", { refreshToken: "refresh" });

    const res = await proxy(req);

    expect(res.type).toBe("redirect");
    expect(res.url).toBe("http://localhost/dictionary/inputWord");
  });

  it("redirects school public route to platform when school session exists", async () => {
    vi.mocked(decryptSession).mockResolvedValue({ schoolId: 9 } as never);
    const req = createRequest("/school", { sessionToken: "session" });

    const res = await proxy(req);

    expect(res.type).toBe("redirect");
    expect(res.url).toBe("http://localhost/school/platform/students");
  });

  it("redirects school protected route to /school when session token is missing", async () => {
    const req = createRequest("/school/platform/students");

    const res = await proxy(req);

    expect(res.type).toBe("redirect");
    expect(res.url).toBe("http://localhost/school");
  });

  it("allows school protected route with valid session", async () => {
    vi.mocked(decryptSession).mockResolvedValue({ schoolId: 9 } as never);
    const req = createRequest("/school/platform/subscriptions", {
      sessionToken: "session",
    });

    const res = await proxy(req);

    expect(res.type).toBe("next");
  });

  it("passes through unrelated routes", async () => {
    const req = createRequest("/api/something");

    const res = await proxy(req);

    expect(res.type).toBe("next");
  });
});
