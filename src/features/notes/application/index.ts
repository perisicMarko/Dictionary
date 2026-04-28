'use server'
import { createUserNote, findAllNotesByUserId, findNoteById, updateNoteReviewFactors, updateNoteLearnedStatus, resetNoteReviewFactors, deleteNoteById, updateNoteUserText, findUserWordTexts } from '@/features/notes/infrastructure/repository';
import { TDBNoteEntry, TMeaning, TNoteApp, TWordApp } from '@/lib/types';
import { addDays, isBefore } from 'date-fns';
import calc from '@/features/notes/domain/spacedRepetition';
import { requireAuthenticatedUser } from '@/server/auth/session';
import { logOutUser } from '@/features/auth/application/userAuth';

function toAppNote(note: any): TNoteApp {
  const { status, ...rest } = note;
  return { ...rest, isLearned: status };
}

export async function getUsersWords() {
  const user = await requireAuthenticatedUser();
  if (!user) {
    await logOutUser();
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

  const { email, userId } = user;
  const status = await createUserNote(userId, word, audio, user_notes, generated_notes, wordId);

  return { success: true };
}

export async function getUsersNotes() {
  const user = await requireAuthenticatedUser();
  if (!user) {
    await logOutUser();
    return { success: false };
  }

  const { email, userId } = user;
  const notes = (await findAllNotesByUserId(userId) as any[]).map(toAppNote);
  
  return {
    success: true,
    data: notes.filter((w) => {
      const res = w.isLearned == false;
      return res;
    })};
}

export async function getUsersHistory() {
  const user = await requireAuthenticatedUser();
  if (!user) {
    await logOutUser();
    return { success: false };
  }

  const { email, userId } = user;

  const notes = (await findAllNotesByUserId(userId) as any[]).map(toAppNote);
  let data = undefined;

  return {
    success: true,
    data: notes.filter((w) => {
      const res = w.isLearned == true;
      return res;
    })};
}

export async function getRecallNotes() {
  const user = await requireAuthenticatedUser();
  if (!user) {
    await logOutUser();
    return { success: false };
  }

  const { email, userId } = user;
  const notes = (await findAllNotesByUserId(userId) as any[]).map(toAppNote);

  const currentDate = new Date();

  return {
    success: true,
    data: notes.filter((n) => {
      const res = n.isLearned === false && isBefore(n.review_date, currentDate);
      return res;
    })};
}

export async function updateReviewDate(quality: number, noteId: number) {
  const user = await requireAuthenticatedUser();
  if (!user) {
    await logOutUser();
    return { success: false };
  }

  const note = await findNoteById(noteId);
  if (!note)
    throw new Error('Note that should be graded does not exist in database.');
  const nextReviewValues = calc(quality, note.days, note.repetitions, note.ease_factor);

  note.days = nextReviewValues.days;
  note.repetitions = nextReviewValues.repetitions;
  note.ease_factor = nextReviewValues.easeFactor;
  note.review_date = addDays(new Date(), note.days);

  const ret = await updateNoteReviewFactors(note.id, note.days, note.repetitions, note.ease_factor, note.review_date);
  if (!ret)
    console.log('An error has occured while updating review date, check manageNotes/index.');

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

  const retVal = await updateNoteUserText(userNotes, noteId);
  if (!retVal) throw new Error('Note with noteId is missing in database check manageNotes and edit/[noteId]');

  return { success: true };
}

export async function getNoteById(noteId: number) {
  const note = await findNoteById(noteId) as any;

  return note ? toAppNote(note) : undefined;
}

export async function backToRecallSystem(noteId: number) {
  const user = await requireAuthenticatedUser();
  if (!user) {
    await logOutUser();
    return { success: false };
  }
  await resetNoteReviewFactors(noteId, 1, 0, 2.5, addDays(new Date(), 1));

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
