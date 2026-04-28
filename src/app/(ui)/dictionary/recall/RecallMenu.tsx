import Link from "next/link";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/shared/lib/animationVariants";
import { useRouter } from "next/navigation";
import { setAsLearned } from "@/features/notes/application";
import { useContext } from "react";
import { NotebookPen, Trash2 } from "lucide-react";
import { useState } from "react";

export default function RecallNoteMenu({
  toggleMenu,
  changeQuality,
  showNotes,
  noteId,
  rerenderParent,
}: {
  toggleMenu: () => void;
  changeQuality: (e: number) => void;
  showNotes: boolean;
  noteId: number;
  rerenderParent: () => void;
}) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);

  async function onSubmitDeleteHandle() {
    const response = await setAsLearned(
      noteId,
      true,
    );
    if (!response.success) {
      router.push("/login");
    }
    rerenderParent();
  }
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="bg-white/80 center-vertically pointer-events-auto z-10 left-2 gap-1 rounded-2xl"
    >
      <motion.form
        variants={itemVariants}
        className="center w-full px-2 pt-1 mb-1"
        action={() => {
          onSubmitDeleteHandle();
        }}
      >
        <input type="text" name="noteId" defaultValue={Number(noteId)} hidden />
        <button
          type="submit"
          className="text-text-second"
          onClick={(e) => {
            e.stopPropagation();
            setIsRemoving(true);
          }}
          title="Mark note as learned"
        >
          <Trash2
            className={
              "hover:text-text-main cursor-pointer transition-all " +
              (isRemoving ? "animate-spin" : "")
            }
          />
        </button>
      </motion.form>
      <motion.span variants={itemVariants} className="w-full px-2">
        <Link
          href={"/dictionary/recall/edit/" + noteId}
          onClick={() => toggleMenu()}
          className="text-text-second"
          title="Edit note"
        >
          <NotebookPen className="hover:text-text-main cursor-pointer transition-all" />
        </Link>
      </motion.span>
      {!showNotes ? ( // if notes are not displayed, put N in menu, otherwise put G in menu, good for ux
        <motion.span
          variants={itemVariants}
          className="block text-text-second hover:text-text-main cursor-pointer text-center transition-color w-full pb-1"
          onClick={() => {
            changeQuality(6);
            toggleMenu();
          }}
          title="Show notes"
        >
          <b>N</b>
        </motion.span>
      ) : (
        <motion.span
          variants={itemVariants}
          className="block hover:text-text-main text-text-second cursor-pointer text-center transition-color w-full pb-1"
          onClick={() => {
            changeQuality(-1);
            toggleMenu();
          }}
          title="Grade recall"
        >
          <b>G</b>
        </motion.span>
      )}
    </motion.div>
  );
}
