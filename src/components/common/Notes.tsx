"use client"

import Note from "@/components/Note";
import { TNoteApp } from "@/shared/types";
import { AnimatePresence } from "framer-motion";

export default function Notes({
  notes,
  isHistoryNote,
  drawerId,
}: {
  notes: TNoteApp[];
  isHistoryNote: boolean;
  drawerId: number;
}) {
  return (
    <AnimatePresence mode="popLayout">
      {notes.map((w: TNoteApp) => {
        return (
          <Note
            key={w.id}
            note={w}
            isHistoryNote={isHistoryNote}
            drawerId={drawerId}
          ></Note>
        );
      })}
    </AnimatePresence>
  );
}
