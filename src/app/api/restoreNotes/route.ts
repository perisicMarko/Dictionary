import { findAllWords, restoreNotes } from '@/features/notes/infrastructure/repository';
import { NextResponse } from 'next/server';



// Endpoint for filling out missing audio links in notes. It is used when audio generation service is down and some notes are created without audio links.
export async function GET() {

    try {
        const notes = await findAllWords();

        if(!notes) return NextResponse.json({ message: 'No words found.', status: 404 });

        const API_KEY = process.env.API_KEY;
        for (const n of notes){
            if(!n.audio){
                const pom = await fetch(`https://api.voicerss.org/?key=${API_KEY}&hl=en-gb&v=Alice&src=${n.word.trim().toLowerCase()}`);

                await restoreNotes(n.id, pom.url); 
            }
        }

        return NextResponse.json({ status: 200, message: 'Words restored successfully.' });
    } catch (error) {
        const message = (error instanceof Error && error.message);
        return NextResponse.json({ message: 'Error occured while deleting unverified database items: ' + message, status: 500 });
    }
}
