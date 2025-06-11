"use client";
import RecallNoteHelp from "@/app/(ui)/dictionary/recall/Help";
import { getRecallNotes } from "@/actions/manageNotes";
import { useState, useContext, useEffect } from "react";
import { TDBNoteEntry } from "@/lib/types";
import RecallNote from "@/app/(ui)/dictionary/recall/RecallNote";
import { TokenContext } from "@/components/TokenContextProvider";
import ZeroNotesMessage from "@/components/common/ZeroNotesMessage";
import Loading from "../../loading";

export default function Page() {
  const [words, setWords] = useState<TDBNoteEntry[]>();
  const [refresh, setRefresh] = useState(false);
  const tokenContext = useContext(TokenContext);

  useEffect(() => {
    async function fetchNotes() {
      const data = await getRecallNotes(tokenContext?.accessToken || "");
      setWords(data as TDBNoteEntry[]);
    }
    fetchNotes();
  }, [refresh, tokenContext?.accessToken]);

  function onGradeSubmit() {
    setRefresh(!refresh);
  }

  return (
    <>
      <RecallNoteHelp />
      {!words ? (
        <Loading />
      ) : words.length > 0 ? (
        words?.map((w: TDBNoteEntry) => {
          return (
            <RecallNote
              key={w.id}
              note={w}
              rerenderParent={onGradeSubmit}
            ></RecallNote>
          );
        })
      ) : (
        <ZeroNotesMessage
          message={
            "Great! You have no words to recall right now. Keep up the good work!"
          }
        />
      )}
    </>
  );
}
