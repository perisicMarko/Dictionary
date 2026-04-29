'use server'
import { createUserNote, findAllNotesByUserId, findNoteById, updateNoteReviewFactors, updateNoteLearnedStatus, resetNoteReviewFactorsById, deleteNoteById, updateNoteUserText } from '@/features/notes/infrastructure/repository';
import { TMeaning } from '@/shared/types';
import { addDays, isBefore } from 'date-fns';
import calc from '@/features/notes/domain/spacedRepetition';
import { readAuthenticatedUser, requireAuthenticatedUser } from '@/server/auth/userSession';
import { logOutUser } from '@/features/auth/application/userAuth';


export async function getUsersWords() {
  const user = await readAuthenticatedUser();
  if (!user) {
    return { success: false};
  }

  const { userId } = user;  
  const words = (await findAllNotesByUserId(userId) as any[]).map((e) => e.dictionary_words.word.word) as string[];

  return { success: true, data: words };
}

export async function saveNotes(word: string, audio: string, user_notes: string, generated_notes: TMeaning[], wordId: number) {
  const user = await requireAuthenticatedUser();
  if (!user) {
    await logOutUser();
    return { success: false };
  }

  const { userId } = user;
  await createUserNote(userId, word, audio, user_notes, generated_notes, wordId);

  return { success: true };
}

export async function getUsersNotes() {
  const user = await readAuthenticatedUser();
  if (!user) {
    return { success: false };
  }

  const { userId } = user;
  const notes = (await findAllNotesByUserId(userId) as any[]);

  return {
    success: true,
    data: notes.filter((w) => {
      const res = w.is_learned == false;
      return res;
    })};
}

export async function getUsersHistory() {
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
    })};
}

export async function getRecallNotes() {
  const user = await requireAuthenticatedUser();
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
    })};
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

export async function editNote(userNotes: string, noteId: number) {
  const user = await requireAuthenticatedUser();
  if (!user) {
    await logOutUser();
    return { success: false };
  }

  await updateNoteUserText(userNotes, noteId);

  return { success: true };
}

export async function getNoteById(noteId: number) {
  const res = await findNoteById(noteId) as any;

  return { success: true, data: res};
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

export async function deleteNote(noteId: number) {
  const user = await requireAuthenticatedUser();
  if (!user) {
    await logOutUser();
    return { success: false };
  }

  await deleteNoteById(noteId);

  return { success: true };
}
