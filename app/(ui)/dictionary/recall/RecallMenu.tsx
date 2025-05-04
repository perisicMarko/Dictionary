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
  rerenderHandle,
}: {
  toggleMenu: () => void;
  changeQuality: (e: number) => void;
  noteId: number;
  rerenderHandle: () => void;
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

    rerenderHandle(); //rerendering parent
  }
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="bg-white/80 flex flex-col items-center justify-center pointer-events-auto z-10 left-2 gap-1 rounded-2xl p-2"
    >
      <motion.form
        variants={itemVariants}
        className="center"
        action={() => {
          onSubmitDeleteHandle();
        }}
      >
        <input type="text" name="noteId" defaultValue={noteId} hidden />
        <button type="submit" onClick={(e) => e.stopPropagation()} title='mark note as learned'>
          <Trash2 color="#1E293B" className="hover:scale-105 cursor-pointer"/>
        </button>
      </motion.form>

      <motion.span variants={itemVariants}>
        <Link
          href={"/dictionary/recall/edit/" + noteId}
          onClick={() => toggleMenu()}
          title='edit note'
        >
          <NotebookPen
            color="#1E293B"
            className="hover:scale-105 cursor-pointer"
          />
        </Link>
      </motion.span>
      <motion.span
        variants={itemVariants}
        className=" block hover:scale-105 text-slate-800 cursor-pointer"
        onClick={() => {
          changeQuality(6);
          toggleMenu();
        }}
        title="show notes"
      >
        <b>N</b>
      </motion.span>
      <motion.span
        variants={itemVariants}
        className="block hover:scale-105 text-slate-800 cursor-pointer text-center"
        onClick={() => {
          changeQuality(-1);
          toggleMenu();
        }}
        title="grade recall"
      >
        <b>G</b>
      </motion.span>
    </motion.div>
  );
}
