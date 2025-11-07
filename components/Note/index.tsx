"use client";
import DisplayNotes from "../common/DisplayNotes";
import HistoryNoteMenu from "./HistoryNoteMenu";
import { TNoteApp } from "@/lib/types";
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
  prop: TNoteApp;
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
      layout
      initial="hidden"
      animate="show"
      variants={containerVariants}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      ref={containerRef}
      className="relative box-layout max-h-[720px] sm:max-h-[800px] mt-8"
      title={containerTitle}
      onClick={() => {
        setMenu(false);
        setDrop(!drop);
      }}
    >
      <div
        className="absolute flex flex-col items-center top-5 right-0 rounded-2xl w-[100px]"
        title="Menu"
      >
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

      <h2 className="text-white mb-3 select-none ml-2 mt-1" title="word">
        <b>{note.dictionary_words.word}</b>
      </h2>
      <div className="center-vertically space-y-2 ">
        <AudioPlayer src={note.dictionary_words.audio} />
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
        <motion.div
          initial={{
            y: 15,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          className="space-y-2 mt-2 justify-center overflow-auto items-center h-[200px] md:h-[250px] xl:h-[400px] p-1"
        >
          <h2 className="mt-2 text-second">
            <b>Your notes:</b>
          </h2>
          <p
            className={`white-spaces ${
              note.user_notes === ""
                ? "opacity-60 text-white text-center"
                : "text-second"
            }`}
          >
            {note.user_notes != ""
              ? note.user_notes
              : "No your notes for this word."}
          </p>
          <h2 className="mt-2 text-second">
            <b>Generated notes:</b>
          </h2>
          <DisplayNotes
            word={note.dictionary_words.word}
            meanings={note.dictionary_words.meanings}
            includeWord={false}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
