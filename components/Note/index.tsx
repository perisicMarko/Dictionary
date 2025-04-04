"use client";
import DisplayNotes from '../shared/DisplayNotes';
import HistoryNoteMenu from './HistoryNoteMenu';
import { TDBNoteEntry } from "@/lib/types";
import AudioPlayer from "../shared/AudioPlayer";
import { useState, useRef, useContext } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { TokenContext } from "../TokenContextProvider";

export default function Note({
  prop,
  historyNote,
  handle,
}: {
  prop: TDBNoteEntry;
  historyNote: boolean;
  handle: () => void;
}) {
  const [drop, setDrop] = useState(false);
  const [menu, setMenu] = useState(false);
  const title = drop ? "Click to collapse." : "Click for notes.";
  const containerRef = useRef(null);
  const tokenContext = useContext(TokenContext);
  const note = prop;

  function toggleMenu(){
    setMenu(!menu);
  }

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      ref={containerRef}
      className="relative bg-slate-800 w-3/4 sm:w-[600px] max-h-[720px] sm:max-h-[800px] rounded-4xl mt-8 p-7"
      title={title}
      onClick={() => {
        setMenu(false);
        setDrop(!drop);
      }}
    >
      <div className="absolute flex flex-col items-center justify-center top-5 right-0 rounded-2xl w-1/6">
        {historyNote && (
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
        )}
        {menu && historyNote && (
          <HistoryNoteMenu actionCallBack={handle} accessToken={tokenContext?.accessToken} toggleMenu={toggleMenu} noteId={note.id} />
        )}
      </div>

      <h2 className="text-white mb-3" title="word">
        <b>{note.word}</b>
      </h2>
      <div className="flex flex-col justify-center items-center space-y-2">
        <AudioPlayer src={note.audio}></AudioPlayer>
        <button
          className="primaryBtn"
          onClick={() => {
            setDrop(!drop);
            setMenu(false);
          }}
        >
          Show notes
          <Image
            src={drop ? "/arrowUp.svg" : "/arrowDown.svg"}
            alt="arrow icon"
            width={20}
            height={20}
            className="ml-3 inline-block w-auto h-auto"
          ></Image>
        </button>
      </div>
      {drop && (
        <DisplayNotes userNotes={note.user_notes} generatedNotes={note.generated_notes} recallNoteType={false}/>
      )}
    </motion.div>
  );
}
