import { prisma } from '@/server/db/client';
import { addDays } from 'date-fns';
import { TMeaning } from '@/shared/types';

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
