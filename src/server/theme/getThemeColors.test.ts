// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import getThemeColors from "./getThemeColors";
import { cookies } from "next/headers";
import { decryptRefresh } from "@/server/auth/userSession";
import { decryptSession } from "@/server/auth/schoolSession";
import { getThemeColors } from "./repository";
import { findSchoolByEmail } from "@/features/schools/infrastructure/repository";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/server/auth/userSession", () => ({
  decryptRefresh: vi.fn(),
}));

vi.mock("@/server/auth/schoolSession", () => ({
  decryptSession: vi.fn(),
}));

vi.mock("./repository", () => ({
  getThemeColors: vi.fn(),
}));

vi.mock("@/features/schools/infrastructure/repository", () => ({
  findSchoolByEmail: vi.fn(),
}));

const DEFAULT_THEME = {
  main: "222 25% 8%",
  second: "222 30% 20%",
  text_main: "0 0% 96%",
  text_second: "210 15% 56%",
};

function cookieStore(refreshToken?: string) {
  return {
    get: (name: string) =>
      name === "refreshToken" && refreshToken ? { value: refreshToken } : undefined,
  };
}

describe("getThemeColors", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(cookies).mockResolvedValue(cookieStore() as never);
    vi.mocked(decryptSession).mockResolvedValue(undefined);
    vi.mocked(decryptRefresh).mockResolvedValue(undefined);
    vi.mocked(findSchoolByEmail).mockResolvedValue(undefined);
    vi.mocked(getThemeColors).mockResolvedValue(undefined);
  });

  it("returns default theme when no session and no refresh token", async () => {
    const theme = await getThemeColors();

    expect(theme).toEqual(DEFAULT_THEME);
  });

  it("returns school theme when school session exists", async () => {
    const schoolTheme = {
      main: "10 10% 10%",
      second: "20 20% 20%",
      text_main: "30 30% 30%",
      text_second: "40 40% 40%",
    };

    vi.mocked(decryptSession).mockResolvedValue({ email: "school@example.com" } as never);
    vi.mocked(findSchoolByEmail).mockResolvedValue({ colors: schoolTheme } as never);

    const theme = await getThemeColors();

    expect(theme).toEqual(schoolTheme);
  });

  it("returns default theme when refresh token payload is invalid", async () => {
    vi.mocked(cookies).mockResolvedValue(cookieStore("refresh") as never);
    vi.mocked(decryptRefresh).mockResolvedValue(undefined);

    const theme = await getThemeColors();

    expect(theme).toEqual(DEFAULT_THEME);
  });

  it("returns default theme when user has no school colors", async () => {
    vi.mocked(cookies).mockResolvedValue(cookieStore("refresh") as never);
    vi.mocked(decryptRefresh).mockResolvedValue({ userId: 1 } as never);
    vi.mocked(getThemeColors).mockResolvedValue({ schools: { colors: null } } as never);

    const theme = await getThemeColors();

    expect(theme).toEqual(DEFAULT_THEME);
  });

  it("returns user school theme from refresh token path", async () => {
    const userTheme = {
      main: "110 30% 11%",
      second: "120 25% 18%",
      text_main: "0 0% 98%",
      text_second: "210 20% 70%",
    };

    vi.mocked(cookies).mockResolvedValue(cookieStore("refresh") as never);
    vi.mocked(decryptRefresh).mockResolvedValue({ userId: 99 } as never);
    vi.mocked(getThemeColors).mockResolvedValue({ schools: { colors: userTheme } } as never);

    const theme = await getThemeColors();

    expect(theme).toEqual(userTheme);
  });
});
