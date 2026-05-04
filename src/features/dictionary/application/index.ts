'use server';
import { TGPhonetic, TWordApp, TMeaning } from "@/shared/types";
import { findWord, saveWord } from "@/features/dictionary/infrastructure/wordsRepository";
import OpenAi from "openai";


export async function fetchApiNotes(word : string){
  const generateNotePrompt = `Return ONLY valid JSON.

Input: one English word.

If invalid, return:
{"success":false}

If valid, return:
{
  "success": true,
  "data": [
    {
      "word": "<original input>",
      "entries": [
        {
          "partOfSpeech": "<noun|verb|adjective|...>",
          "definitions": [
            {
              "definition": "...",
              "examples": ["Max 3 examples."],
              "synonyms": [],
              "antonyms": []
            }
          ]
        }
      ]
    }
  ]
}

Rules:
- Include common confident meanings only.
- Order parts of speech by common usage.
- Separate unrelated meanings.
- Use [] when no examples/synonyms/antonyms exist.
- Preserve input casing.
- No extra text.

Word:`;

  try{
      const dbQueryRes = await findWord(word);
      if(dbQueryRes){ // for sake of implementing guard for adding duplicate words on client side
        const val : TWordApp = {
          word: dbQueryRes.word,
          audio: dbQueryRes.audio || '',
          generated_notes: dbQueryRes.meanings as TMeaning[],
          word_id: dbQueryRes.id
        }

        return { success: true, data: val};
      }

      const note : TWordApp = {
        word: word,
        audio: '',
        generated_notes: [],
        word_id: -1, // mock, when word is saved it would be updated with real id from database
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


      try{
        const dsJson = await JSON.parse(deepSeekResponse.choices[0].message.content || "");
        if(!dsJson.success){
          return { success: false };
        }
        note.generated_notes = dsJson.data[0].entries;
      } catch(e){
        throw new Error("Deep seek returned invalid json response.")
      }


      try{
        // if word is not found in database, find pronunciation through on of the api
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
      } catch(e){
        if(e instanceof Error)
          throw new Error('Failed fetching api voice, message: ' + e.message); 
      }
        
      const savedWord = await saveWord(note.word, note.audio, note.generated_notes);
      note.word_id = savedWord.id;
      
      return { success: true, data: note };
    } catch(e){
      if(e instanceof Error)
          throw new Error('Failed generating api notes, message: ' + e.message); 
    }
}
