"use client";
import { GradeRecallForm } from "./GradeRecallForm";
import RecallMenu from "./RecallMenu";
import { TNoteApp } from "@/shared/types";
import AudioPlayer from "@/reusableComponents/AudioPlayer";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import DisplayNotes from "@/features/notes/ui/DisplayNotes";

export default function RecallNote({
  note,
  onGraded,
}: {
  note: TNoteApp;
  onGraded?: () => void;
}) {
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const [isShowNotes, setIsShowNotes] = useState(false);

  function toggleMenu() {
    setIsMenuOpened((prev) => !prev);
  }

  function toggleShowNotes() {
    setIsShowNotes((prev) => !prev);
  }

  return (
    <div
      className="relative max-h-200 mt-8 box-layout p-6! center-vertically"
      onClick={() => {
        setIsMenuOpened(false);
      }}
    >
      <div
        className="absolute right-0 top-5 flex flex-col items-center rounded-2xl w-25"
        title="Menu"
      >
        <button
          type="button"
          aria-label={isMenuOpened ? "Close recall note menu" : "Open recall note menu"}
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpened((prev) => !prev);
          }}
        >
          {isMenuOpened ? <X color="white" className="btn" width={25} height={25} /> : <Menu color="white" className="btn" width={25} height={25} />}
        </button>

        {isMenuOpened && (
          <RecallMenu
            toggleMenu={toggleMenu}
            showNotes={isShowNotes}
            toggleShowNotes={toggleShowNotes}
            noteId={note.id}
            onCompleted={onGraded}
          />
        )}
      </div>

      <h2 className="select-none text-text-main text-start w-full" title="Word">
        <b>{note.dictionary_words.word}</b>
      </h2>
      {isShowNotes ? (
        <>
          <AudioPlayer src={note.dictionary_words.audio}></AudioPlayer>
          <div className="p-1 h-75 xl:h-100 overflow-auto enter-fade-up enter-delay-1 w-full">
            <h2 className="my-2 text-text-main">
              <b>Your notes:</b>
            </h2>
            <p
              className={`white-spaces text-text-second ${note.user_notes === "" ? "opacity-60 text-center" : ""
                }`}
            >
              {note.user_notes != ""
                ? note.user_notes
                : "No your notes for this word."}
            </p>
            <h2 className="mt-2 text-text-main">
              <b>Generated notes:</b>
            </h2>
            <DisplayNotes
              word={note.dictionary_words.word}
              meanings={note.dictionary_words.meanings}
              includeWord={false}
            />
          </div>
        </>
      ) : (
        <GradeRecallForm
          toggleMenu={toggleMenu}
          noteId={note.id}
          onGraded={onGraded}
        />
      )}
    </div>
  );
}
