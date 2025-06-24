'use server'
import { ImportNotes, GetNotes, GetNoteById, UpdateRepetitionFactors, SetNoteAsLearned, ResetNoteRecallFactors, DeleteNote, EditNotes, GetUsersWords } from '@/actions/manageNotes/db';
import { TMeaning } from '@/lib/types';
import { addDays, isBefore } from 'date-fns';
import calc from '@/actions/manageNotes/spacedRepetition';
import { decryptAccess, decryptRefresh, encryptAccess, TokenPayload, verifySession } from '@/actions/manageSession';
import { STATUS } from '@/actions/manageSession';
import { logOutUser } from '../auth/user';
import { cookies } from 'next/headers';

export async function getUsersWords() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;
  const payload = await decryptRefresh(refreshToken || '');
  if(!payload)
    return [];
  const {userId} = payload;

  const words = await GetUsersWords(userId);

  return words;
}

export async function saveNotes(word: string, audio: string, user_notes: string, generated_notes: TMeaning[], accessToken: string, wordId: number) {
  const retVal = await verifySession(accessToken);
  if (retVal === STATUS.UNAUTHORIZED) { //unauthorized
    await logOutUser();
    return { success: false, accessToken: '', status: 401 }
  }
  else if (retVal === STATUS.ACCESS_NEEDED) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    const payload = await decryptRefresh(refreshToken || '');
    const { email, userId } = payload as TokenPayload;
    const status = await ImportNotes(userId, word, audio, user_notes, generated_notes, wordId);
    if (!status)
      throw new Error('Word is not imported in database, smth is wrong. Check manageNotes/saveNotes -> db/ImportNotes');
    const accessToken = await encryptAccess({ email, userId });

    return { success: true, accessToken: accessToken, status: 201 };
  } else if (retVal === STATUS.VALID_ACCESS) {
    const payload = await decryptAccess(accessToken);
    const { userId } = payload as TokenPayload;
    const status = await ImportNotes(userId, word, audio, user_notes, generated_notes, wordId);
    if (!status)
      throw new Error('Word is not imported in database, smth is wrong. Check manageNotes/saveNotes -> db/ImportNotes');
    const token = accessToken;

    return { success: true, accessToken: token, status: 200 };
  }
}

export async function getUsersNotes(accessToken: string) {
  const retVal = await verifySession(accessToken);

  if (retVal === STATUS.UNAUTHORIZED) { //unauthorized
    await logOutUser();
    return { success: false };
  }
  else if (retVal === STATUS.ACCESS_NEEDED) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    const payload = await decryptRefresh(refreshToken || '');
    const { email, userId } = payload as TokenPayload;

    if (!payload)
      return {success: false};

    const notes = await GetNotes();
    let data = undefined;

    if (Array.isArray(notes))
      data = notes.filter((w) => {
        const res = w.status == false && w.user_id == userId;
        return res;
      });
    const accessToken = await encryptAccess({ email, userId });

    return { success: true, accessToken: accessToken, data: data};
  } else if (retVal === STATUS.VALID_ACCESS) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    const payload = await decryptRefresh(refreshToken || '');
    const { userId } = payload as TokenPayload;
    
    if (!payload)
      return {success: false};

    const notes = await GetNotes();
    let data = undefined;

    if (Array.isArray(notes))
      data = notes.filter((w) => {
        const res = w.status == false && w.user_id == userId;
        return res;
      });

    return { success: true, accessToken: accessToken, data: data};
  }
}


export async function getUsersHistory(accessToken: string) {
  const retVal = await verifySession(accessToken);

  if (retVal === STATUS.UNAUTHORIZED) { //unauthorized
    await logOutUser();
    return { success: false };
  }
  else if (retVal === STATUS.ACCESS_NEEDED) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    const payload = await decryptRefresh(refreshToken || '');
    const { email, userId} = payload as TokenPayload;

    if (!payload)
      return {success: false};

    const notes = await GetNotes();
    let data = undefined;

    if (Array.isArray(notes))
      data = notes.filter((w) => {
        const res = w.status == true && w.user_id == userId;
        return res;
      });
    const accessToken = await encryptAccess({ email, userId });

    return { success: true, accessToken: accessToken, data: data};
  } else if (retVal === STATUS.VALID_ACCESS) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    const payload = await decryptRefresh(refreshToken || '');
    const { userId } = payload as TokenPayload;
    
    if (!payload)
      return {success: false};

    const notes = await GetNotes();
    let data = undefined;

    if (Array.isArray(notes))
      data = notes.filter((w) => {
        const res = w.status == true && w.user_id == userId;
        return res;
      });

    return { success: true, accessToken: accessToken, data: data};
  }
}

export async function getRecallNotes(accessToken: string) {

  const payload = await decryptAccess(accessToken);
  if (!payload)
    return;
  const { userId } = payload as TokenPayload;
  const notes = await GetNotes();
  const currentDate = new Date();

  if (Array.isArray(notes))
    return notes.filter((n) => {
      const res = n.status === false && n.user_id == userId && isBefore(n.review_date, currentDate);
      return res;
    });
}

export async function updateReviewDate(quality: number, noteId: number, accessToken: string) {
  const retVal = await verifySession(accessToken);
  const note = await GetNoteById(noteId);
  if (!note)
    throw new Error('Note that should be graded does not exist in database.');
  const nextReviewValues = calc(quality, note.days, note.repetitions, note.ease_factor);

  note.days = nextReviewValues.days;
  note.repetitions = nextReviewValues.repetitions;
  note.ease_factor = nextReviewValues.easeFactor;
  note.review_date = addDays(new Date(), note.days);

  if (retVal === STATUS.UNAUTHORIZED) { //unauthorized
    await logOutUser();
    return { success: false };
  }
  else if (retVal === STATUS.ACCESS_NEEDED) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    const payload = await decryptRefresh(refreshToken || '');
    const { email, userId } = payload as TokenPayload;
    const ret = await UpdateRepetitionFactors(note.id, note.days, note.repetitions, note.ease_factor, note.review_date);
    if (!ret)
      console.log('An error has occured while updating review date, check manageNotes/index.');
    const accessToken = await encryptAccess({ email, userId });

    return { success: true, accessToken: accessToken, status: 201 };
  } else if (retVal === STATUS.VALID_ACCESS) {
    const ret = await UpdateRepetitionFactors(note.id, note.days, note.repetitions, note.ease_factor, note.review_date);
    if (!ret)
      console.log('An error has occured while updating review date, check manageNotes/index.');
    return { success: true, status: 200 };
  }
}

export async function setAsLearned(noteId: number, status: boolean, accessToken: string) {
  const retVal = await verifySession(accessToken);
  if (retVal === STATUS.UNAUTHORIZED) { //unauthorized
    await logOutUser();
    return { success: false };
  }
  else if (retVal === STATUS.ACCESS_NEEDED) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    const payload = await decryptRefresh(refreshToken || '');
    const { email, userId } = payload as TokenPayload;
    await SetNoteAsLearned(noteId, status);
    const accessToken = await encryptAccess({ email, userId });

    return { success: true, accessToken: accessToken, status: 201 };
  } else if (retVal === STATUS.VALID_ACCESS) {
    await SetNoteAsLearned(noteId, status);
    return { success: true, status: 200 };
  }
}

export async function editNote(userNotes: string, noteId: number, accessToken: string) {
  const status = await verifySession(accessToken);
  if (status === STATUS.UNAUTHORIZED) { //unauthorized
    await logOutUser();
    return { success: false };
  }
  else if (status === STATUS.ACCESS_NEEDED) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    const payload = await decryptRefresh(refreshToken || '');
    const { email, userId } = payload as TokenPayload;
    const retVal = await EditNotes(userNotes, noteId);
    if (!retVal)
      throw new Error('Note with noteId is missing in database check manageNotes and edit/[noteId]'); const accessToken = await encryptAccess({ email, userId });

    return { success: true, accessToken: accessToken, status: 201 };
  } else if (status === STATUS.VALID_ACCESS) {
    const retVal = await EditNotes(userNotes, noteId);
    if (!retVal)
      throw new Error('Note with noteId is missing in database check manageNotes and edit/[noteId]');
    return { success: true, status: 200 };
  }
}

export async function getNoteById(noteId: number) {
  const note = await GetNoteById(noteId);

  return note;
}


export async function backToRecallSystem(noteId: number, accessToken: string) {
  const retVal = await verifySession(accessToken);
  if (retVal === STATUS.UNAUTHORIZED) { //unauthorized
    await logOutUser();
    return { success: false };
  }
  else if (retVal === STATUS.ACCESS_NEEDED) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    const payload = await decryptRefresh(refreshToken || '');
    const { email, userId } = payload as TokenPayload;
    await ResetNoteRecallFactors(noteId, 1, 0, 2.5, addDays(new Date(), 1));
    const accessToken = await encryptAccess({ email, userId });

    return { success: true, accessToken: accessToken, status: 201 };
  } else if (retVal === STATUS.VALID_ACCESS) {
    await ResetNoteRecallFactors(noteId, 1, 0, 2.5, addDays(new Date(), 1));
    return { success: true, status: 200 };
  }
}


export async function deleteNote(noteId: number, accessToken: string) {
  const retVal = await verifySession(accessToken);
  if (retVal === STATUS.UNAUTHORIZED) { //unauthorized
    await logOutUser();
    return { success: false };
  }
  else if (retVal === STATUS.ACCESS_NEEDED) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    const payload = await decryptRefresh(refreshToken || '');
    const { email, userId } = payload as TokenPayload;
    await DeleteNote(noteId);
    const accessToken = await encryptAccess({ email, userId });

    return { success: true, accessToken: accessToken, status: 201 };
  } else if (retVal === STATUS.VALID_ACCESS) {
    await DeleteNote(noteId);
    return { success: true, status: 200 };
  }
}


