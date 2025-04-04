"use client";
import RecallNoteHelp from "@/components/RecallNote/Help";
import { getRecallNotes } from "@/actions/manageNotes";
import { useState, useEffect, useContext } from "react";
import { TDBNoteEntry } from "@/lib/types";
import RecallNote from "@/components/RecallNote";
import { TokenContext } from "@/components/TokenContextProvider";
import ZeroNotesMessage from "@/components/shared/ZeroNotesMessage";

export default function Page() {
  const [words, setWords] = useState<TDBNoteEntry[] | undefined>();
  const [refresh, setRefresh] = useState(false);
  const [help, setHelp] = useState<boolean>(false);
  const tokenContext = useContext(TokenContext);

  useEffect(() => {
    async function fetchNotes() {
      const data = await getRecallNotes(tokenContext?.accessToken || "");
      setWords(data);
    }
    fetchNotes();
  }, [refresh, tokenContext?.accessToken]);

  function onGradeSubmit() {
    setRefresh(!refresh);
  }

  function toggleHelp() {
    setHelp(!help);
  }

  return (
    <>
      <RecallNoteHelp toggleHelp={toggleHelp} help={help} />

      {words && words.length > 0 ? (
        words?.map((w: TDBNoteEntry) => {
          return (
            <RecallNote key={w.id} note={w} rerenderHandle={onGradeSubmit}></RecallNote>
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
