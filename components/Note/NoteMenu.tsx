import { motion } from "framer-motion";
import { containerVariants } from "@/lib/animationVariants";
import Link from "next/link";
import { FolderMinus, NotebookPen } from "lucide-react";
import { TokenContext } from "../TokenContextProvider";
import { useContext, useState } from "react";
import { removeWordFromDrawer } from "@/actions/manageNotes/manageDrawers";

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
  const tokenContext = useContext(TokenContext);

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
        className="text-center w-full hover:text-main cursor-pointer transition-all text-second"
      >
        <NotebookPen width={25} height={25} />
      </Link>
      {drawerId != -1 && (
        <span
          className="text-second cursor-pointer w-full text-center"
          title="Remove from drawer"
          onClick={(e) => {
            e.stopPropagation();
            setIsRemoving(true);
            removeWordFromDrawer(
              tokenContext?.accessToken || "",
              drawerId,
              noteId
            );
            rerenderParent();
          }}
        >
          <FolderMinus
            className={
              "hover:text-main transition-all mt-2 " +
              (isRemoving ? " animate-spin" : "")
            }
          />
        </span>
      )}
    </motion.div>
  );
}
