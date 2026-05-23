import 'server-only';
import { prisma } from '@/server/db/client';

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

