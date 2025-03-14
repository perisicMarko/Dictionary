'use client'
import { TDBNoteEntry } from '@/lib/types';
import AudioPlayer from "./AudioPlayer";
import { useState, useActionState } from 'react';
import Image from 'next/image';
import { updateReviewDate, deleteNote } from '@/actions/manageNotes';

export default function RecallNote({note, handle} : {note : TDBNoteEntry, handle : () => void}){

    const [drop, setDrop] = useState(false);
    const [menu, setMenu] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [state, action, isPending] = useActionState(updateReviewDate, undefined);
    const [quality, setQuality] = useState(-1);
    
    const title = (drop ? 'Click to collapse.' : 'Click for notes.');

    return (
        <>
          <div className="bg-blue-400 w-[600px] max-h-[800px] rounded-4xl mt-8 p-3" onClick={() => {if(quality != 6) return; setDrop(!drop)}}>
                <div className='grid grid-cols-3'>
                    <span></span> {/* needed cause cols-3, two would not do the job done */}
                    <span className="text-center" title="word"><u><b>{note.word}</b></u></span>
                    <Image className="justify-self-end mr-5 scale-75 hover:scale-90" title='options' src='/menu.svg' width={30} height={30} alt='menu icon' onClick={(e) => {e.stopPropagation(); setMenu(!menu);}}></Image>
                </div>
                {menu && 
                    <div className='relative top-0 bg-blue-950'> 
                        <div className="absolute right-2 rounded-2xl bg-blue-300/80 w-[55px] h-[110px]">
                            <form className="center" action={'/edit/' + note.id}>
                                <button type='submit'><Image className="scale-75 hover:scale-90 cursor-pointer" title='edit note' src='/edit.svg' width={30} height={30} alt='edit icon'></Image></button>
                            </form>
                            <form className="center" action={(e) => {setMenu(!menu); deleteNote(e)}}>
                                <input type="text" name='noteId' defaultValue={note.id} hidden/>
                                <input type="text" name='userNotes' defaultValue={note.user_notes} hidden/>
                                <input type="text" name='generatedNotes' defaultValue={note.generated_notes} hidden/>
                                <button type='submit'><Image className="scale-75 hover:scale-90 cursor-pointer" title='delete note' src='/delete.svg' width={30} height={30} alt='delete icon'></Image></button>
                            </form>
                            
                            <span className="ml-1 block hover:scale-105 hover:underline cursor-pointer" onClick={() => {setQuality(6); setMenu(!menu);}}><b>notes</b></span>
                            <span className="ml-1 block hover:scale-105 hover:underline cursor-pointer" onClick={() => {setQuality(-1); setMenu(!menu);}}><b>grade</b></span>
                        </div>
                    </div>
                }
        {quality === 6 ? 
            <>
                <div className="flex flex-col justify-center items-center" title={title}>
                    <span className="mr-3">Hear it:</span><AudioPlayer src={note.audio}></AudioPlayer>
                    <button className="sticky top-0 bg-blue-400 z-10 hover:scale-105 hover:underline cursor-pointer" onClick={() => setDrop(!drop)}>Show notes</button>
                </div>
                {drop && 
                <>
                    <h2 className='mt-2'>Your notes:</h2>
                    <p className="whiteSpaces">{note.user_notes ? note.user_notes : 'You have not inserted yor notes.'}</p> 
                    <h2 className="mt-2">Generated notes:</h2>
                    <p className="whiteSpaces">{note.generated_notes}</p>
                </>
                }
            </>
        : 
                <div className='center'>
                    <form className='border-2 border-blue-950 rounded-2xl flex flex-col justify-center items-center w-1/2 py-2' action={(e) => { if(![0, 1, 2, 3, 4, 5].includes(quality)) return; setQuality(-1); handle(); action(e);}}>
                        <input type="text" name='note.user_id' defaultValue={note.user_id} hidden/>
                        <input type='text' name='wordId' defaultValue={note.id} hidden/>
                        <label htmlFor="recall" className="text-center">How much do you remember:</label>
                        <select id="recall" defaultValue={-1} name="recall" onChange={(e) => setQuality(Number(e.target.value))} className="mt-1 block w-1/4 px-3 py-2 border border-blue-950 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value='-1' disabled>Grade from 0-5 </option>
                            <option value="0">0(complete blackout)</option>
                            <option value="1">1(incorrect response, the correct one remembered after reading notes)</option>
                            <option value="2">2(incorrect response, where the correct one seemed easy to recall)</option>
                            <option value="3">3(correct response, recalled with serious difficulty)</option>
                            <option value="4">4(correct response, after hestitation)</option>
                            <option value="5">5(perfect response)</option>
                        </select>
                        {quality != -1 && <button className='bg-blue-950 hover:bg-blue-400 hover:scale-115 cursor-pointer rounded-full border-2 text-blue-50 px-2 mt-2'>Grade</button>}
                    </form>
                </div>
            
        }
        </div>
        </>
    );
}
