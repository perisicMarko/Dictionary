"use client";
import RecallNoteHelp from "@/app/(ui)/dictionary/recall/Help";
import { getRecallNotes } from "@/actions/manageNotes";
import { useState, useContext, useEffect } from "react";
import { TNoteApp } from "@/lib/types";
import RecallNote from "@/app/(ui)/dictionary/recall/RecallNote";
import { TokenContext } from "@/components/TokenContextProvider";
import ZeroNotesMessage from "@/components/common/ZeroNotesMessage";
import Loading from "../../loading";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function Page() {
  const [words, setWords] = useState<TNoteApp[]>();
  const [refresh, setRefresh] = useState(false);
  const [parent] = useAutoAnimate();
  const tokenContext = useContext(TokenContext);

  useEffect(() => {
    async function fetchNotes() {
      const data = await getRecallNotes(tokenContext?.accessToken || "");
      setWords(data as TNoteApp[]);
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
        <div ref={parent} className="flex flex-col justify-center items-center">
          {words?.map((w: TNoteApp) => {
            return (
              <RecallNote
                key={w.id}
                note={w}
                rerenderParent={onGradeSubmit}
              ></RecallNote>
            );
          })}
        </div>
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
