"use client";
import { GradeForm } from './GradeForm';
import Menu from './Menu';
import { TDBNoteEntry } from "@/lib/types";
import AudioPlayer from "../shared/AudioPlayer";
import { useState, useContext } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { TokenContext } from "../TokenContextProvider";
import DisplayNotes from '@/components/shared/DisplayNotes';

export default function RecallNote({
  note,
  rerenderHandle,
}: {
  note: TDBNoteEntry;
  rerenderHandle: () => void;
}) {
  const [menu, setMenu] = useState(false);
  const [quality, setQuality] = useState(-1);
  const tokenContext = useContext(TokenContext);

  function toggleMenu(){
    setMenu(!menu);
  }

  function changeQuality(quality: number){
    setQuality(quality);
  }

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-slate-800 relative w-3/4 sm:w-[600px] max-h-[800px] rounded-4xl mt-8 p-7"
      onClick={() => {
        setMenu(false);
      }}
    >
      <div className="absolute right-0 top-5 flex flex-col items-center rounded-2xl w-[55px] h-[110px]">
        <Image
          className="scale-75 hover:scale-90 cursor-pointer"
          title="options"
          src="/menu.svg"
          width={30}
          height={30}
          alt="menu icon"
          onClick={(e) => {
            e.stopPropagation();
            setMenu(!menu);
          }}
        ></Image>
        {menu && (
          <Menu toggleMenu={toggleMenu} changeQuality={changeQuality} noteId={note.id} rerenderHandle={rerenderHandle} accessToken={tokenContext?.accessToken} />
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
        accessToken={tokenContext?.accessToken} 
        rerenderHandle={rerenderHandle}
        />
      )}
    </motion.div>
  );
}