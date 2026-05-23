'use server'
import { readAuthenticatedUser, requireAuthenticatedUser } from '@/server/auth/userSession';
import { logOutUser } from '@/features/auth/application/userAuth';
import { createUserNote } from '../infrastructure/repository';
import { TMeaning } from '@/shared/types';
import { findAllNotesByUserId } from '../../infrastructure/repository';

export async function saveNote(word: string, audio: Uint8Array<ArrayBuffer> | null, user_notes: string, generated_notes: TMeaning[], wordId: number) {
  const user = await requireAuthenticatedUser();
  if (!user) {
    await logOutUser();
    return { success: false };
  }

  const { userId } = user;
  await createUserNote(userId, word, audio, user_notes, generated_notes, wordId);

  return { success: true };
}

export async function getUsersWords() {
  const user = await readAuthenticatedUser();
  if (!user) {
    return { success: false };
  }

  const { userId } = user;
  const words = (await findAllNotesByUserId(userId) as any[]).map((e) => e.dictionary_words.word) as string[];

  return { success: true, data: words };
}