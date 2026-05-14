import { updateWordAudioByWordId, findAllWords } from '@/features/dictionary/infrastructure/wordsRepository';
import { NextResponse } from 'next/server';
import { fetchTTSforWord } from '@/features/dictionary';



// Endpoint for filling out missing audios in dictionary_words. For dictinoaryWords that are created without audio links.
export async function GET() {

    try {
        const dictionary_words = await findAllWords();

        if(!dictionary_words) return NextResponse.json({ message: 'No words found.', status: 404 });

        const API_KEY = process.env.API_KEY;
        for (const word of dictionary_words){
            if(!word.audio){
                const res = await fetchTTSforWord(word.word);
                if(res.success){
                    await updateWordAudioByWordId(word.id, res.data); 
                }
            }
        }

        return NextResponse.json({ status: 200, message: 'Audio generated successfully.' });
    } catch (error) {
        const message = (error instanceof Error && error.message);
        return NextResponse.json({ message: 'Error occured while deleting unverified database items: ' + message, status: 500 });
    }
}
