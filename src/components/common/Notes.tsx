"use client"

import Note from "@/components/Note";
import { TNoteApp } from "@/shared/types";
import { AnimatePresence } from "framer-motion";

export default function Notes({
  props,
  historyNote,
  drawerId,
}: {
  props: TNoteApp[] | undefined;
  historyNote: boolean;
  drawerId: number;
}) {
  return (
    <AnimatePresence mode="popLayout">
      {props?.map((w: TNoteApp) => {
        return (
          <Note
            key={w.id}
            note={w}
            isHistoryNote={historyNote}
            drawerId={drawerId}
          ></Note>
        );
      })}
    </AnimatePresence>
  );
}
