'use client'
import { getUsersHistory } from '@/actions/manageNotes';
import Note from '@/components/Note';
import Words from '@/components/Words';
import { TDBNoteEntry } from '@/lib/types';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function History(){

    const [words, setWords] = useState<TDBNoteEntry[]>([]);
    const [search, setSearch] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [help, setHelp] = useState(false);
    const searchBarRef = useRef<HTMLInputElement>(null);

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
        <motion.div initial='hidden' animate='show' variants={itemVariants} className='mt-10 w-3/4 sm:w-[600px] bg-slate-800 rounded-4xl grid grid-cols-[auto_auto_1fr] items-center'>
            <span className='text-white ml-4 cursor-pointer hover:scale-115 rounded-full text-2xl' title='click for help' onClick={() => setHelp(!help)}>?</span>
            <Image src='/magnifyGlass.svg' alt='magnify glass icon' width={20} height={20} className='inline-block ml-2 mr-5' onClick={() => {searchBarRef?.current?.focus();}}></Image>
            <input className="text-white p-2 inline-block outline-0 rounded-r-4xl" ref={searchBarRef} type="text" name="search" placeholder='Search for words here...' value={search} onChange={(e) => { setSearch(e.target.value) }}/>
        </motion.div>
        {help &&
          <motion.div initial='hidden' animate='show' variants={containerVariants} className='bg-slate-800 w-3/4 sm:w-[600px] mt-5 rounded-3xl text-white'>
            <div className='flex justify-end bg-slate-950 rounded-t-2xl'>
              <span className='xBtn mr-4 py-1' onClick={() => setHelp(!help)}><b>x</b></span>
            </div>
            <motion.p variants={itemVariants} className='p-3'>
              This page should helps you review the words you have learned. So basically this page just stores learned words, like personal history.<br/><br/>
              From this page and this page only you can delete note permanently or return word to learning process. Both of those actions can be accomplished by opening the menu on menu icon and clicking on trash icon or &quot;learned words&quot;.  
            </motion.p>
          </motion.div>
        }
        {index === -1 && search != '' && <motion.p initial='hidden' animate='show' variants={{hidden: {opacity: 0, y: 10}, show: {opacity: 1, y: 0, transition: {duration: 1}}}} className='mt-3 rounded-full p-2 w-3/4 sm:w-[600px] text-center text-white bg-slate-800'>{'No word like that within your words'}</motion.p>}
        {(words && search != '' && index != -1) && <Note prop={words[index]} historyNote={true} handle={onSubmit}></Note>}
        {words && search === '' ? <Words props={words} historyNote={true} handle={onSubmit}></Words> : <></>}
        {words.length === 0 &&
        <motion.div initial='hidden' animate='show' variants={containerVariants} className="center bg-slate-800 w-3/4 sm:w-[600px] mt-60 rounded-4xl  p-2">
            <motion.h2 variants={itemVariants} className="text-center text-white"><b>Hmm, looks like you do not have any words in your history, time to learn!</b></motion.h2>
        </motion.div>
        }
        </>
    );
}