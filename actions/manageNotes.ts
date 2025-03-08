/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'
import { ImportNotes, GetNotes } from '@/lib/db';



export async function saveNotes(formData : FormData){ 


  const notes = {
    word: formData.get('word'),
    sound: formData.get('audio'),
    user_notes: formData.get('userNotes'),
    generated: formData.get('generate'),
    generated_notes: formData.get('generatedNotes')
  };
  
  const dbInput = {
    userId : formData.get('userId'),
    notes : notes,
    learned: false
  };

  const retVal = await ImportNotes(dbInput);
  if(!retVal)
    throw new Error('Word is not imported in database, smth is wrong. Check manageNotes/saveNotes -> db/ImportNotes');

}

export async function generateNotes(rawNotes : any){
  if(rawNotes?.title)
    return {error: 'Hm, that word has no definitions.'};
  const notes = filterApiNotes(rawNotes[0]);

  return notes
}

// refacotring the http response to structure that is more suitable for my interface
function filterApiNotes(data : any){
  const retVal = {
    word: "",
    phonetic: "",
    sound: "",
    meanings: [] as { partOfSpeech: string; definitions: { definition: string; example: string }[] }[],
    parsedNote: ""
  };

  retVal.word = data.word;
  retVal.phonetic = data.phonetic;
  retVal.sound = data.phonetics.filter((p : any) => p.audio != undefined && p.audio != '')[0]?.audio;
  

  retVal.meanings = data.meanings.map((e : any) => {
    const res = {
      partOfSpeech: "",
      definitions: [] as {definition: string; example: string}[]
    };
    res.partOfSpeech = e.partOfSpeech;
    res.definitions = e.definitions.map((d : any) => {
      const tmp = {
        definition: "",
        example: ""
      };
      tmp.definition = d.definition;
      tmp.example = d.example;
      return tmp;
    });
    return res;
  });

  retVal.parsedNote = stringifyNote(retVal);

  return retVal;
}


function stringifyNote(noteObj : any){
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


export async function getUsersNotes(userId : any){
  const tmp = await GetNotes();
  const words = await tmp.json();

  return words.filter((w : any) => {
    const res = w.learned == 0 && w.user_id == userId;
    return res;
  });
}


export async function getUsersHistory(userId : any){
  const tmp = await GetNotes();
  const words = await tmp.json();

  return words.filter((w : any) => {
    const res = w.learned == 1 && w.user_id == userId;
    return res;
  });
}