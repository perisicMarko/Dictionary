"use client";
import { GradeForm } from "./GradeForm";
import RecallMenu from "./RecallMenu";
import { TDBNoteEntry } from "@/lib/types";
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
  note: TDBNoteEntry;
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
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="relative max-h-[800px] mt-8 box-layout !p-7 center-vertically"
      onClick={() => {
        setMenu(false);
      }}
    >
      <div className="absolute right-0 top-5 flex flex-col items-center rounded-2xl w-[100px] ">
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
        <b>{note.word}</b>
      </h2>
      {quality === 6 ? (
        <>
          <AudioPlayer src={note.audio}></AudioPlayer>
          <DisplayNotes
            userNotes={note.user_notes}
            generatedNotes={note.generated_notes}
            recallNoteType={true}
          />
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
