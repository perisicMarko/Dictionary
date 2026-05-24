'use server';
import { updateNoteUserText } from '../infrastructure/repository';
import { requireAuthenticatedUser } from '@/server/auth/userSession';
import { logOutUser } from '@/features/auth/application/userAuth';
import { findNoteById } from '../../infrastructure/repository';


export async function getNoteById(noteId: number) {
  const res = await findNoteById(noteId) as any;

  return { success: true, data: res };
}

export async function editUserTextNoteByNoteId(userNotes: string, noteId: number) {
  const user = await requireAuthenticatedUser();
  if (!user) {
    await logOutUser();
    return { success: false };
  }

  await updateNoteUserText(userNotes, noteId);

  return { success: true };
}
