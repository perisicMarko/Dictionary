'use client'
import { TDBNoteEntry } from '@/lib/types';
import AudioPlayer from "./AudioPlayer";
import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { backToRecallSystem, deleteNote } from '@/actions/manageNotes';


export default function Note({prop, historyNote, handle} : {prop : TDBNoteEntry, historyNote : boolean, handle : () => void}){

    const [drop, setDrop] = useState(false);
    const [menu, setMenu] = useState(false);
    const title = (drop ? 'Click to collapse.' : 'Click for notes.');
    const containerRef = useRef(null);

    const isInView = useInView(containerRef, {once: true});
    const mainControls = useAnimation();
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    });

    const noteValue = useTransform(scrollYProgress, [0, 1], ["-100%", "0%"]);
    const note = prop;

    useEffect(() => {
        if(isInView){
            mainControls.start("visible")
        }
    }, [isInView]);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
          },
        },
      };
    
    const itemVariants = {
        hidden: { opacity: 0, y: -15 },
        show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    };

    return (
        <motion.div  
        initial={{ x: -100, opacity: 0 }} 
        animate={{x: 0, opacity: 1}}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{translateX: noteValue}} ref={containerRef} 
        className="relative bg-slate-800 w-3/4 sm:w-[600px] max-h-[720px] sm:max-h-[800px] rounded-4xl mt-8 p-7 overflow-auto" title={title} onClick={() => setDrop(!drop)}>
            <div className="absolute right-0 top-5 rounded-2xl w-[55px] h-[110px]">
                {historyNote && <Image className="justify-self-end scale-75 hover:scale-90 ml-1 cursor-pointer" title='options' src='/menu.svg' width={30} height={30} alt='menu icon' onClick={(e) => {e.stopPropagation(); setMenu(!menu);}}></Image>}
                {menu && historyNote && 
                <motion.div initial='hidden' animate='show' variants={containerVariants} className='absolute bg-white/80 z-10 mr-10 rounded-2xl p-1'>
                    <motion.form variants={itemVariants} className="center" action={async (e) => {setMenu(!menu); await deleteNote(e); handle();}}>
                        <input type="text" name='noteId' defaultValue={note.id} hidden/>
                        <button type='submit' onClick={(e) => e.stopPropagation()}><Image className="scale-75 hover:scale-90 cursor-pointer" title='delete note' src='/delete.svg' width={30} height={30} alt='delete icon'></Image></button>
                    </motion.form>
                    <motion.form variants={itemVariants} className="center" action={async (e) => {setMenu(!menu); await backToRecallSystem(e); handle();}}>
                        <input type="text" name='noteId' defaultValue={note.id} hidden/>
                        <button type='submit' className='text-center text-xs text-slate-800 cursor-pointer hover:scale-110' onClick={(e) => e.stopPropagation()}>learn again</button>
                    </motion.form>
                </motion.div>
                }
            </div>
                
            <h1 className="text-white mb-3" title="word"><b>{note.word}</b></h1>
            <div className="flex flex-col justify-center items-center space-y-2">
                <AudioPlayer src={note.audio}></AudioPlayer>
                <button className="primaryBtn" onClick={() => setDrop(!drop)}>Show notes<Image src={drop ? '/arrowUp.svg' : '/arrowDown.svg'} alt='arrow icon' width={20} height={20} className='ml-3 inline-block'></Image></button>
            </div>
            {drop && 
            <motion.div initial={{y:15, opacity: 0}} animate={{y: 0, opacity: 1}} className='p-4'>
                <h2 className='mt-2 text-blue-400'><b>Your notes:</b></h2>
                <p className="whiteSpaces text-blue-300">{note.user_notes ? note.user_notes : 'You have not inserted yor notes.'}</p> 
                <h2 className="mt-2 text-blue-400"><b>Generated notes:</b></h2>
                <p className="whiteSpaces text-blue-300">{note.generated_notes}</p>
            </motion.div>
            }
        </motion.div>
    );
}