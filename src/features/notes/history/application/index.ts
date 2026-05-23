import { readAuthenticatedUser, requireAuthenticatedUser } from "@/server/auth/userSession";
import { logOutUser } from "@/features/auth";
import { findAllNotesByUserId } from "../../infrastructure/repository";
import { deleteNoteById, resetNoteReviewFactorsById } from "../infrastructure/repository";
import { addDays } from "date-fns";

export async function getUsersHistoryNotes() {
  const user = await readAuthenticatedUser();
  if (!user) {
    await logOutUser();
    return { success: false };
  }

  const { userId } = user;
  const notes = (await findAllNotesByUserId(userId) as any[]);

  return {
    success: true,
    data: notes.filter((w) => {
      return w.is_learned == true;
    })
  };
}

export async function deleteNote(noteId: number) {
  const user = await requireAuthenticatedUser();
  if (!user) {
    await logOutUser();
    return { success: false };
  }

  await deleteNoteById(noteId);

  return { success: true };
}

export async function restoreNoteToRecallSystemById(noteId: number) {
  const user = await requireAuthenticatedUser();
  if (!user) {
    await logOutUser();
    return { success: false };
  }

  await resetNoteReviewFactorsById(noteId, 1, 0, 2.5, addDays(new Date(), 1));

  return { success: true };
}