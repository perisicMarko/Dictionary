'use server';
import { TWordApp, TMeaning } from "@/shared/types";
import { findWord, saveWord, updateWordAudioByWordId } from "@/features/dictionary/infrastructure/wordsRepository";
import OpenAi from "openai";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

// exported because cron job for filling out missing audios is using this function
export async function fetchTTSforWord(word: string) {
  const polly = new PollyClient({
    region: "eu-central-1", // Europe (Frankfurt)
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
  });

  const command = new SynthesizeSpeechCommand({
    Text: word,
    OutputFormat: "mp3",
    VoiceId: "Emma",
    Engine: "neural",
  });

  try {
    const response = await polly.send(command);
    if (!response.AudioStream) {
      return { success: false, data: null };
    }

    const audioBytes = await response.AudioStream.transformToByteArray();
    return {
      success: true,
      data: new Uint8Array(audioBytes)
    };
  } catch (error) {
    if (error instanceof Error) {
      console.info(`TTS synthesis failed: ${error.message}`);
    }
  }

  return { success: false, data: null };
}

/*
 this function is resposible for fetching word meanings and audio, but also it stores them in the database
 but name of the function implies just the fetching part - maybe it should be split into two functions, one for fetching and one for saving, but on the other hand it is more efficient to do it in one function
 because that saving call would be initiated on on the client side after fetching which is not something that should concern the client and also introduce unnecessary delay between until users see generated notes
 also let's do not inform the client about the database part at all for the security reasons
*/
// returns { success: boolean, data: null | TWordApp } | null
// null if api fails
// success: false if the word is not valid english word
async function fetchApiMeaningsforWord(word: string) {
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

  const deepSeekUrl = 'https://api.deepseek.com';
  const openai = new OpenAi({
    baseURL: deepSeekUrl,
    apiKey: process.env.DEEPSEEK_API_KEY,
  });

  const maxAttempts = 2; // initial request + 1 retry

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
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
        response_format: { type: "json_object" }
      });

      const dsJson = JSON.parse(deepSeekResponse.choices[0].message.content || "");
      if (!dsJson.success) {
        return { success: false, data: null, message: "This word is not supported. Please check your spelling." };
      }

      // this should be validated at the runtime, because ts cannot vouch that this would be TMeaning[]
      const entries = dsJson?.data?.[0]?.entries as TMeaning[];
      return { success: true, data: entries };
    } catch (e) {
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 350));
      }else{
        console.info('Deepseek call failed, retrying.');
      }
    }
  }

  return { success: false, data: null, message: "Notes can not be generated right now. Please try again later."};
}

export async function generateWordNotes(word: string) {
  const dbQueryRes = await findWord(word);
  if (dbQueryRes) {
    const dbWord: TWordApp = {
      word: dbQueryRes.word,
      audio: dbQueryRes.audio,
      generated_notes: dbQueryRes.meanings as TMeaning[],
      word_id: dbQueryRes.id
    }

    if (!dbQueryRes.audio) {
      const ttsRes = await fetchTTSforWord(word);
      if (ttsRes.success) {
        dbWord.audio = ttsRes.data;
        await updateWordAudioByWordId(dbQueryRes.id, Buffer.from(ttsRes.data as Uint8Array));
      }
    }
    return { success: true, data: dbWord };
  }

  const note: TWordApp = {
    word: word,
    audio: null,
    generated_notes: [],
    word_id: -1, // app type placeholder, when word is saved in the database it would a real id from the database
  };

  const apiNotesRes = await fetchApiMeaningsforWord(word);
  
  if (!apiNotesRes.success) {
    return { success: false, data: null, message: apiNotesRes.message };
  } else {
    note.generated_notes = apiNotesRes.data as TMeaning[];
    const ttsRes = await fetchTTSforWord(word);
    if (ttsRes.success) {
      note.audio = ttsRes.data;
    }
    const savedWord = await saveWord(note.word, note.audio, note.generated_notes);
    note.word_id = savedWord.id;
    return { success: true, data: note };
  }
}
