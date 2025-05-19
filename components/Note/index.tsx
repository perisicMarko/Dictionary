"use client";
import DisplayNotes from "../common/DisplayNotes";
import HistoryNoteMenu from "./HistoryNoteMenu";
import { TDBNoteEntry } from "@/lib/types";
import AudioPlayer from "../common/AudioPlayer";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import NoteMenu from "./NoteMenu";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import { containerVariants } from "@/lib/animationVariants";

export default function Note({
  prop,
  historyNote,
  drawerId,
  rerenderParent,
}: {
  prop: TDBNoteEntry;
  historyNote: boolean;
  drawerId: number;
  rerenderParent: () => void;
}) {
  const [drop, setDrop] = useState(false);
  const [menu, setMenu] = useState(false);
  const containerTitle = drop ? "Click to close notes" : "Click to show notes";
  const containerRef = useRef(null);
  const note = prop;

  function toggleMenu() {
    setMenu(!menu);
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      ref={containerRef}
      className="relative box-layout max-h-[720px] sm:max-h-[800px] mt-8 !p-7"
      title={containerTitle}
      onClick={() => {
        setMenu(false);
        setDrop(!drop);
      }}
    >
      <div className="absolute flex flex-col items-center top-5 right-0 rounded-2xl w-[100px]" title='Menu'>
        {menu ? (
          <X
            color="white"
            width={25}
            height={25}
            className="btn"
            onClick={(e) => {
              e.stopPropagation();
              setMenu(!menu);
            }}
          />
        ) : (
          <Menu
            color="white"
            width={25}
            height={25}
            className="btn"
            onClick={(e) => {
              e.stopPropagation();
              setMenu(!menu);
            }}
          />
        )}

        {menu &&
          (historyNote ? (
            <HistoryNoteMenu
              rerenderParent={rerenderParent}
              toggleMenu={toggleMenu}
              noteId={note.id}
            />
          ) : (
            <NoteMenu
              noteId={note.id}
              drawerId={drawerId}
              rerenderParent={rerenderParent}
            />
          ))}
      </div>

      <h2 className="text-white mb-3 select-none" title="word">
        <b>{note.word}</b>
      </h2>
      <div className="center-vertically space-y-2 ">
        <AudioPlayer src={note.audio} />
        <button
          className="primary-btn"
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
