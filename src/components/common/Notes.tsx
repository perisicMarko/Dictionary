"use client"

import Note from "@/components/Note";
import { TNoteApp } from "@/shared/types";
import { AnimatePresence, motion } from "framer-motion";

export default function Notes({
  notes,
  isHistoryNote,
  drawerId,
  onRemoveNote,
}: {
  notes: TNoteApp[];
  isHistoryNote: boolean;
  drawerId: number;
  onRemoveNote?: (noteId: number) => void;
}) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {notes.map((w: TNoteApp) => {
        return (
          <motion.div
            key={w.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(2px)" }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <Note
              note={w}
              isHistoryNote={isHistoryNote}
              drawerId={drawerId}
              onRemoved={() => onRemoveNote?.(w.id)}
            ></Note>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}
