'use client'
import { getRecallNotes } from "@/actions/manageNotes";
import { useState, useEffect } from 'react';
import { TDBNoteEntry } from "@/lib/types";
import RecallNote from '@/components/RecallNote';


export default function Page(){
    const [words, setWords] = useState<TDBNoteEntry[]>([]); 
    const [refresh, setRefresh] = useState(false);
    const [help, setHelp] = useState(false);
    useEffect(() => {
        const url = window.location.href
        const start = url.indexOf('/user') + 6;
        const end = url.indexOf('/', start);
        const userId = Number(url.substring(start, end));
        
        async function fetchNotes() {
            const data = await getRecallNotes(Number(userId));
            setWords(data);
        }
        fetchNotes();
        }, [refresh]);

    function onSubmit(){
        setRefresh(!refresh);
    }

    return (
        <>

        {!help && 
            <div className='center bg-blue-400 rounded-2xl mt-10 px-3'>
                <span className="ml-1 block hover:scale-105 hover:underline cursor-pointer" onClick={() => {setHelp(true);}}><b>help</b></span>
            </div>
        }
        {help &&
            <div className='bg-blue-400 w-3/4 sm:w-[400px] rounded-2xl mt-10'>
                <div className='bg-blue-500 rounded-t-2xl flex justify-end'>
                    <span className="hover:scale-115 cursor-pointer mr-3" onClick={() => {setHelp(false);}}><b>x</b></span>
                </div>
                <p className="p-2 text-blue-950">
                    Here is where you recall words you have added, click on menu icon to drop menu.<br/>
                    There you have edit and delete icons, also &quot;notes&quot; for showing word notes and &quot;grade&quot; for returning to the grading ui.<br/>
                    Note that you will be informed via email when to enter the app to recall some words. Recall system is based on forgetting curve and spaced repetitino algorithm.<br/>
                    Initially fresly freshly added word is set to recall for tommorow, then after 6 days, after first two repetitions each next is calculated based on how good you have graded your recall.<br/>
                    If you mark some word with grade below 3(0, 1, 2) repetition cycle will be returned to the beginning. <br/>
                    Also word is considered as learned when it has a big interval for recall(30+ days), but app will not get rid of those words for you, you can do it on delete button where word will be removed to history<br/>
                </p>
            </div>
        }
        {words.length > 0 ?   
            words.map((w : TDBNoteEntry) => { 
                return <RecallNote key={w.id} note={w} handle={onSubmit} ></RecallNote>
            })
        :
        <div className="center bg-blue-400 mt-60 rounded-4xl b-2 border-blue-500 p-2">
            <h1 className="text-center text-blue-950 "><b>Hmm, looks like you do not have any words to recall for today, keep up the good work!</b></h1>
        </div>
        }
        </>
    );
}