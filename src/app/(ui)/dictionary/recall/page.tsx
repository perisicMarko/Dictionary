"use client";
import RecallNoteHelp from "@/app/(ui)/dictionary/recall/Help";
import { getRecallNotes } from "@/features/notes/application";
import { useState, useContext, useEffect } from "react";
import { TNoteApp } from "@/lib/types";
import RecallNote from "@/app/(ui)/dictionary/recall/RecallNote";
import ZeroNotesMessage from "@/components/common/ZeroNotesMessage";
import Loading from "../../loading";
import { AnimatePresence } from "framer-motion";

export default function Page() {
  const [words, setWords] = useState<TNoteApp[]>();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function fetchNotes() {
      const data = await getRecallNotes();
      setWords(data as TNoteApp[]);
    }
    fetchNotes();
  }, [refresh]);

  function onGradeSubmit() {
    setRefresh(!refresh);
  }

  return (
    <>
      <RecallNoteHelp />
      {!words ? (
        <Loading />
      ) : words.length > 0 ? (
        <AnimatePresence mode="popLayout">
          {words?.map((w: TNoteApp) => {
            return (
              <RecallNote
                key={w.id}
                note={w}
                rerenderParent={onGradeSubmit}
              ></RecallNote>
            );
          })}
        </AnimatePresence>
      ) : (
        <ZeroNotesMessage
          message={
            "Great! You have no words to recall at the moment. Keep up the good work!"
          }
        />
      )}
    </>
  );
}
