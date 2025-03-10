/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { getUsersNotes } from '@/actions/manageNotes';
import Words from '@/components/Words';
import Note from '@/components/Note';
import Cookie from 'js-cookie';
import { useEffect, useState } from 'react';

export default function YourWords(){

    const [words, setWords] = useState(null);
    const [search, setSearch] = useState('');
    const userId = Cookie.get('userId');

    
    useEffect(() => {
        async function fetchNotes() {
            const data = await getUsersNotes(userId);
            setWords(data);
        }
        fetchNotes();
    }, [userId]);
    

    const index : number = words?.findIndex((word : any) => word.notes.word.toLowerCase().trim() === search.toLowerCase().trim());
    
    return (
        <>
        <div className='rounded-4xl mt-10 b-2 text0-blue-950 bg-blue-400 b-blue-950'>
            <input className="bg-blue-400 text-blue-950 rounded-4xl" type="text" name="search" placeholder="Search words here..." value={search} onChange={(e : any) => { setSearch(e.target.value) }}/>
        </div>
        {index === -1 && search != '' && <p className=' mt-3 bg-blue-400 rounded-full p-2'>{'No word like that within your words'}</p>}
        {(words && search != '' && index != -1) && <Note {...words[index]}></Note>}
        {words && search === '' ? <Words props={words}></Words> : <></>}
        </>
    );
}