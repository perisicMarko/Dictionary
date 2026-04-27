import { GetNotes, restoreNotes } from '@/features/notes/infrastructure/repository';
import { TNoteApp } from '@/lib/types';
import { NextResponse } from 'next/server';



export async function GET() {

    try {
        //retrieve all notes from the db
        const notes = (await GetNotes())  as TNoteApp[];

        const API_KEY = process.env.API_KEY;
        for (const n of notes){
            if(!n.dictionary_words.audio){
                const pom = await fetch(`https://api.voicerss.org/?key=${API_KEY}&hl=en-gb&v=Alice&src=${n.dictionary_words.word.trim().toLowerCase()}`);

                await restoreNotes(n.id, pom.url); 
            }
        }

        return NextResponse.json({success: 'All good.'});

    } catch (error) {
        const message = (error instanceof Error && error.message);
        return NextResponse.json({ error: 'Error occured while deleting unverified database items: ' + message, status: 500 });
    }
}