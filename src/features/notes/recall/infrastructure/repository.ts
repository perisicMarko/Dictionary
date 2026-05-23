import { prisma } from '@/server/db/client';

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