'use server';
import { TGPhonetic, TWordApp, TMeaning } from "@/shared/types";
import { findWord, saveWord } from "@/features/dictionary/infrastructure/wordsRepository";
import OpenAi from "openai";


export async function fetchApiNotes(word : string){
  const generateNotePrompt = `Word definition JSON output for hunchYou will receive a list of English words. Return ONLY valid JSON.For each word, return this schema exactly:[  {    "word": "example",    "entries": [      {        "partOfSpeech": "noun",        "definitions": [          {            "definition": "string",            "examples": ["max 3 examples"],            "synonyms": ["..."],            "antonyms": ["..."]          }        ]      }    ]  }]Rules: Include all common meanings you are confident about.- Order parts of speech by common usage frequency (most common first)- If a word has multiple unrelated meanings (e.g., "bat"), create separate entries- Do not invent meanings you are uncertain about- If no confident definition exists, return entries as empty array- Maximum 3 examples per definition-Use empty arrays ([]) instead of omitting synonyms/antonyms when no synonyms or antonymsare found.- Ensure examples grammatically match the part of speech- Preserve original spelling/casing of each input word- Start every example sentence with a capital letter- Output JSON only, no additional text Now do it for word:`;
  try{
      const dbQueryRes = await findWord(word);
      if(dbQueryRes){ // return cached word, and tells front side that word is already cached(important when user wants it to save, then just note is saved)
        const val : TWordApp = {
          word: dbQueryRes.word,
          audio: dbQueryRes.audio || '',
          generated_notes: dbQueryRes.meanings as TMeaning[],
          word_id: dbQueryRes.id
        }

        return val;
      }

      const note : TWordApp = {
        word: word,
        audio: '',
        generated_notes: [],
        word_id: -1, // mock, when mock is saved it would be updated with real id from database
      };

      const deepSeekUrl = 'https://api.deepseek.com';
      const openai = new OpenAi({
        baseURL: deepSeekUrl,
        apiKey: process.env.DEEPSEEK_API_KEY,
      });
      const deepSeekResponse = await openai.chat.completions.create({
        model: 'deepseek-v4-flash',
        messages: [
          {
            role: 'user',
            content: generateNotePrompt + " " + word
          }
        ],
        stream: false,
        reasoning_effort: 'medium',
      });

      const dsJson = await JSON.parse(deepSeekResponse.choices[0].message.content || "");
      note.generated_notes = dsJson[0].entries as TMeaning[];

      // if word is not found in database, find it through on of the api
      const freeDictApiResponse = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word);
      if (freeDictApiResponse.ok) {
          const rawApiData = (await freeDictApiResponse.json())[0]; // the data that api returns is one object in an array, hence [0]
          
          const audio = rawApiData.phonetics.filter((p: TGPhonetic) => p.audio != undefined && p.audio != '')[0]?.audio || undefined;
          if(audio){
            const API_KEY = process.env.API_KEY; 

            const pom = await fetch(`https://api.voicerss.org/?key=${API_KEY}&hl=en-gb&v=Alice&src=${word.trim().toLowerCase()}`);

            note.audio = pom.url;
          }
      }

      await saveWord(note.word, note.audio, note.generated_notes);
      return note;
    } catch(e){
      if(e instanceof Error)
          throw new Error('Failed fetching notes api, message: ' + e.message); 
    }
}
