import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { backToRecallSystem, deleteNote } from "@/features/notes/application";
import { TokenContext } from "../TokenContextProvider";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function HistoryNoteMenu({
  rerenderParent,
  toggleMenu,
  noteId,
}: {
  rerenderParent: () => void;
  toggleMenu: () => void;
  noteId: number;
}) {
  const tokenContext = useContext(TokenContext);
  const router = useRouter();
  const [actionActive, setActionActive] = useState<{
    delete: boolean;
    relearn: boolean;
  }>({ delete: false, relearn: false });

  async function onSubmitRelearnHandle() {
    toggleMenu();
    if (tokenContext?.accessToken === undefined) return;
    const res = await backToRecallSystem(
      noteId,
      tokenContext?.accessToken || ""
    );

    if (!res?.success) {
      tokenContext.setAccessToken("");
      router.push("/logIn");
    } else if (res.status === 201)
      tokenContext.setAccessToken(res.accessToken || "");
    rerenderParent(); //rerendering parent
  }

  async function onSubmitDeleteHandle(formData: FormData) {
    toggleMenu();
    if (tokenContext?.accessToken === undefined) return;
    const res = await deleteNote(
      Number(formData.get("noteId")),
      tokenContext?.accessToken
    );

    if (!res?.success) {
      tokenContext.setAccessToken("");
      router.push("/logIn");
    } else if (res.status === 201)
      tokenContext.setAccessToken(res.accessToken || "");

    rerenderParent(); //rerendering parent
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="bg-white/80 z-10 rounded-2xl"
    >
      <motion.form
        variants={itemVariants}
        className="center w-full px-2 pt-2"
        action={onSubmitDeleteHandle}
      >
        <input type="text" name="noteId" defaultValue={noteId} hidden />
        <button
          type="submit"
          onClick={(e) => {
            e.stopPropagation();
            setActionActive({ ...actionActive, delete: true });
          }}
          title="Delete note permanently"
          className={
            "hover:text-text-main text-text-second cursor-pointer transition-all w-full " +
            (actionActive.delete ? " animate-spin" : "")
          }
        >
          <Trash2 />
        </button>
      </motion.form>
      <motion.form
        variants={itemVariants}
        className="center mt-3 px-2 mb-2 w-full"
        action={onSubmitRelearnHandle}
      >
        <input type="text" name="noteId" defaultValue={noteId} hidden />
        <button
          type="submit"
          className={
            "text-center text-xs text-text-second cursor-pointer hover:text-text-main transition-all w-full " +
            (actionActive.relearn ? " animate-spin" : "")
          }
          onClick={(e) => {
            e.stopPropagation();
            setActionActive({ ...actionActive, relearn: true });
          }}
          title="Relearn word"
        >
          <b>R</b>
        </button>
      </motion.form>
    </motion.div>
  );
}
