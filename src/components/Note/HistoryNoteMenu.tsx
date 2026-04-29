"use client";

import { restoreNoteToRecallSystemById, deleteNote } from "@/features/notes/application";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export default function HistoryNoteMenu({
  toggleMenu,
  noteId,
}: {
  toggleMenu: () => void;
  noteId: number;
}) {
  const router = useRouter();
  const [isDeleting, startDelete] = useTransition();
  const [isRelearning, startRelearn] = useTransition();

  async function onSubmitRelearnHandle() {
    toggleMenu();
    const res = await restoreNoteToRecallSystemById(noteId);

    if (!res.success) {
      router.push("/login");
      return;
    }
    router.refresh();
  }

  async function onSubmitDeleteHandle() {
    toggleMenu();
    const res = await deleteNote(noteId);
  
    if (!res.success) {
      router.push("/login");
      return;
    }
    router.refresh();
  }

  return (
    <div className="bg-white/80 z-10 rounded-2xl enter-fade-up">
      <div className="center w-full px-2 pt-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            startDelete(async () => {
              await onSubmitDeleteHandle();
            });
          }}
          title="Delete note permanently"
          className={
            "hover:text-text-main text-text-second cursor-pointer transition-all w-full " +
            (isDeleting ? " animate-spin" : "")
          }
          disabled={isDeleting || isRelearning}
        >
          <Trash2 />
        </button>
      </div>
      <div className="center mt-3 px-2 mb-2 w-full">
        <button
          type="button"
          className={
            "text-center text-xs text-text-second cursor-pointer hover:text-text-main transition-all w-full " +
            (isRelearning ? " animate-spin" : "")
          }
          onClick={(e) => {
            e.stopPropagation();
            startRelearn(async () => {
              await onSubmitRelearnHandle();
            });
          }}
          title="Relearn word"
          disabled={isDeleting || isRelearning}
        >
          <b>R</b>
        </button>
      </div>
    </div>
  );
}
