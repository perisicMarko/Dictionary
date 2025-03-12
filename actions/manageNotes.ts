'use server'
import { ImportNotes, GetNotes } from '@/lib/db';
import { TDBNoteEntry, TGeneratedNote, TGMeaning, TGPhonetic, TWordApp } from '@/lib/types';
import { addDays, format } from 'date-fns';

export async function saveNotes(formData : FormData){

  const word = formData.get('word')?.toString();
  const audio = formData.get('audio')?.toString();
  const user_notes = formData.get('userNotes')?.toString();
  const generated_notes = formData.get('generatedNotes')?.toString();

  const now = new Date();
  const dbInput : TDBNoteEntry = {
    id : 0,
    user_id : Number(formData.get('userId')),
    word: (word === undefined ? '' : word),
    status: false, //false meaning word is not learned 
    language: 'english',
    user_notes: (user_notes === undefined ? '' : user_notes),
    generated_notes: (generated_notes === undefined ? '' : generated_notes),
    audio: (audio === undefined ? '' : audio),
    repetitions: 0,
    days: 1,
    ease_factor: 2.5,
    review_date: format(addDays(now, 1), 'yyyy-MM-dd')
  };

  console.log(dbInput.review_date);

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
      res += 'Definition ' + (j+1) + ': ' + noteObj.meanings[i].definitions[j].definition + (noteObj.meanings[i].definitions[j].example ? '\nExample: ' + noteObj.meanings[i].definitions[j].example +'\n' : '\n');
      if(j != noteObj.meanings[i].definitions.length - 1)
        res += '\n';
    }
    res += '----------------------------------\n';
  }

  return res;
}


export async function getUsersNotes(userId : number){
  const tmp = await GetNotes();
  const words = await (tmp != undefined && tmp.json());

  return words.filter((w : TDBNoteEntry) => {
    const res = w.status == false && w.user_id == userId;
    return res;
  });
}


export async function getUsersHistory(userId : number){
  const tmp = await GetNotes();
  const words = await (tmp != undefined && tmp.json());
  return words.filter((w : TDBNoteEntry) => {
    const res = w.status == true && w.user_id == userId;
    return res;
  });
}