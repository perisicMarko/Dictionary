"use client";

import Link from "next/link";
import { FolderMinus, NotebookPen } from "lucide-react";
import { useTransition } from "react";
import { removeWordFromDrawer } from "@/features/drawers/application";
import { useRouter } from "next/navigation";

export default function NoteMenu({
  noteId,
  drawerId,
}: {
  noteId: number;
  drawerId: number;
}) {
  const [isRemoving, startRemoving] = useTransition();
  const router = useRouter();

  return (
    <div className="bg-white/80 z-10 rounded-2xl p-1.5 enter-fade-up">
      <Link
        href={"/dictionary/yourWords/edit/" + noteId}
        onClick={(e) => e.stopPropagation()}
        title="Edit notes"
        className="text-center w-full hover:text-text-main cursor-pointer transition-all text-text-second"
      >
        <NotebookPen width={25} height={25} />
      </Link>
      {drawerId != -1 && (
        <button
          type="button"
          className="text-text-second cursor-pointer w-full text-center"
          title="Remove from drawer"
          aria-label="Remove note from drawer"
          onClick={(e) => {
            e.stopPropagation();
            startRemoving(async () => {
              const res = await removeWordFromDrawer(drawerId, noteId);

              if(!res.success){
                router.push('/login');
              }

              router.refresh();
            });
          }}
          disabled={isRemoving}
        >
          <FolderMinus
            className={
              "hover:text-text-main transition-all mt-2 " +
              (isRemoving ? " animate-spin" : "")
            }
          />
        </button>
      )}
    </div>
  );
}
