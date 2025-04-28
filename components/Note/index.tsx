"use client";
import DisplayNotes from "../shared/DisplayNotes";
import HistoryNoteMenu from "./HistoryNoteMenu";
import { TDBNoteEntry } from "@/lib/types";
import AudioPlayer from "../shared/AudioPlayer";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import NoteMenu from "./NoteMenu";
import { ChevronDown, ChevronUp, Menu } from "lucide-react";

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
  const note = prop;

  function toggleMenu() {
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
      <div className="absolute flex flex-col items-center top-5 right-0 rounded-2xl w-[100px]">
        <Menu
          color="white"
          width={30}
          height={30}
          className="scale-75 hover:scale-90 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setMenu(!menu);
          }}
        />

        {menu && historyNote && (
          <HistoryNoteMenu
            actionCallBack={handle}
            toggleMenu={toggleMenu}
            noteId={note.id}
          />
        )}
        {menu && !historyNote && <NoteMenu noteId={note.id} />}
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
          {drop ? (
            <ChevronUp
              color="white"
              width={20}
              height={20}
              className="ml-3 inline-block w-auto h-auto"
            />
          ) : (
            <ChevronDown
              color="white"
              width={20}
              height={20}
              className="ml-3 inline-block w-auto h-auto"
            />
          )}
        </button>
      </div>
      {drop && (
        <DisplayNotes
          userNotes={note.user_notes}
          generatedNotes={note.generated_notes}
          recallNoteType={false}
        />
      )}
    </motion.div>
  );
}
