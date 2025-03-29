'use server'
import { ImportNotes, GetNotes, GetNoteById, UpdateRepetitionFactors, SetNoteLearned, ResetNoteRecallFactors, DeleteNote, EditNotes } from '@/actions/manageNotes/db';
import { TDBNoteEntry, TGeneratedNote, TGMeaning, TGPhonetic, TWordApp } from '@/lib/types';
import { addDays, isBefore } from 'date-fns';
import calc from '@/lib/spacedRepetition';
import { redirect } from 'next/navigation';
import { getAuthUser } from '../auth/index';

export async function saveNotes(formData : FormData){

  const word = formData.get('word')?.toString();
  const audio = formData.get('audio')?.toString();
  const user_notes = formData.get('userNotes')?.toString();
  const generated_notes = formData.get('generatedNotes')?.toString();
  const user = await getAuthUser();
  const userId = user?.userId;

  const now = new Date();
  const dbInput : TDBNoteEntry = {
    id : 0, // mock for schema
    user_id : Number(userId),
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

  const retVal = await ImportNotes(dbInput);
  
  if(!retVal)
    throw new Error('Word is not imported in database, smth is wrong. Check manageNotes/saveNotes -> db/ImportNotes');
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


export async function getUsersNotes(){
  const user = await getAuthUser();
  const userId = Number(user?.userId); 
  const notes = await GetNotes();

  if(Array.isArray(notes))
    return notes?.filter((w : TDBNoteEntry) => {
      const res = w.status == false && w.user_id === userId;
      return res;
    });
}


export async function getUsersHistory(userId : number){
  
  const notes = await GetNotes();
  
  if(Array.isArray(notes))
    return notes.filter((w : TDBNoteEntry) => {
      const res = w.status == true && w.user_id == userId;
      return res;
    });
}

export async function getRecallNotes(){
  const notes = await GetNotes();
  const currentDate = new Date().toISOString();
  const user = await getAuthUser();
  const userId = user?.userId;
  
  if(Array.isArray(notes))
    return notes.filter((n : TDBNoteEntry) => {
      const res = n.status == false && n.user_id == userId && isBefore(n.review_date, currentDate);
      return res;
    });
}


type stateType = undefined | {success: string};
  
export async function updateReviewDate(state : stateType, formData : FormData){
  const note = await GetNoteById(Number(formData.get('wordId')));

  const quality = Number(formData.get('recall'));

  if(note && !('error' in note)){
    const retVal = calc(quality, note.days, note.repetitions, note.ease_factor);

    note.days = retVal.days;
    note.repetitions = retVal.repetitions;
    note.ease_factor = retVal.easeFactor;
    note.review_date = addDays(new Date(), note.days);
    
    const ret = await UpdateRepetitionFactors(note);
    if(ret)
      return {success: 'review date set'};
    else 
      console.log('An error has occured while updating review date, check manageNotes/index.');
  }
}

export async function setAsLearned(formData : FormData, status : boolean){
  const user = await getAuthUser();
  if(!user)
    redirect('/logIn');

  await SetNoteLearned(Number(formData.get('noteId')), status); 
}

export async function editNote(state: void | undefined, formData : FormData){
  const userNotes = formData.get('userNotes')?.toString();
  const generatedNotes = formData.get('generatedNotes')?.toString();
  const retVal = EditNotes(userNotes || '', generatedNotes || '', Number(formData.get('noteId')));

  if(!retVal)
    throw new Error('Note with noteId is missing in database check manageNotes and edit/[noteId]');

  redirect('/recall');
}

export async function getNoteById(noteId : number){
  const note = await GetNoteById(noteId);

  return note;
}


export async function backToRecallSystem(formData : FormData){ 
  await ResetNoteRecallFactors(Number(formData.get('noteId')), 1, 0, 2.5, addDays(new Date(), 1));
}


export async function deleteNote(formData : FormData){
  const res = await DeleteNote(Number(formData.get('noteId')));

  if(res)
    return true;
  else
    return false;
}
