'use server';
import { TWordApp, TMeaning } from "@/shared/types";
import { findWord, saveWord, updateWordAudioById } from "@/features/dictionary/infrastructure/wordsRepository";
import OpenAi from "openai";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

async function fetchTTSforWord(word: string) {
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
async function fetchApiWordMeanings(word: string) {
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

    try {
      const dsJson = await JSON.parse(deepSeekResponse.choices[0].message.content || "");
      if (!dsJson.success) {
        return { success: false }; // when word is not valid english word
      }
      return { success: true, data: dsJson.data[0].entries };
    } catch (e) {
      throw new Error("Deep seek returned invalid json response.")
    }
  } catch (e) {
    throw new Error(`Failed fetching notes from DeepSeek, message: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export async function generateWordNotes(word: string) {
  try {
    const dbQueryRes = await findWord(word);
    if (dbQueryRes) { // for sake of implementing guard for adding duplicate words on client side
      const dbWord: TWordApp = {
        word: dbQueryRes.word,
        audio: dbQueryRes.audio, // todo change the schema in database to store bytes
        generated_notes: dbQueryRes.meanings as TMeaning[],
        word_id: dbQueryRes.id
      }

      if (!dbQueryRes.audio) {
        const ttsRes = await fetchTTSforWord(word);
        if (ttsRes.success) {
          dbWord.audio = ttsRes.data;
          await updateWordAudioById(dbQueryRes.id, Buffer.from(ttsRes.data as Uint8Array));
        }
        // todo
        // if it fails to fetch audio, it should not break the flow of returning word meanings
        // think about some fallback audio in case fetching fails
        // e.g cron in the backgournd populating the database with tts generated audios for then already existing words
      }
      return { success: true, data: dbWord };
    }

    const note: TWordApp = {
      word: word,
      audio: null,
      generated_notes: [],
      word_id: -1, // mock, when word is saved it would be updated with real id from database
    };

    const apiNotesRes = await fetchApiWordMeanings(word);
    if (!apiNotesRes.success) {
      return { success: false, data: null };
    }
    note.generated_notes = apiNotesRes.data as TMeaning[];


    const ttsRes = await fetchTTSforWord(word);
    if (ttsRes.success) {
      note.audio = ttsRes.data;
    }

    const savedWord = await saveWord(note.word, note.audio, note.generated_notes);
    note.word_id = savedWord.id;

    return { success: true, data: note };

  } catch (e) {
    if (e instanceof Error)
      throw new Error('Failed generating api notes, message: ' + e.message);
  }

  return { success: false, data: null };
}
