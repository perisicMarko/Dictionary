'use client'
import { getUsersNotes } from '@/actions/manageNotes';
import Words from '@/components/Words';
import Note from '@/components/Note';
import { TDBNoteEntry } from '@/lib/types';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';


export default function YourWords(){

    const [words, setWords] = useState<TDBNoteEntry[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const url = window.location.href
        const start = url.indexOf('/user') + 6;
        const end = url.indexOf('/', start);
        const userId = Number(url.substring(start, end));

        async function fetchNotes() {
            const data = await getUsersNotes(Number(userId));
            setWords(data);
        }
        fetchNotes();
    }, []);
    
    const itemVariants = {
        hidden: { opacity: 0, y: -15 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };  

    const index : number = words?.findIndex((word : TDBNoteEntry) => word.word.toLowerCase().trim() === search.toLowerCase().trim());
    
    return (
        <>
        <motion.div initial='hidden' animate='show' variants={itemVariants} className='mt-10 w-3/4 sm:w-[600px] bg-slate-800 rounded-4xl grid grid-cols-[auto_1fr] items-center'>
                    <Image src='/magnifyGlass.svg' alt='magnify glass icon' width={20} height={20} className='inline-block ml-8 mr-5'></Image><input className="text-white p-2 inline-block rounded-r-4xl" type="text" name="search" placeholder='Search for words here...' value={search} onChange={(e) => { setSearch(e.target.value) }}/>
                </motion.div>
        {index === -1 && search != '' && <p className=' mt-3 bg-slate-800 rounded-full p-2'>{'No word like that within your words'}</p>}
        {(words && search != '' && index != -1) && <Note prop={words[index]} historyNote={false} handle={() => {}}></Note>}
        {words && search === '' ? <Words props={words} historyNote={false} handle={() => {}}></Words> : <></>}
        {words.length === 0 &&
        <motion.div initial='hidden' animate='show' variants={itemVariants} className="center bg-slate-800 mt-60 rounded-4xl b-2 border-blue-500 p-2">
            <h1 className="text-center w-3/4 sm:w-[600px] text-white p-2"><b>Hmm, looks like you do not have any words, time to learn!</b></h1>
        </motion.div>
        }
        </>
    );
}
