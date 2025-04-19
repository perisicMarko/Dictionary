'use server'
import { ImportNotes, GetNotes, GetNoteById, UpdateRepetitionFactors, SetNoteAsLearned, ResetNoteRecallFactors, DeleteNote, EditNotes } from '@/actions/manageNotes/db';
import { TDBNoteEntry, TGeneratedNote, TGMeaning, TGPhonetic, TWordApp } from '@/lib/types';
import { addDays, isBefore } from 'date-fns';
import calc from '@/actions/manageNotes/spacedRepetition';
import { decryptAccess, decryptRefresh, encryptAccess, TokenPayload, verifySession } from '@/actions/manageSession';
import { STATUS } from '@/actions/manageSession';
import { logOutUser } from '../auth/user';
import { cookies } from 'next/headers';

export async function saveNotes(word : string, audio : string, user_notes : string, generated_notes : string, accessToken: string){
  const now = new Date();
  const dbInput : TDBNoteEntry = {
    id : 0, // mock for schema
    user_id : -1,
    word: word || '',
    status: false, //false meaning word is not learned 
    language: 'english',
    user_notes: user_notes || '',
    generated_notes: generated_notes || '',
    audio: audio || '',
    repetitions: 0,
    days: 1,
    ease_factor: 2.5,
    review_date: addDays(now, 1)
  };
  const retVal = await verifySession(accessToken);
  if(retVal === STATUS.UNAUTHORIZED){ //unauthorized
      await logOutUser();
    return {success: false, accessToken: '', status: 401}
  }
  else if(retVal === STATUS.ACCESS_NEEDED){
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get('refreshToken')?.value;
      const payload = await decryptRefresh(refreshToken || '');
      const {email, userId} = payload as TokenPayload;
      dbInput.user_id = userId;
      await ImportNotes(dbInput);
      const accessToken = await encryptAccess({email, userId});

      return {success: true, accessToken: accessToken, status: 201};
  }else if(retVal === STATUS.VALID_ACCESS){
      const payload = await decryptAccess(accessToken);
      const {userId} = payload as TokenPayload;
      dbInput.user_id = userId;
      const status = await ImportNotes(dbInput);
      if(!status)
        throw new Error('Word is not imported in database, smth is wrong. Check manageNotes/saveNotes -> db/ImportNotes');
      const token = accessToken;
      
      return {success: true, accessToken: token, status: 200}; 
  }
}

export async function generateNotes(rawNotes : TGeneratedNote[]){
  const tmp = rawNotes[0];
  if(tmp?.word === undefined)
    return {error: 'Hm, that word has no definitions.'};
  const notes = filterApiNotes(tmp);

  return notes
}

type GDefinition = { definition: string; example?: string; synonyms?: string[]; antonyms?: string[] };

// refacotring the http response to structure that is more suitable to work with
function filterApiNotes(data : TGeneratedNote){
  const tmpSound = data.phonetics.filter((p: TGPhonetic) => p.audio != undefined && p.audio != '')[0]?.audio;
  const retVal : TWordApp = {
    word: data.word,
    audio: (tmpSound != undefined ? tmpSound : ''),
    meanings: data.meanings.map((e: TGMeaning) => {
      const res: {
        partOfSpeech: string;
        definitions: { definition: string; example: string | undefined; }[];
      } = {
        partOfSpeech: "",
        definitions: [] as { definition: string; example: string; }[]
      };
      res.partOfSpeech = e.partOfSpeech;
      res.definitions = e.definitions.map((d: GDefinition) => {
        const tmp: {
          definition: string;
          example: string | undefined;
        } = { definition: "", example: "" };

        tmp.definition = d.definition;
        tmp.example = d.example;
        return tmp;
      });
      return res;
    }),
    parsedNote: ''
  };

  retVal.parsedNote = stringifyNote(retVal);

  return retVal;
}


function stringifyNote(noteObj : TWordApp){
  let res = noteObj.word + ': ' + '\n';
  
  for(let i = 0; i < noteObj.meanings.length; i++){
    res += 'Meaning ' + (i+1) + '\n' + '-' + 'Part of speech: ' + noteObj.meanings[i].partOfSpeech + '\n';
    for(let j = 0; j < noteObj.meanings[i].definitions.length; j++){
      res += 'Definition ' + (j+1) + ': ' + noteObj.meanings[i].definitions[j].definition + 
        (noteObj.meanings[i].definitions[j].example ? '\nExample: ' + noteObj.meanings[i].definitions[j].example +'\n' : '\n');
      
      if(j != noteObj.meanings[i].definitions.length - 1)
        res += '\n';
    }
    res += '----------------------------------\n';
  }

  return res;
}


export async function getUsersNotes(accessToken : string){

  const payload = await decryptAccess(accessToken);
  if(!payload)
    return;
  const {userId} = payload as TokenPayload;
  const notes = await GetNotes();

  
  if(Array.isArray(notes))
    return notes?.filter((w : TDBNoteEntry) => {
      const res = w.status == false && w.user_id === userId;
      return res;
    });
}


export async function getUsersHistory(accessToken : string){
  
  const payload = await decryptAccess(accessToken);
  if(!payload)
    return;
  const {userId} = payload as TokenPayload;  
  const notes = await GetNotes();
  
  if(Array.isArray(notes))
    return notes.filter((w : TDBNoteEntry) => {
      const res = w.status == true && w.user_id == userId;
      return res;
    });
}

export async function getRecallNotes(accessToken : string){

  const payload = await decryptAccess(accessToken);
  if(!payload)
    return;
  const {userId} = payload as TokenPayload;  
  const notes = await GetNotes();
  const currentDate = new Date().toISOString();
  
  if(Array.isArray(notes))
    return notes.filter((n : TDBNoteEntry) => {
      const res = n.status == false && n.user_id == userId && isBefore(n.review_date, currentDate);
      return res;
    });
}

export async function updateReviewDate(quality: number, noteId: number, accessToken: string){
  const retVal = await verifySession(accessToken);
  const note = await GetNoteById(noteId);
  if(!note)
    throw new Error('Note that should be graded does not exist in database.');
  const nextReviewValues = calc(quality, note.days, note.repetitions, note.ease_factor);

  note.days = nextReviewValues.days;
  note.repetitions = nextReviewValues.repetitions;
  note.ease_factor = nextReviewValues.easeFactor;
  note.review_date = addDays(new Date(), note.days);

  if(retVal === STATUS.UNAUTHORIZED){ //unauthorized
      await logOutUser();
      return {success: false};
  }
  else if(retVal === STATUS.ACCESS_NEEDED){
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get('refreshToken')?.value;
      const payload = await decryptRefresh(refreshToken || '');
      const {email, userId} = payload as TokenPayload;
      const ret = await UpdateRepetitionFactors(note);
      if(!ret)
        console.log('An error has occured while updating review date, check manageNotes/index.');
      const accessToken = await encryptAccess({email, userId});

      return {success: true, accessToken: accessToken, status: 201};
  }else if(retVal === STATUS.VALID_ACCESS){        
    const ret = await UpdateRepetitionFactors(note);
    if(!ret)
      console.log('An error has occured while updating review date, check manageNotes/index.');
    return {success: true, status: 200};
  }
  
  
}

export async function setAsLearned(noteId : number, status : boolean, accessToken: string){
  const retVal = await verifySession(accessToken);
  if(retVal === STATUS.UNAUTHORIZED){ //unauthorized
      await logOutUser();
      return {success: false};
  }
  else if(retVal === STATUS.ACCESS_NEEDED){
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get('refreshToken')?.value;
      const payload = await decryptRefresh(refreshToken || '');
      const {email, userId} = payload as TokenPayload;
      await SetNoteAsLearned(noteId, status); 
      const accessToken = await encryptAccess({email, userId});

      return {success: true, accessToken: accessToken, status: 201};
  }else if(retVal === STATUS.VALID_ACCESS){        
      await SetNoteAsLearned(noteId, status); 
      return {success: true, status: 200};
  }
}

export async function editNote(userNotes : string, generatedNotes : string, noteId : number, accessToken: string){
  const status = await verifySession(accessToken);
  if(status === STATUS.UNAUTHORIZED){ //unauthorized
      await logOutUser();
      return {success: false};
  }
  else if(status === STATUS.ACCESS_NEEDED){
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    const payload = await decryptRefresh(refreshToken || '');
    const {email, userId} = payload as TokenPayload;
    const retVal = await EditNotes(userNotes, generatedNotes, noteId);
    if(!retVal)
      throw new Error('Note with noteId is missing in database check manageNotes and edit/[noteId]');      const accessToken = await encryptAccess({email, userId});
    
    return {success: true, accessToken: accessToken, status: 201};
  }else if(status === STATUS.VALID_ACCESS){        
    const retVal = await EditNotes(userNotes, generatedNotes, noteId);
    if(!retVal)
      throw new Error('Note with noteId is missing in database check manageNotes and edit/[noteId]');
    return {success: true, status: 200};
  }
}

export async function getNoteById(noteId: number){
  const note = await GetNoteById(noteId);

  return note;
}


export async function backToRecallSystem(noteId: number, accessToken: string){ 
  const retVal = await verifySession(accessToken);
  if(retVal === STATUS.UNAUTHORIZED){ //unauthorized
      await logOutUser();
      return {success: false};
  }
  else if(retVal === STATUS.ACCESS_NEEDED){
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get('refreshToken')?.value;
      const payload = await decryptRefresh(refreshToken || '');
      const {email, userId} = payload as TokenPayload;
      await ResetNoteRecallFactors(noteId, 1, 0, 2.5, addDays(new Date(), 1));
      const accessToken = await encryptAccess({email, userId});
      
      return {success: true, accessToken: accessToken, status: 201};
  }else if(retVal === STATUS.VALID_ACCESS){        
    await ResetNoteRecallFactors(noteId, 1, 0, 2.5, addDays(new Date(), 1));
    return {success: true, status: 200};
  }
}


export async function deleteNote(noteId: number, accessToken: string){
  const retVal = await verifySession(accessToken);
  if(retVal === STATUS.UNAUTHORIZED){ //unauthorized
      await logOutUser();
      return {success: false};
  }
  else if(retVal === STATUS.ACCESS_NEEDED){
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get('refreshToken')?.value;
      const payload = await decryptRefresh(refreshToken || '');
      const {email, userId} = payload as TokenPayload;
      await DeleteNote(noteId);
      const accessToken = await encryptAccess({email, userId});

      return {success: true, accessToken: accessToken, status: 201};
  }else if(retVal === STATUS.VALID_ACCESS){        
      await DeleteNote(noteId);
      return {success: true, status: 200};
  }
}


