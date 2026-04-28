import { motion } from "framer-motion";
import { containerVariants } from "@/shared/lib/animationVariants";
import Link from "next/link";
import { FolderMinus, NotebookPen } from "lucide-react";
import { useState } from "react";
import { removeWordFromDrawer } from "@/features/drawers/application";

export default function NoteMenu({
  noteId,
  drawerId,
  rerenderParent,
}: {
  noteId: number;
  drawerId: number;
  rerenderParent: () => void;
}) {
  const [isRemoving, setIsRemoving] = useState(false);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="bg-white/80 z-10 rounded-2xl p-1.5"
    >
      <Link
        href={"/dictionary/yourWords/edit/" + noteId}
        onClick={(e) => e.stopPropagation()}
        title="Edit notes"
        className="text-center w-full hover:text-text-main cursor-pointer transition-all text-text-second"
      >
        <NotebookPen width={25} height={25} />
      </Link>
      {drawerId != -1 && (
        <span
          className="text-text-second cursor-pointer w-full text-center"
          title="Remove from drawer"
          onClick={(e) => {
            e.stopPropagation();
            setIsRemoving(true);
            removeWordFromDrawer(
              drawerId,
              noteId
            );
            rerenderParent();
          }}
        >
          <FolderMinus
            className={
              "hover:text-text-main transition-all mt-2 " +
              (isRemoving ? " animate-spin" : "")
            }
          />
        </span>
      )}
    </motion.div>
  );
}
