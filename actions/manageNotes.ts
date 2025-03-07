/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'
import { ImportNotes } from '@/lib/db';



export async function saveNotes(formData : FormData){ 

  const word = formData.get('word')?.toString().trim();
  const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + word);
  const result = await response.json();
    

  // every note needs to have: 
  // word: word for which note is
  // phonetic(optional) 
  // pronunciation
  // associative words and definitions
  
  if(formData.get('generate')){
    
  }

}

export async function generateNotes(rawNotes : any){
  if(rawNotes?.title)
    return {error: 'Hm, that word has no definitions.'};
  const notes = filterApiNotes(rawNotes[0]);
  //console.log(notes);

  return notes
}

// refacotring the http response to structure that is more suitable for my interface
function filterApiNotes(data : any){
  const retVal = {
    word: "",
    phonetic: "",
    sound: null,
    meanings: [] as { partOfSpeech: string; definitions: { definition: string; example: string }[] }[],
    parsedNote: ""
  };

  retVal.word = data.word;
  retVal.phonetic = data.phonetic;
  retVal.sound = data.phonetics.filter((p : any) => p.audio != undefined)[0];

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