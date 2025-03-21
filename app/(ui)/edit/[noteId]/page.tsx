'use client'
import { editNote, getNoteById } from "@/actions/manageNotes";
import { TDBNoteEntry } from "@/lib/types";
import { useActionState, useEffect, useState } from "react";
import { motion } from 'framer-motion';

export default function Edit(){
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [state, action, isLoading] = useActionState(editNote, undefined);
    const [note, setNote] = useState<TDBNoteEntry>();

    useEffect(() => {
        const url = window.location.href;
        const start = url.lastIndexOf('/') + 1;
        
        const noteId = url.substring(start);
        async function getNote() {
            
            const n = await getNoteById(Number(noteId));
            setNote(n);
        }
        
        getNote();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.4,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
    };

    return (
        <motion.div initial='hidden' animate='show' variants={containerVariants} className="flex flex-col justify-center items-center mt-15 bg-slate-800 rounded-4xl xl:h-[800px] h-3/4 w-3/4 xl:w-[600px] p-5">
            <form className='rounded-2xl space-y-4 w-full p-4' action={action}>
                <motion.h2 variants={itemVariants} className="text-center hover:underline text-white"><b>Edit your notes here:</b></motion.h2>
                <input type="text" name="noteId" defaultValue={note?.id} hidden/>
                <input type="text" name="userId" defaultValue={note?.user_id} hidden/>
                <motion.div variants={itemVariants}>
                    <label htmlFor="userNotes" className="text-white">Your notes:</label>
                    <textarea name="userNotes" id="userNotes" defaultValue={note?.user_notes} className="bg-white rounded-2xl  xl:h-[180px] md:h-[220px] sm:h-[180px] h-[130px] block w-full p-2 mt-1 text-slate-800"></textarea>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                    <label htmlFor="generatedNotes" className="text-white">Generated notes:</label>
                    <textarea name="generatedNotes" id="generatedNotes" defaultValue={note?.generated_notes} className=" bg-white rounded-2xl xl:h-[375px] md:h-[250px] sm:h-[200px] h-[150px] block w-full p-2 mt-1 text-slate-800"></textarea>
                </motion.div>
                <motion.div initial={{opacity: 0, y: 50}} animate={{opacity: 1, y: 0, transition: {duration: 0.6}}} className="center sm:my-3">
                    <button className="primaryBtn">Edit</button>
                </motion.div>
            </form>
        </motion.div>
        
    );
}