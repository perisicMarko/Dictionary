"use client";
import { GradeForm } from "./GradeForm";
import RecallMenu from "./RecallMenu";
import { TDBNoteEntry } from "@/lib/types";
import AudioPlayer from "../../../../components/common/AudioPlayer";
import { useState } from "react";
import { Menu } from "lucide-react";
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
      className="relative max-h-[800px] mt-8 box-layout !p-7"
      onClick={() => {
        setMenu(false);
      }}
    >
      <div className="absolute right-0 top-5 flex flex-col items-center rounded-2xl w-[100px] ">
        <Menu
          color="white"
          className="scale-75 hover:scale-90 cursor-pointer"
          width={30}
          height={30}
          onClick={(e) => {
            e.stopPropagation();
            setMenu(!menu);
          }}
        />
        {menu && (
          <RecallMenu
            toggleMenu={toggleMenu}
            changeQuality={changeQuality}
            noteId={note.id}
            rerenderParent={rerenderParent}
          />
        )}
      </div>
      <span className="select-none text-white" title="word">
        <b>{note.word}</b>
      </span>

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
