"use client";
import { GradeForm } from "./GradeForm";
import RecallMenu from "./RecallMenu";
import { TNoteApp } from "@/lib/types";
import AudioPlayer from "../../../../components/common/AudioPlayer";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import DisplayNotes from "@/components/common/DisplayNotes";
import { containerVariants } from "@/lib/animationVariants";

export default function RecallNote({
  note,
  rerenderParent,
}: {
  note: TNoteApp;
  rerenderParent: () => void;
}) {
  const [menu, setMenu] = useState(false);
  const [quality, setQuality] = useState(-1);

  function toggleMenu() {
    setMenu(!menu);
  }

  function changeQuality(quality: number) {
    setQuality(quality);
  }

  return (
    <motion.div
      layout
      initial="hidden"
      animate="show"
      variants={containerVariants}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      className="relative max-h-[800px] mt-8 box-layout !p-7 center-vertically"
      onClick={() => {
        setMenu(false);
      }}
    >
      <div
        className="absolute right-0 top-5 flex flex-col items-center rounded-2xl w-[100px]"
        title="Menu"
      >
        {menu ? (
          <X
            color="white"
            className="btn"
            width={25}
            height={25}
            onClick={(e) => {
              e.stopPropagation();
              setMenu(!menu);
            }}
          />
        ) : (
          <Menu
            color="white"
            className="btn"
            width={25}
            height={25}
            onClick={(e) => {
              e.stopPropagation();
              setMenu(!menu);
            }}
          />
        )}
        {menu && (
          <RecallMenu
            toggleMenu={toggleMenu}
            changeQuality={changeQuality}
            noteId={note.id}
            rerenderParent={rerenderParent}
          />
        )}
      </div>
      <h2 className="select-none text-white text-start w-full" title="Word">
        <b>{note.dictionary_words.word}</b>
      </h2>
      {quality === 6 ? (
        <>
          <AudioPlayer src={note.dictionary_words.audio}></AudioPlayer>
          <motion.div
            initial={{
              y: 15,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            className="p-1 h-[300px] xl:h-[400px] overflow-auto"
          >
            <h2 className="mt-2 text-second">
              <b>Your notes:</b>
            </h2>
            <p className={`white-spaces text-second ${(note.user_notes === "" ? "opacity-60 text-center" : "")}`}>
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
        </>
      ) : (
        <GradeForm
          toggleMenu={toggleMenu}
          changeQuality={changeQuality}
          noteId={note.id}
          quality={quality}
          rerenderParent={rerenderParent}
        />
      )}
    </motion.div>
  );
}
