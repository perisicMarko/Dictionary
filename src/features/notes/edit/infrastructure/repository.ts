import { prisma } from '@/server/db/client';

export async function updateNoteUserText(userNotes: string, noteId: number) {

  try {
    const res = await prisma.notes.update({ where: { id: noteId }, data: { user_notes: userNotes } });

    return res;
  } catch (error) {
    throw new Error(`updateNoteUserText failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}