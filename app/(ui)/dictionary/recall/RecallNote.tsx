"use client";
import { GradeForm } from './GradeForm';
import RecallMenu from './RecallMenu';
import { TDBNoteEntry } from "@/lib/types";
import AudioPlayer from "../../../../components/AudioPlayer";
import { useState } from "react";
import { Menu } from 'lucide-react';
import { motion } from "framer-motion";
import DisplayNotes from '@/components/DisplayNotes';
import { containerVariants } from '@/lib/animationVariants';


export default function RecallNote({
  note,
  rerenderHandle,
}: {
  note: TDBNoteEntry;
  rerenderHandle: () => void;
}) {
  const [menu, setMenu] = useState(false);
  const [quality, setQuality] = useState(-1);

  function toggleMenu(){
    setMenu(!menu);
  }

  function changeQuality(quality: number){
    setQuality(quality);
  }

  return (
    <motion.div
      initial='hidden'
      animate='show'
      variants={containerVariants}
      className="bg-slate-800 relative w-3/4 sm:w-[600px] max-h-[800px] rounded-4xl mt-8 p-7"
      onClick={() => {
        setMenu(false);
      }}
    >
      <div className="absolute right-0 top-5 flex flex-col items-center rounded-2xl w-[100px] ">
        <Menu
          color='white'
          className="scale-75 hover:scale-90 cursor-pointer"
          width={30}
          height={30}
          onClick={(e) => {
            e.stopPropagation();
            setMenu(!menu);
          }}
        />
        {menu && (
          <RecallMenu toggleMenu={toggleMenu} changeQuality={changeQuality} noteId={note.id} rerenderHandle={rerenderHandle} />
        )}
      </div>
      <span className=" text-white" title="word">
        <b>{note.word}</b>
      </span>

      {quality === 6 ? (
        <>
          <AudioPlayer src={note.audio}></AudioPlayer>
          <DisplayNotes userNotes={note.user_notes} generatedNotes={note.generated_notes} recallNoteType={true} />
        </>
      ) : (
        <GradeForm 
        toggleMenu={toggleMenu} 
        changeQuality={changeQuality} 
        noteId={note.id} 
        quality={quality} 
        rerenderHandle={rerenderHandle}
        />
      )}
    </motion.div>
  );
}