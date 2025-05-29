'use server';
import { TGeneratedNote, TGMeaning, TGPhonetic, TWordApp } from "@/lib/types";


export async function fetchApiNotes(word : string){
    try{
        const response = await fetch(
        "https://api.dictionaryapi.dev/api/v2/entries/en/" + word.trim()
        );
        if (response.ok) {
            const result = (await response.json())[0]; // the data that api returns is one object in an array, hence [0]
            if (result?.word === undefined)
            return { error: 'Hm, that word has no definitions.' };
            
            const tmp = filterApiNotes(result);
            if(!tmp.audio){
                const API_KEY = process.env.API_KEY; // Replace with your API key

                const pom = await fetch(`http://api.voicerss.org/?key=${API_KEY}&hl=en-us&v=Amy&src=${word.trim().toLowerCase()}`);

                tmp.audio = pom.url;
                return tmp;
            }else
                return tmp;
        }
    }catch(e){
        if(e instanceof Error)
           throw new Error('Failed fetching notes api, message: ' + e.message); 
    }
}


type GDefinition = { definition: string; example?: string; synonyms?: string[]; antonyms?: string[] };

function filterApiNotes(data: TGeneratedNote) {
  const tmpSound = data.phonetics.filter((p: TGPhonetic) => p.audio != undefined && p.audio != '')[0]?.audio;
  const retVal: TWordApp = {
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


function stringifyNote(noteObj: TWordApp) {
  let res = noteObj.word + ': ' + '\n';

  for (let i = 0; i < noteObj.meanings.length; i++) {
    res += 'Meaning ' + (i + 1) + '\n' + '-' + 'Part of speech: ' + noteObj.meanings[i].partOfSpeech + '\n';
    for (let j = 0; j < noteObj.meanings[i].definitions.length; j++) {
      res += 'Definition ' + (j + 1) + ': ' + noteObj.meanings[i].definitions[j].definition +
        (noteObj.meanings[i].definitions[j].example ? '\nExample: ' + noteObj.meanings[i].definitions[j].example + '\n' : '\n');

      if (j != noteObj.meanings[i].definitions.length - 1)
        res += '\n';
    }
    res += '----------------------------------\n';
  }

  return res;
}