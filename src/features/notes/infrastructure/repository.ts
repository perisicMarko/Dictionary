import 'server-only';
import { prisma } from '@/server/db/client';
import { addDays } from 'date-fns';
import { TMeaning, TWordApp } from '@/shared/types';

export async function findAllNotesByUserId(userId: number) {
  try {
    const res = await prisma.notes.findMany({
      include: {
        dictionary_words: {
          select: {
            word: true,
            meanings: true,
            audio: true
          }
        }
      },
      where: {
        user_id: userId
      }
    });
    return res;
  } catch (error) {
    throw new Error(`findAllNotesByUserId failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function findAllNotes() {
  try {
    const res = await prisma.notes.findMany({});
    return res;
  } catch (error) {
    throw new Error(`findAllNotes failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function findUserWordTexts(userId: number) {
  try {
    const res = await prisma.notes.findMany({
      include: {
        dictionary_words: {
          select: {
            word: true,
          }
        }
      },
      where: {
        user_id: userId
      }
    });

    return res.map((n) => { return n.dictionary_words?.word });

  } catch (error) {
    throw new Error(`findUserWordTexts failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function findNoteById(noteId: number) {

  try {
    const res = await prisma.notes.findUnique({ where: { id: noteId }, include: { dictionary_words: { select: { word: true, meanings: true, audio: true } } } });

    return res;
  } catch (error) {
    throw new Error(`findNoteById failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function updateNoteReviewFactors(noteId: number, days: number, repetitions: number, ease_factor: number, review_date: Date) {

  try {
    const res = await prisma.notes.update({
      where: { id: noteId },
      data: {
        days: days,
        repetitions: repetitions,
        ease_factor: ease_factor,
        review_date: review_date
      }
    });

    return res;
  } catch (error) {
    throw new Error(`updateNoteReviewFactors failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function deleteNoteById(noteId: number) {

  try {
    const res = await prisma.notes.delete({ where: { id: noteId } });

    return res;
  } catch (error) {
    throw new Error(`deleteNoteById failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function deleteNotesById(ids: number[]) {

  try {
    let res;
    for (const id of ids)
      res = await prisma.notes.deleteMany({ where: { id: id } });

    return res;
  } catch (error) {
    throw new Error(`deleteNotesById failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function updateNoteLearnedStatus(noteId: number, status: boolean) {

  try {
    const res = await prisma.notes.update({ where: { id: noteId }, data: { is_learned: status } });

    return res;
  } catch (error) {
    throw new Error(`updateNoteLearnedStatus failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function updateNoteUserText(userNotes: string, noteId: number) {

  try {
    const res = await prisma.notes.update({ where: { id: noteId }, data: { user_notes: userNotes } });

    return res;
  } catch (error) {
    throw new Error(`updateNoteUserText failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function resetNoteReviewFactorsById(noteId: number, days: number, repetitions: number, easeFactor: number, reviewDate: Date) {
  try {
    const res = await prisma.notes.update({
      where: { id: noteId },
      data: {
        days: days,
        repetitions: repetitions,
        ease_factor: easeFactor,
        review_date: reviewDate,
        is_learned: false,
      }
    });

    return res;
  } catch (error) {
    throw new Error(`resetNoteReviewFactors failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
