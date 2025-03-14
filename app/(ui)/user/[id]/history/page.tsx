'use client'
import { getUsersHistory } from '@/actions/manageNotes';
import Note from '@/components/Note';
import Words from '@/components/Words';
import { TDBNoteEntry } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function History(){

    const [words, setWords] = useState<TDBNoteEntry[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const url = window.location.href
        const start = url.indexOf('/user') + 6;
        const end = url.indexOf('/', start);
        const userId = Number(url.substring(start, end));

        async function fetchNotes() {
            const data = await getUsersHistory(Number(userId));
            setWords(data);
        }
        fetchNotes();
    }, []);
    
    const index : number = words?.findIndex((word : TDBNoteEntry) => word.word.toLowerCase().trim() === search.toLowerCase().trim());

    return (
        <>
        <div className='rounded-4xl mt-10 b-2 text0-blue-950 bg-blue-400 b-blue-950'>
            <input className="bg-blue-400 text-blue-950 rounded-4xl p-2" type="text" name="search" placeholder="Search words here..." value={search} onChange={(e) => { setSearch(e.target.value) }}/>
        </div>
        {index === -1 && search != '' && <p className=' mt-3 bg-blue-400 rounded-full p-2'>{'No word like that within your words'}</p>}
        {(words && search != '' && index != -1) && <Note {...words[index]}></Note>}
        {words && search === '' ? <Words props={words}></Words> : <></>}
        {words.length === 0 &&
        <div className="center bg-blue-400 mt-60 rounded-4xl b-2 border-blue-500 p-2">
            <h1 className="text-center text-blue-950 "><b>Hmm, looks like you do not have any words in your history, time to learn!</b></h1>
        </div>
        }
        </>
    );
}