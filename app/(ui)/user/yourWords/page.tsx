'use client'
import { getUsersNotes } from '@/actions/manageNotes';
import Words from '@/components/Words';
import Cookie from 'js-cookie';
import { useEffect, useState } from 'react';

export default function YourWords(){

    const [words, setWords] = useState(null);
    const userId = Cookie.get('userId');

    
    useEffect(() => {
        async function fetchNotes() {
            const data = await getUsersNotes(userId);
            setWords(data);
        }
        fetchNotes();
    }, [userId]);
    

    return (
        <>
        {words ? <Words props={words}></Words> : <></>}
        </>
    );
}