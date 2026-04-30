'use server';
import { TGPhonetic, TWordApp, TMeaning } from "@/shared/types";
import { findWord, saveWord } from "@/features/dictionary/infrastructure/wordsRepository";
import OpenAi from "openai";


export async function fetchApiNotes(word : string){
  const generateNotePrompt = `You will receive a single English word as input.

Step 1: Validate the word.
- If the input is NOT a valid English word, return ONLY:
{
  "success": false
}

Step 2: If the word IS valid, return ONLY valid JSON in this exact format:

{
  "success": true,
  "data": [
    {
      "word": "example",
      "entries": [
        {
          "partOfSpeech": "noun",
          "definitions": [
            {
              "definition": "string",
              "examples": ["Example sentence."],
              "synonyms": ["..."],
              "antonyms": ["..."]
            }
          ]
        }
      ]
    }
  ]
}

Rules:

- Include all common meanings you are confident about
- Order parts of speech by frequency (most common first)
- If meanings are unrelated (e.g., "bat"), separate them clearly
- Do NOT invent uncertain meanings
- If no confident definitions exist, return "entries": []
- Maximum 3 examples per definition
- Always use arrays for "examples", "synonyms", and "antonyms" (use [] if none)
- Ensure examples match the part of speech
- Each example must start with a capital letter
- Preserve original input spelling/casing
- Output MUST be valid JSON (no comments, no trailing commas, no extra text)

Now process this word:`;

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
        note.generated_notes = dsJson.data.entries;
      } catch(e){
        throw new Error("Deep seek returned invalid json response.")
      }


      try{
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
      } catch(e){
        if(e instanceof Error)
          throw new Error('Failed fetching api voice, message: ' + e.message); 
      }
        
        console.log("Saving word:");
        console.log(note);
        console.log("with meanings:");
        console.log(note.generated_notes);
        await saveWord(note.word, note.audio, note.generated_notes);

      return { success: true, data: note };
    } catch(e){
      if(e instanceof Error)
          throw new Error('Failed generating api notes, message: ' + e.message); 
    }
}
