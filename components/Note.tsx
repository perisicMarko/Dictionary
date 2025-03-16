'use client'
import { TDBNoteEntry } from '@/lib/types';
import AudioPlayer from "./AudioPlayer";
import { useState } from 'react';

export default function Note(note : TDBNoteEntry){

    const [drop, setDrop] = useState(false);
    
    const title = (drop ? 'Click to collapse.' : 'Click for notes.');

    return (
        <div className="bg-blue-400 w-3/4 sm:w-[600px] max-h-[720px] sm:max-h-[800px] rounded-4xl mt-8 overflow-auto" title={title} onClick={() => setDrop(!drop)}>
            <h1 className="text-center mb-3" title="word"><u><b>{note.word}</b></u></h1>
            <div className="flex flex-col justify-center items-center">
                <span className="mr-3">Hear it:</span><AudioPlayer src={note.audio}></AudioPlayer>
                <button className="sticky top-0 bg-blue-400 z-10 hover:scale-105 hover:underline cursor-pointer" onClick={() => setDrop(!drop)}>Show notes</button>
            </div>
            {drop && 
            <>
            <div className='p-4'>
                <h2 className='mt-2'><b>Your notes:</b></h2>
                <p className="whiteSpaces">{note.user_notes ? note.user_notes : 'You have not inserted yor notes.'}</p> 
                <h2 className="mt-2"><b>Generated notes:</b></h2>
                <p className="whiteSpaces">{note.generated_notes}</p>
            </div>
            </>
            }
        </div>
    );
}