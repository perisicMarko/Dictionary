'use client'
import { editNote, getNoteById } from "@/actions/manageNotes";
import { TDBNoteEntry } from "@/lib/types";
import { useActionState, useEffect, useState } from "react";

export default function Edit(){
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [state, action, isLoading] = useActionState(editNote, undefined);
    const [note, setNote] = useState<TDBNoteEntry>();

    useEffect(() => {
        const url = window.location.href;
        const start = url.lastIndexOf('/') + 1;
        
        const noteId = url.substring(start);
        async function getNote() {
            
            const n = await getNoteById(Number(noteId));
            setNote(n);
        }
        
        getNote();
    }, []);

    return (
        <div className="flex flex-col justify-center items-center mt-50 bg-blue-400 rounded-4xl mah-h-[1200px] w-[600px] p-5 overflow-auto">
            <form className='rounded-2xl border-2 border-blue-950 space-y-4 w-[500px]  max-h-[900px] p-4' action={action}>
                <h1 className="text-center hover:underline text-blue-950"><b>Edit your notes here:</b></h1>
                <input type="text" name="noteId" defaultValue={note?.id} hidden/>
                <input type="text" name="userId" defaultValue={note?.user_id} hidden/>
                <div>
                    <label htmlFor="userNotes">Your notes:</label>
                    <textarea name="userNotes" id="userNotes" defaultValue={note?.user_notes} className="border-2 border-blue-200 rounded-2xl h-[200px] block w-full p-2 text-blue-950"></textarea>
                </div>
                
                <div>
                    <label htmlFor="generatedNotes">Generated notes:</label>
                    <textarea name="generatedNotes" id="generatedNotes" defaultValue={note?.generated_notes} className="border-2 border-blue-200 rounded-2xl h-[200px] block w-full p-2 text-blue-950"></textarea>
                </div>
                <div className="center my-6">
                    <button className="bg-blue-950 hover:bg-blue-400 hover:scale-115 cursor-pointer rounded-full border-2 text-blue-50 px-2">Edit</button>
                </div>
            </form>
        </div>
        
    );
}