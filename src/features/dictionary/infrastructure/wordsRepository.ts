import 'server-only';
import { PrismaClient } from "@prisma/client";
import { TMeaning } from '@/lib/types';

const prisma = new PrismaClient();



export async function findWord(word : string) {

  try {
    const res = await prisma.dictionary_words.findFirst({
        where:{
            word: word, 
        }
    });

    return res;
  } catch (error) {

    if (error instanceof Error) {
      console.log('GetWords: ERROR: API - ' + error.message);
    }

  }
}

export async function saveWord(word: string, audio: string | undefined, meanings: TMeaning[]) {
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

    if (error instanceof Error) {
      console.log('saveWord: ERROR: API - ' + error.message);
    }     
  }
}
