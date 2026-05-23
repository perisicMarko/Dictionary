import 'server-only';
import { prisma } from '@/server/db/client';

export async function deleteNoteById(noteId: number) {

  try {
    const res = await prisma.notes.delete({ where: { id: noteId } });

    return res;
  } catch (error) {
    throw new Error(`deleteNoteById failed: ${error instanceof Error ? error.message : String(error)}`);
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