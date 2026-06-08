'use server';
import { updateNoteUserText } from '../infrastructure/repository';
import { readAuthenticatedUser, requireAuthenticatedUser } from '@/server/auth/userSession';
import { logOutUser } from '@/features/auth/application/userAuth';
import { findNoteById } from '../../infrastructure/repository';
import { TNoteApp } from '@/shared/types';


export async function getNoteById(noteId: number) {
  const authenticatedUser = await readAuthenticatedUser();
  if (!authenticatedUser) {
    await logOutUser();
    return { success: false };
  } 

  const res = await findNoteById(noteId) as TNoteApp | null;
  if(!res){
    return { success: false }; 
  }

  if(res.user_id !== authenticatedUser.userId) {
    return { success: false };
  }
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
