import 'server-only';
import { PrismaClient } from '@prisma/client';
import { TMeaning, TWordApp } from '@/lib/types';
import { addDays } from 'date-fns';

const prisma = new PrismaClient();

export async function findAllNotesWithDictionaryWord(userId : number) {
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

    if (error instanceof Error) {
      console.log('findAllNotesWithDictionaryWord: ERROR: API - ', error?.message);
    }

  }
}

export async function findUserWordTexts(userId : number) {
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

    return res.map((n) => {return n.dictionary_words?.word});

  } catch (error) {

    if (error instanceof Error) {
      console.log('findAllNotesWithDictionaryWord: ERROR: API - ', error?.message);
    }

  }
}

export async function createUserNote(userId: number, word: string, audio: string, user_notes: string, generated_notes: TMeaning[], wordId: number) {
  const stored_locally = wordId != -1;
  try {
    if (!stored_locally) {
      // save word to table in my database but do not wait it for performance, because users note is already imported, here i just scrape what user searched
      const newWord = await prisma.dictionary_words.create({
        data: {
          word: word,
          meanings: generated_notes,
          audio: audio
        }
      });
      if (!newWord)
        throw new Error("Failed to import word locally.");


      const newNotes = await prisma.notes.create({
        data: {
          user_id: userId,
          status: false,
          language: 'english',
          user_notes: user_notes,
          repetitions: 0,
          days: 1,
          ease_factor: 2.5,
          review_date: addDays(new Date(), 1),
          word_id: newWord.id
        }
      });

      if (!newNotes)
        throw new Error("Failed to import users note.");

      return newNotes;
    }

    const newNotes = await prisma.notes.create({
      data: {
        user_id: userId,
        status: false,
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

    if (error instanceof Error) {
      console.log('createUserNote: ERROR: API - ' + error.message);
    }

  }
}

export async function findNoteById(noteId : number) {

  try {
    const res = await prisma.notes.findUnique({ where: { id: noteId }, include: { dictionary_words: { select: { word: true, meanings: true, audio: true } } } });

    return res;
  } catch (error) {

    if (error instanceof Error) {
      console.log('findNoteById: ERROR: API - ' + error.message);
    }

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

    if (error instanceof Error) {
      console.log('updateNoteReviewFactors: ERROR: API - ' + error.message);
    }

  }
}

export async function deleteNoteById(noteId: number) {

  try {
    const res = await prisma.notes.delete({ where: { id: noteId } });

    return res;
  } catch (error) {

    if (error instanceof Error) {
      console.log('DeleeteNote: ERROR: API - ' + error.message);
    }
  }
}

export async function DeleteUnverifiedNotes(ids: number[]) {

  try {
    let res;
    for (const id of ids)
      res = await prisma.notes.deleteMany({ where: { id: id } });

    return res;
  } catch (error) {

    if (error instanceof Error) {
      console.log('DeleteUnverifiedNotes: ERROR: API - ' + error.message);
    }

  }
}

export async function updateNoteLearnedStatus(noteId: number, status: boolean) {

  try {
    const res = await prisma.notes.update({ where: { id: noteId }, data: { status: status } });

    return res;
  } catch (error) {

    if (error instanceof Error) {
      console.log('SetNoteLearned: ERROR: API - ' + error.message);
    }
  }
}

export async function updateNoteUserText(userNotes: string, noteId: number) {

  try {
    const res = await prisma.notes.update({ where: { id: noteId }, data: { user_notes: userNotes } });

    return res;
  } catch (error) {

    if (error instanceof Error) {
      console.log('updateNoteUserText: ERROR: API - ' + error.message);
    }

  }
}

export async function resetNoteReviewFactors(noteId: number, days: number, repetitions: number, easeFactor: number, reviewDate: Date) {
  try {
    const res = await prisma.notes.update({
      where: { id: noteId },
      data: {
        days: days,
        repetitions: repetitions,
        ease_factor: easeFactor,
        review_date: reviewDate,
        status: false,
      }
    });

    return res;
  } catch (error) {

    if (error instanceof Error) {
      console.log('resetNoteReviewFactors: ERROR: API - ' + error.message);
    }

  }
}



export async function restoreNotes(noteId: number, audio: string) {

  try {
    const res = await prisma.dictionary_words.updateMany({ where: { id: noteId }, data: { audio: audio } });

    return res;
  } catch (error) {

    if (error instanceof Error) {
      console.log('updateNoteUserText: ERROR: API - ' + error.message);
    }

  }
}
