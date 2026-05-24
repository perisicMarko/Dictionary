'use server';
import { readAuthenticatedUser, requireAuthenticatedUser } from "@/server/auth/userSession";
import { logOutUser } from "@/features/auth";
import { isBefore, addDays } from "date-fns";
import calc from "../domain/spacedRepetition";
import { findAllNotesByUserId, findNoteById, updateNoteLearnedStatus } from "../../infrastructure/repository";
import { updateNoteReviewFactors } from "../infrastructure/repository";


export async function getRecallNotes() {
  const user = await readAuthenticatedUser();
  if (!user) {
    await logOutUser();
    return { success: false };
  }

  const { userId } = user;
  const notes = (await findAllNotesByUserId(userId) as any[]);
  const currentDate = new Date();

  return {
    success: true,
    data: notes.filter((n) => {
      const res = n.is_learned === false && isBefore(n.review_date, currentDate);
      return res;
    })
  };
}

export async function updateReviewDateByNoteId(quality: number, noteId: number) {
  const user = await requireAuthenticatedUser();
  if (!user) {
    await logOutUser();
    return { success: false };
  }

  const note = await findNoteById(noteId) as any;

  const nextReviewValues = calc(quality, note.days, note.repetitions, note.ease_factor);

  note.days = nextReviewValues.days;
  note.repetitions = nextReviewValues.repetitions;
  note.ease_factor = nextReviewValues.easeFactor;
  note.review_date = addDays(new Date(), note.days);

  const ret = await updateNoteReviewFactors(note.id, note.days, note.repetitions, note.ease_factor, note.review_date);
  if (!ret)
    throw new Error('An error has occured while updating review date, check manageNotes/index.');

  return { success: true };
}

export async function setAsLearned(noteId: number, status: boolean) {
  const user = await requireAuthenticatedUser();
  if (!user) {
    await logOutUser();
    return { success: false };
  }

  await updateNoteLearnedStatus(noteId, status);

  return { success: true };
}
