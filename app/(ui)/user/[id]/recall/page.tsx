'use client'
import { getRecallNotes } from "@/actions/manageNotes";
import { useState, useEffect } from 'react';
import { TDBNoteEntry } from "@/lib/types";
import RecallNote from '@/components/RecallNote';


export default function Page(){
    const [words, setWords] = useState<TDBNoteEntry[]>([]); 
    const [refresh, setRefresh] = useState(false);

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