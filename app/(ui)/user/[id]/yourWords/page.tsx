'use client'
import { getUsersNotes } from '@/actions/manageNotes';
import Words from '@/components/Words';
import Note from '@/components/Note';
import { TDBNoteEntry } from '@/lib/types';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';


export default function YourWords(){

    const [words, setWords] = useState<TDBNoteEntry[]>([]);
    const [search, setSearch] = useState('');
    const [help, setHelp] = useState(false);
    const searchBarRef = useRef<HTMLInputElement>(null);

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
        <motion.div initial='hidden' animate='show' variants={itemVariants} className='mt-10 w-3/4 sm:w-[600px] bg-slate-800 rounded-4xl grid grid-cols-[auto_auto_1fr] items-center'>
                    <span className='text-white ml-4 cursor-pointer hover:scale-115 rounded-full text-2xl' title='click for help' onClick={() => setHelp(!help)}>?</span>
                    <Image src='/magnifyGlass.svg' alt='magnify glass icon' width={20} height={20} className='inline-block ml-2 mr-5' onClick={() => {searchBarRef?.current?.focus();}}></Image>
                    <input className="text-white p-2 inline-block outline-none rounded-r-4xl" ref={searchBarRef} type="text" name="search" placeholder='Search for words here...' value={search} onChange={(e) => { setSearch(e.target.value) }}/>
        </motion.div>
        {help &&
          <motion.div initial='hidden' animate='show' variants={containerVariants} className='bg-slate-800 w-3/4 sm:w-[600px] mt-5 rounded-3xl text-white'>
            <div className='flex justify-end bg-slate-950 rounded-t-2xl'>
              <span className='xBtn mr-4 py-1' onClick={() => setHelp(!help)}><b>x</b></span>
            </div>
            <motion.p variants={itemVariants} className='p-3'>
              This page is where all words you have not learned yet are stored. Hence if you have more spare time in the day you can review all words here.
            </motion.p>
          </motion.div>
        }
        {index === -1 && search != '' && <p className='mt-3 rounded-full p-2 w-3/4 sm:w-[600px] text-center text-white bg-slate-800'>{'No word like that within your words'}</p>}
        {(words && search != '' && index != -1) && <Note prop={words[index]} historyNote={false} handle={() => {}}></Note>}
        {words && search === '' ? <Words props={words} historyNote={false} handle={() => {}}></Words> : <></>}
        {words.length === 0 &&
        <motion.div initial='hidden' animate='show' variants={containerVariants} className="center bg-slate-800 mt-60 rounded-4xl border-blue-500 p-2 w-3/4 sm:w-[600px]">
            <h2 className="text-center text-white"><b>Hmm, looks like you do not have any words, time to learn!</b></h2>
        </motion.div>
        }
        </>
    );
}
