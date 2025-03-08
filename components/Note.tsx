/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import AudioPlayer from "./AudioPlayer";
import { useState } from 'react';

export default function Note(prop : any){

    const [drop, setDrop] = useState(false);
    
    const tmp = prop.notes.notes;
    const title = (drop ? 'Click to collapse.' : 'Click for notes.');

    return (
        <div className="bg-blue-400 w-[600px] max-h-[800px] rounded-4xl mt-8 overflow-auto" title={title} onClick={() => setDrop(!drop)}>
            <h1 className="text-center mb-3" title="word"><u><b>{tmp.word}</b></u></h1>
            <div className="flex flex-col justify-center items-center">
                <span className="mr-3">Hear it:</span><AudioPlayer src={tmp.sound}></AudioPlayer>
                <button className="sticky top-0 bg-blue-400 z-10 hover:scale-105 hover:underline cursor-pointer" onClick={() => setDrop(!drop)}>Show notes</button>
            </div>
            {drop && 
            <>
            <h2 className='mt-2'>Your notes:</h2>
            <p className="whiteSpaces">{tmp.user_notes ? tmp.user_notes : 'You have not inserted yor notes.'}</p> 
            <h2 className="mt-2">Generated notes:</h2>
            <p className="whiteSpaces">{tmp.generated_notes}</p>
            </>
            }
        </div>
    );
}