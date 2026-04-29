"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { setAsLearned } from "@/features/notes/application";
import { NotebookPen, Trash2 } from "lucide-react";
import { useTransition } from "react";

export default function RecallMenu({
  toggleMenu,
  toggleShowNotes,
  showNotes,
  noteId,
}: {
  toggleMenu: () => void;
  toggleShowNotes: () => void;
  showNotes: boolean;
  noteId: number;
}) {
  const router = useRouter();
  const [isRemoving, startRemoving] = useTransition();

  async function onSubmitDeleteHandle() {
    const response = await setAsLearned(noteId, true);

    if (!response.success) {
      router.push("/login");
      return;
    }

    router.refresh();
  }

  return (
    <div className="bg-white/80 center-vertically pointer-events-auto z-10 left-2 gap-1 rounded-2xl enter-fade-up">
      <div className="center w-full px-2 pt-1 mb-1">
        <button
          type="button"
          className="text-text-second"
          onClick={(e) => {
            e.stopPropagation();
            startRemoving(async () => {
              await onSubmitDeleteHandle();
            });
          }}
          title="Mark note as learned"
          disabled={isRemoving}
        >
          <Trash2
            className={
              "hover:text-text-main cursor-pointer transition-all " +
              (isRemoving ? "animate-spin" : "")
            }
          />
        </button>
      </div>
      <div className="w-full px-2">
        <Link
          href={"/dictionary/recall/edit/" + noteId}
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu();
          }}
          className="text-text-second"
          title="Edit note"
        >
          <NotebookPen className="hover:text-text-main cursor-pointer transition-all" />
        </Link>
      </div>
      {!showNotes ? ( // if notes are not displayed, put N in menu, otherwise put G in menu, good for ux
        <button
          type="button"
          className="block text-text-second hover:text-text-main cursor-pointer text-center transition-colors w-full pb-1"
          onClick={(e) => {
            e.stopPropagation();
            toggleShowNotes();
            toggleMenu();
          }}
          title="Show notes"
          aria-label="Show notes"
        >
          <b>N</b>
        </button>
      ) : (
        <button
          type="button"
          className="block hover:text-text-main text-text-second cursor-pointer text-center transition-colors w-full pb-1"
          onClick={(e) => {
            e.stopPropagation();
            toggleShowNotes();
            toggleMenu();
          }}
          title="Grade recall"
          aria-label="Show grading"
        >
          <b>G</b>
        </button>
      )}
    </div>
  );
}
