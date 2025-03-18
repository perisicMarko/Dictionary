'use client'
import { TDBNoteEntry } from '@/lib/types';
import AudioPlayer from "./AudioPlayer";
import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';


export default function Note(note : TDBNoteEntry){

    const [drop, setDrop] = useState(false);
    const title = (drop ? 'Click to collapse.' : 'Click for notes.');

    const containerRef = useRef(null);

    const isInView = useInView(containerRef, {once: true});
    const mainControls = useAnimation();
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    });

    const noteValue = useTransform(scrollYProgress, [0, 1], ["-100%", "0%"])

    useEffect(() => {
        if(isInView){
            mainControls.start("visible")
        }
    }, [isInView]);

    return (
        <motion.div  
        initial={{ x: -100, opacity: 0 }} 
        animate={{x: 0, opacity: 1}}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{translateX: noteValue}} ref={containerRef} 
        className="bg-slate-800 w-3/4 sm:w-[600px] max-h-[720px] sm:max-h-[800px] rounded-4xl mt-8 p-7 overflow-auto" title={title} onClick={() => setDrop(!drop)}>
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