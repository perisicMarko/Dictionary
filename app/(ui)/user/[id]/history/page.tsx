'use client'
import { getUsersHistory } from '@/actions/manageNotes';
import Words from '@/components/Words';
import Cookie from 'js-cookie';
import { useEffect, useState } from 'react';

export default function History(){

    const [words, setWords] = useState(null);
    const userId = Cookie.get('userId');

    
    useEffect(() => {
        async function fetchNotes() {
            const data = await getUsersHistory(userId);
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