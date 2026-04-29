import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/shared/lib/animationVariants";
import { backToRecallSystem, deleteNote } from "@/features/notes/application";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function HistoryNoteMenu({
  toggleMenu,
  noteId,
}: {
  toggleMenu: () => void;
  noteId: number;
}) {
  const router = useRouter();
  const [actionActive, setActionActive] = useState<{
    delete: boolean;
    relearn: boolean;
  }>({ delete: false, relearn: false });

  async function onSubmitRelearnHandle() {
    toggleMenu();
    const res = await backToRecallSystem(
      noteId
    );

    if(!res){
      return;
    }

    if (!res.success) {
      router.push("/login");
    }
    router.refresh();
  }

  async function onSubmitDeleteHandle(formData: FormData) {
    toggleMenu();
    const res = await deleteNote(
      Number(formData.get("noteId"))
    );
    if(!res){
      return;
    }

    if (!res.success) {
      router.push("/login");
    }
    router.refresh();
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
