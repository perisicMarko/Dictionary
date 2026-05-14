import 'server-only';
import { prisma } from "@/server/db/client";
import { TMeaning } from '@/shared/types';



export async function findWord(word : string) {

  try {
    const res = await prisma.dictionary_words.findFirst({
        where:{
            word: word, 
        }
    });

    return res;
  } catch (error) {
    throw new Error(`findWord failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function saveWord(word: string, audio: Uint8Array<ArrayBuffer> | null, meanings: TMeaning[]) {
  try{
    const res = await prisma.dictionary_words.create({
      data: {
        word: word,
        audio: audio,
        meanings: meanings,
      }
    });

    return res;   
  } catch (error) {
    throw new Error(`saveWord failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function updateWordAudioById(wordId: number, audio: Uint8Array<ArrayBuffer>){
  try{
    const res = await prisma.dictionary_words.update({
      where: {
        id: wordId
      },
      data: {
        audio: audio,
      }
    });

    return res;   
  } catch (error) {
    throw new Error(`updateWordAudioById failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
