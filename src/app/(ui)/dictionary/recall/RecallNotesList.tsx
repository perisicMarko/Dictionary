"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TNoteApp } from "@/shared/types";
import RecallNote from "@/app/(ui)/dictionary/recall/RecallNote";

const EXIT_DURATION_MS = 220;

export default function RecallNotesList({
  initialNotes,
}: {
  initialNotes: TNoteApp[];
}) {
  const [notes, setNotes] = useState(initialNotes);
  const router = useRouter();

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  function handleNoteCompleted(noteId: number) {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));

    // Refresh after exit animation so updated server data stays in sync.
    setTimeout(() => {
      router.refresh();
    }, EXIT_DURATION_MS);
  }

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {notes.map((note) => (
        <motion.div
          key={note.id}
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, filter: "blur(2px)" }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="center"
        >
          <RecallNote note={note} onGraded={() => handleNoteCompleted(note.id)} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
