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
      className="bg-white/80 z-10 rounded-2xl p-2"
    >
      <Link
        href={"/dictionary/yourWords/edit/" + noteId}
        onClick={(e) => e.stopPropagation()}
        title="Edit notes"
      >
        <NotebookPen
          color="#1E293B"
          className="hover:scale-105 cursor-pointer"
        />
      </Link>
      {drawerId != -1 && (
        <span
          className="text-slate-800 cursor-pointer"
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
          <FolderMinus className={"hover:scale-105 mt-1 " + (isRemoving ? " animate-spin" : "")} />
        </span>
      )}
    </motion.div>
  );
}
