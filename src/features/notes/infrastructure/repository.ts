import 'server-only';
import { prisma } from '@/server/db/client';
import { TMeaning, TWordApp } from '@/shared/types';
import { addDays } from 'date-fns';

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

export async function findAllWords() {
  try {
    const res = await prisma.dictionary_words.findMany({});
    return res;
  } catch (error) {
    throw new Error(`findAllWords failed: ${error instanceof Error ? error.message : String(error)}`);
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

export async function createUserNote(userId: number, word: string, audio: Uint8Array<ArrayBuffer> | null, user_notes: string, generated_notes: TMeaning[], wordId: number) {
  try {
    const newNotes = await prisma.notes.create({
      data: {
        user_id: userId,
        is_learned: false,
        language: 'english',
        user_notes: user_notes,
        repetitions: 0,
        days: 1,
        ease_factor: 2.5,
        review_date: addDays(new Date(), 1),
        word_id: wordId
      }
    });

    if (!newNotes)
      throw new Error("Failed to import users note.");

    return newNotes;
    
  } catch (error) {
    throw new Error(`createUserNote failed: ${error instanceof Error ? error.message : String(error)}`);
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

export async function restoreNotes(noteId: number, audio: Uint8Array<ArrayBuffer> | null) {

  try {
    const res = await prisma.dictionary_words.updateMany({ where: { id: noteId }, data: { audio: audio } });

    return res;
  } catch (error) {
    throw new Error(`restoreNotes failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
