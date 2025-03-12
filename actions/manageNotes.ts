'use server'
import { ImportNotes, GetNotes } from '@/lib/db';
import { TDBNote, TDBNoteEntry, TGeneratedNote, TGMeaning, TGPhonetic, TWordApp } from '@/lib/types';


export async function saveNotes(formData : FormData){ 

    const word = formData.get('word')?.toString();
    const sound = formData.get('audio')?.toString();
    const user_notes = formData.get('userNotes')?.toString();
    const generated = formData.get('generate')?.toString();
    const generated_notes = formData.get('generatedNotes')?.toString();
  const notes : TDBNote = {
    word: (word != undefined ? word : ''), 
    sound: (sound != undefined ? sound : ''),
    user_notes: (user_notes != undefined ? user_notes : ''),
    generated: (generated != undefined ? generated : ''),
    generated_notes: (generated_notes != undefined ? generated_notes : '')
  };
  
  const dbInput : TDBNoteEntry = {
    id : 0,
    user_id : Number(formData.get('userId')),
    notes : notes,
    learned: false
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

// refacotring the http response to structure that is more suitable for my interface
function filterApiNotes(data : TGeneratedNote){
  const tmpSound = data.phonetics.filter((p: TGPhonetic) => p.audio != undefined && p.audio != '')[0]?.audio;
  const retVal : TWordApp = {
    word: data.word,
    sound: (tmpSound != undefined ? tmpSound : ''),
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
    const res = w.learned == false && w.user_id == userId;
    return res;
  });
}


export async function getUsersHistory(userId : number){
  const tmp = await GetNotes();
  const words = await (tmp != undefined && tmp.json());
  return words.filter((w : TDBNoteEntry) => {
    const res = w.learned == true && w.user_id == userId;
    return res;
  });
}