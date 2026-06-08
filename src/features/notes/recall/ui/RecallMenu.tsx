"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { setAsLearned } from "@/features/notes/recall/application";
import { Edit, Brain, Notebook, ChartColumn } from "lucide-react";
import { useTransition } from "react";

export default function RecallMenu({
  toggleMenu,
  toggleShowNotes,
  showNotes,
  noteId,
  onCompleted,
}: {
  toggleMenu: () => void;
  toggleShowNotes: () => void;
  showNotes: boolean;
  noteId: number;
  onCompleted?: () => void;
}) {
  const router = useRouter();
  const [isRemoving, startRemoving] = useTransition();

  async function onSubmitDeleteHandle() {
    const response = await setAsLearned(noteId, true);

    if (!response.success) {
      router.push("/login");
      return;
    }

    if (onCompleted) {
      onCompleted();
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
          <Brain className="relative hover:text-text-main cursor-pointer transition-all" />
        </button>
      </div>
      <div className="w-full px-2 mb-1">
        <Link
          href={"/notes/recall/edit/" + noteId}
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu();
          }}
          className="text-text-second"
          title="Edit note"
        >
          <Edit className="hover:text-text-main cursor-pointer transition-all" />
        </Link>
      </div>
      <button
        type="button"
        className="block text-text-second hover:text-text-main cursor-pointer center transition-colors w-full pb-1"
        onClick={(e) => {
          e.stopPropagation();
          toggleShowNotes();
          toggleMenu();
        }}
        title={!showNotes ? "Show notes" : "Grade recall"}
        aria-label={!showNotes ? "Show notes" : "Show grading"}
      >
        <b>{!showNotes ? <Notebook /> : <ChartColumn />}</b>
      </button>
    </div>
  );
}
