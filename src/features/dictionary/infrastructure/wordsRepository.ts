import 'server-only';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();



export async function GetWord(word : string) {

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