'use client'
import { getRecallNotes } from "@/actions/manageNotes";
import { useState, useEffect } from 'react';
import { TDBNoteEntry } from "@/lib/types";
import RecallNote from '@/components/RecallNote';
import { motion } from 'framer-motion';


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

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };


    return (
        <>

        {!help && 
            <motion.div initial='hidden' animate='show' variants={{hidden: {opacity: 0, y: 10}, show: {opacity: 1, y: 0}}}
            className='center bg-slate-800 rounded-2xl w-3/4 sm:w-[600px] mt-10 px-3' 
            onClick={() => {setHelp(true);}}
            >
                <span className="block hover:scale-105 py-2 hover:underline cursor-pointer text-white text-center" ><u>Need help?</u></span>
            </motion.div>
        }
        {help &&
            <motion.div initial='hidden' animate='show' variants={itemVariants} className='bg-slate-800 w-3/4 sm:w-[600px] rounded-2xl mt-10'>
                <div className='rounded-t-2xl flex justify-end bg-slate-950'>
                    <span className="xBtn mr-3 text-white" onClick={() => {setHelp(false);}}><b>x</b></span>
                </div>
                <motion.p variants={itemVariants} className="p-2 text-white">
                    Here is where you recall words you have added, click on menu icon to open the menu.<br/>
                    There you have edit and delete icons, also &quot;notes&quot; for showing word notes and &quot;grade&quot; for returning to the grading ui.<br/>
                    Note that you will be informed via email when to enter the app to recall some words. Recall system is based on forgetting curve and spaced repetition algorithm.<br/>
                    Initially, a freshly added word is set to recall for the next day, then after 6 days. After first two repetitions each next is calculated based on how good you have graded your recall.<br/>
                    If you mark some word with grade below 3(0, 1, 2) repetition cycle will be returned to the beginning. <br/>
                    Also word is considered as learned when it has a big interval for recall(30+ days), but app will not get rid of those words for you, you can do it on delete button which marks word as learned and moves it to the history.<br/>
                </motion.p>
            </motion.div>
        }
        {words.length > 0 ?   
            words.map((w : TDBNoteEntry) => { 
                return <RecallNote key={w.id} note={w} handle={onSubmit} ></RecallNote>
            })
        :
        <motion.div initial='hidden' animate='show' variants={itemVariants} className="center bg-slate-800 mt-60 rounded-4xl b-2 p-2">
            <h1 className="text-center text-white w-3/4 sm:w-[600px]"><b>Hmm, looks like you do not have any words to recall for today, keep up the good work!</b></h1>
        </motion.div>
        }
        </>
    );
}