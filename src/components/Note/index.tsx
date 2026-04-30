"use client";
import DisplayNotes from "../common/DisplayNotes";
import HistoryNoteMenu from "./HistoryNoteMenu";
import { TNoteApp } from "@/shared/types";
import AudioPlayer from "../common/AudioPlayer";
import { useState } from "react";
import NoteMenu from "./NoteMenu";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";

export default function Note({
  note,
  isHistoryNote,
  drawerId,
  onRemoved,
}: {
  note: TNoteApp;
  isHistoryNote: boolean;
  drawerId: number;
  onRemoved?: () => void;
}) {
  const [drop, setDrop] = useState(false);
  const [menu, setMenu] = useState(false);
  const containerTitle = drop ? "Notes are visible" : "Notes are hidden";

  function toggleMenu() {
    setMenu(!menu);
  }

  return (
    <div
      className="relative box-layout p-2 sm:p-2 md:p-5 max-h-[720px] sm:max-h-[800px] mt-8 enter-fade"
      title={containerTitle}
      onClick={() => {
        setMenu(false);
      }}
    >
      <div
        className="absolute flex flex-col items-center top-3 right-0 rounded-2xl w-[100px]"
        title="Menu"
      >
        <button
          type="button"
          aria-label={menu ? "Close note menu" : "Open note menu"}
          onClick={(e) => {
            e.stopPropagation();
            setMenu(!menu);
          }}
        >
          {menu ? <X color="white" width={25} height={25} className="btn" /> : <Menu color="white" width={25} height={25} className="btn" />}
        </button>

        {menu &&
          (isHistoryNote ? (
            <HistoryNoteMenu
              toggleMenu={toggleMenu}
              noteId={note.id}
            />
          ) : (
            <NoteMenu
              noteId={note.id}
              drawerId={drawerId}
              onRemoved={onRemoved}
            />
          ))}
      </div>

      <h2 className="text-text-main mb-3 select-none ml-2 mt-1" title="word">
        <b>{note.dictionary_words.word}</b>
      </h2>
      <div className="center-vertically space-y-2 ">
        <AudioPlayer src={note.dictionary_words.audio} />
        <button
          type="button"
          className="primary-btn"
          onClick={(e) => {
            e.stopPropagation();
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
        <div className="space-y-2 mt-2 justify-center overflow-auto items-center h-[200px] md:h-[250px] xl:h-[400px] p-1 enter-fade-up enter-delay-1">
          <h2 className="mt-2 text-text-second">
            <b>Your notes:</b>
          </h2>
          <p
            className={`white-spaces px-2 ${note.user_notes === ""
                ? "opacity-60 text-text-main text-center"
                : "text-text-second"
              }`}
          >
            {note.user_notes != ""
              ? note.user_notes
              : "No your notes for this word."}
          </p>
          <h2 className="mt-2 text-text-second">
            <b>Generated notes:</b>
          </h2>
          <DisplayNotes
            word={note.dictionary_words.word}
            meanings={note.dictionary_words.meanings}
            includeWord={false}
          />
        </div>
      )}
    </div>
  );
}
