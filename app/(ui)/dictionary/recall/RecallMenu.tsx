import Link from "next/link";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { useRouter } from "next/navigation";
import { setAsLearned } from "@/actions/manageNotes";
import { TokenContext } from "../../../../components/TokenContextProvider";
import { useContext } from "react";
import { NotebookPen, Trash2 } from "lucide-react";

export default function RecallNoteMenu({
  toggleMenu,
  changeQuality,
  noteId,
  rerenderParent,
}: {
  toggleMenu: () => void;
  changeQuality: (e: number) => void;
  noteId: number;
  rerenderParent: () => void;
}) {
  const router = useRouter();
  const tokenContext = useContext(TokenContext);

  async function onSubmitDeleteHandle() {
    if (tokenContext?.accessToken === undefined) return;
    const response = await setAsLearned(
      noteId,
      true,
      tokenContext?.accessToken
    );
    if (!response?.status) {
      tokenContext.setAccessToken("");
      router.push("/logIn");
    } else if (response.status === 201)
      tokenContext.setAccessToken(response.accessToken || "");

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
        <button type="submit" className="text-second" onClick={(e) => e.stopPropagation()} title='Mark note as learned'>
          <Trash2 className="hover:text-main cursor-pointer transition-all"/>
        </button>
      </motion.form>

      <motion.span variants={itemVariants} className="w-full px-2">
        <Link
          href={"/dictionary/recall/edit/" + noteId}
          onClick={() => toggleMenu()}
          className="text-second"
          title='Edit note'
        >
          <NotebookPen
            className="hover:text-main cursor-pointer transition-all"
          />
        </Link>
      </motion.span>
      <motion.span
        variants={itemVariants}
        className="block text-second hover:text-main cursor-pointer text-center transition-color w-full"
        onClick={() => {
          changeQuality(6);
          toggleMenu();
        }}
        title="Show notes"
      >
        <b>N</b>
      </motion.span>
      <motion.span
        variants={itemVariants}
        className="block hover:text-main text-second cursor-pointer text-center transition-color w-full pb-1"
        onClick={() => {
          changeQuality(-1);
          toggleMenu();
        }}
        title="Grade recall"
      >
        <b>G</b>
      </motion.span>
    </motion.div>
  );
}
