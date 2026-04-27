// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cookies } from "next/headers";
import { logOutUser } from "@/features/auth/application/userAuth";
import {
  saveNotes,
  getRecallNotes,
  updateReviewDate,
} from "@/features/notes/application";
import {
  createUserNote,
  findNoteById,
  findAllNotesWithDictionaryWord,
  updateNoteReviewFactors,
} from "@/features/notes/infrastructure/repository";
import {
  verifySession,
  decryptRefresh,
  decryptAccess,
  encryptAccess,
} from "@/server/auth/session";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/features/auth/application/userAuth", () => ({
  logOutUser: vi.fn(),
}));

vi.mock("@/features/notes/infrastructure/repository", () => ({
  createUserNote: vi.fn(),
  findAllNotesWithDictionaryWord: vi.fn(),
  findNoteById: vi.fn(),
  updateNoteReviewFactors: vi.fn(),
  updateNoteLearnedStatus: vi.fn(),
  resetNoteReviewFactors: vi.fn(),
  deleteNoteById: vi.fn(),
  updateNoteUserText: vi.fn(),
  findUserWordTexts: vi.fn(),
}));

const STATUS = {
  UNAUTHORIZED: 0,
  VALID_ACCESS: 1,
  ACCESS_NEEDED: 2,
};

vi.mock("@/server/auth/session", () => ({
  verifySession: vi.fn(),
  decryptRefresh: vi.fn(),
  decryptAccess: vi.fn(),
  encryptAccess: vi.fn(),
  STATUS,
}));

describe("manageNotes integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("saveNotes", () => {
    it("returns unauthorized response and logs out user", async () => {
      vi.mocked(verifySession).mockResolvedValue(STATUS.UNAUTHORIZED as never);

      const response = await saveNotes("word", "audio", "note", [], "access", 10);

      expect(logOutUser).toHaveBeenCalled();
      expect(response).toEqual({ success: false, accessToken: "", status: 401 });
    });

    it("uses refresh token flow when access token is needed", async () => {
      vi.mocked(verifySession).mockResolvedValue(STATUS.ACCESS_NEEDED as never);
      vi.mocked(cookies).mockResolvedValue({
        get: () => ({ value: "refresh-token" }),
      } as never);
      vi.mocked(decryptRefresh).mockResolvedValue({
        email: "user@example.com",
        userId: 5,
      } as never);
      vi.mocked(encryptAccess).mockResolvedValue("new-access-token" as never);
      vi.mocked(createUserNote).mockResolvedValue({ id: 1 } as never);

      const response = await saveNotes("word", "audio", "note", [], "expired", 2);

      expect(createUserNote).toHaveBeenCalledWith(5, "word", "audio", "note", [], 2);
      expect(response).toEqual({
        success: true,
        accessToken: "new-access-token",
        status: 201,
      });
    });

    it("saves note with valid access token", async () => {
      vi.mocked(verifySession).mockResolvedValue(STATUS.VALID_ACCESS as never);
      vi.mocked(decryptAccess).mockResolvedValue({ userId: 3 } as never);
      vi.mocked(createUserNote).mockResolvedValue({ id: 1 } as never);

      const response = await saveNotes("word", "audio", "note", [], "valid-token", 2);

      expect(createUserNote).toHaveBeenCalledWith(3, "word", "audio", "note", [], 2);
      expect(response).toEqual({
        success: true,
        accessToken: "valid-token",
        status: 200,
      });
    });
  });

  describe("getRecallNotes", () => {
    it("returns only due notes for current user", async () => {
      vi.mocked(decryptAccess).mockResolvedValue({ userId: 10 } as never);
      vi.mocked(findAllNotesWithDictionaryWord).mockResolvedValue([
        {
          id: 1,
          status: false,
          user_id: 10,
          review_date: new Date("2000-01-01T00:00:00.000Z"),
        },
        {
          id: 2,
          status: false,
          user_id: 10,
          review_date: new Date("2999-01-01T00:00:00.000Z"),
        },
        {
          id: 3,
          status: true,
          user_id: 10,
          review_date: new Date("2000-01-01T00:00:00.000Z"),
        },
        {
          id: 4,
          status: false,
          user_id: 9,
          review_date: new Date("2000-01-01T00:00:00.000Z"),
        },
      ] as never);

      const result = await getRecallNotes("valid-access");

      expect(result).toHaveLength(1);
      expect(result?.[0].id).toBe(1);
    });
  });

  describe("updateReviewDate", () => {
    it("returns unauthorized response and logs out user", async () => {
      vi.mocked(verifySession).mockResolvedValue(STATUS.UNAUTHORIZED as never);
      vi.mocked(findNoteById).mockResolvedValue({
        id: 1,
        days: 1,
        repetitions: 0,
        ease_factor: 2.5,
      } as never);

      const result = await updateReviewDate(5, 1, "expired-access");

      expect(logOutUser).toHaveBeenCalled();
      expect(result).toEqual({ success: false });
    });

    it("updates repetition factors for valid access token", async () => {
      vi.mocked(verifySession).mockResolvedValue(STATUS.VALID_ACCESS as never);
      vi.mocked(findNoteById).mockResolvedValue({
        id: 9,
        days: 1,
        repetitions: 1,
        ease_factor: 2.5,
      } as never);
      vi.mocked(updateNoteReviewFactors).mockResolvedValue({ id: 9 } as never);

      const result = await updateReviewDate(4, 9, "valid-access");

      expect(updateNoteReviewFactors).toHaveBeenCalledWith(
        9,
        6,
        2,
        2.5,
        expect.any(Date),
      );
      expect(result).toEqual({ success: true, status: 200 });
    });

    it("refreshes access token when ACCESS_NEEDED", async () => {
      vi.mocked(verifySession).mockResolvedValue(STATUS.ACCESS_NEEDED as never);
      vi.mocked(findNoteById).mockResolvedValue({
        id: 5,
        days: 1,
        repetitions: 1,
        ease_factor: 2.5,
      } as never);
      vi.mocked(cookies).mockResolvedValue({
        get: () => ({ value: "refresh-token" }),
      } as never);
      vi.mocked(decryptRefresh).mockResolvedValue({
        email: "user@example.com",
        userId: 5,
      } as never);
      vi.mocked(encryptAccess).mockResolvedValue("new-access-token" as never);
      vi.mocked(updateNoteReviewFactors).mockResolvedValue({ id: 5 } as never);

      const result = await updateReviewDate(4, 5, "expired-access");

      expect(result).toEqual({
        success: true,
        accessToken: "new-access-token",
        status: 201,
      });
    });
  });
});
