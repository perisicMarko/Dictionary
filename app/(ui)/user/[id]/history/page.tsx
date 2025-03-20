'use client'
import { getUsersHistory } from '@/actions/manageNotes';
import Note from '@/components/Note';
import Words from '@/components/Words';
import { TDBNoteEntry } from '@/lib/types';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function History(){

    const [words, setWords] = useState<TDBNoteEntry[]>([]);
    const [search, setSearch] = useState('');
    const [refresh, setRefresh] = useState(false);

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
    }, [refresh]);

    function onSubmit(){
      setRefresh(!refresh);
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.3,
          },
        },
      };
    
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
        {index === -1 && search != '' && <motion.p initial='hidden' animate='show' variants={{hidden: {opacity: 0, y: 10}, show: {opacity: 1, y: 0, transition: {duration: 1}}}} className=' mt-3 bg-blue-400 rounded-full p-2'>{'No word like that within your words'}</motion.p>}
        {(words && search != '' && index != -1) && <Note prop={words[index]} historyNote={true} handle={onSubmit}></Note>}
        {words && search === '' ? <Words props={words} historyNote={true} handle={onSubmit}></Words> : <></>}
        {words.length === 0 &&
        <motion.div initial='hidden' animate='show' variants={containerVariants} className="center bg-slate-800 w-3/4 sm:w-[600px] mt-60 mx-2 rounded-4xl  p-2">
            <motion.h1 variants={itemVariants} className="text-center text-white"><b>Hmm, looks like you do not have any words in your history, time to learn!</b></motion.h1>
        </motion.div>
        }
        </>
    );
}