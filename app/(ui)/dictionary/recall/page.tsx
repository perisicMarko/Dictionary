"use client";
import RecallNoteHelp from "@/app/(ui)/dictionary/recall/Help";
import { getRecallNotes } from "@/actions/manageNotes";
import { useState, useContext, useLayoutEffect } from "react";
import { TDBNoteEntry } from "@/lib/types";
import RecallNote from "@/app/(ui)/dictionary/recall/RecallNote";
import { TokenContext } from "@/components/TokenContextProvider";
import ZeroNotesMessage from "@/components/ZeroNotesMessage";
import Loading from "../../loading";

export default function Page() {
  const [words, setWords] = useState<TDBNoteEntry[] | undefined>();
  const [refresh, setRefresh] = useState(false);
  const tokenContext = useContext(TokenContext);

  useLayoutEffect(() => {
    async function fetchNotes() {
      const data = await getRecallNotes(tokenContext?.accessToken || "");
      setWords(data);
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
              rerenderHandle={onGradeSubmit}
            ></RecallNote>
          );
        })
      ) : (
        <ZeroNotesMessage
          message={
            "Hmm, looks like you don't have any words to recall for today. Keep up the good work!"
          }
        />
      )}
    </>
  );
}
