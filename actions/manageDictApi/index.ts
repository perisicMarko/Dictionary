'use server';
import { TGeneratedNote, TGMeaning, TGPhonetic, TWordApp, TMeaning, TDefinition } from "@/lib/types";


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

                const pom = await fetch(`https://api.voicerss.org/?key=${API_KEY}&hl=en-gb&v=Alice&src=${word.trim().toLowerCase()}`);

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
    generated_notes: data.meanings.map((e: TGMeaning) => {
      const res : TMeaning = {
        partOfSpeech: "",
        definitions: [],
      };

      res.partOfSpeech = e.partOfSpeech;
      res.definitions = e.definitions.map((d: GDefinition) => {
        const tmp : TDefinition = { definition: "", example: "", synonyms: []};

        tmp.definition = d.definition;
        tmp.example = d.example || '';
        tmp.synonyms = d.synonyms || [];

        return tmp;
      });
      return res;
    })
  };

  return retVal;
}
