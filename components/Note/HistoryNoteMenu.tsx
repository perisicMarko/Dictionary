import { motion } from "framer-motion";
import Image from "next/image";
import { containerVariants, itemVariants } from "@/lib/animationVariants";

export default function HistoryNoteMenu({
  actionCallBack,
  accessToken,
  toggleMenu,
  noteId,
}: {
  actionCallBack: () => void;
  accessToken: string | undefined;
  toggleMenu: () => void;
  noteId: number;
}) {
  async function onSubmitRelearnHandle(e: React.FormEvent) {
    e.preventDefault();
    toggleMenu();
    const formData = new FormData(e.target as HTMLFormElement);
    if (accessToken === undefined) return;
    await fetch("/api/dictionary/history/relearn", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        accessToken: accessToken,
        noteId: Number(formData.get("noteId")),
        status: false,
      }),
    });

    actionCallBack(); //rerendering parent
  }

  async function onSubmitDeleteHandle(e: React.FormEvent) {
    e.preventDefault();
    toggleMenu();
    const formData = new FormData(e.target as HTMLFormElement);
    if (accessToken === undefined) return;
    await fetch("/api/dictionary/history/delete", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        accessToken: accessToken,
        noteId: Number(formData.get("noteId")),
      }),
    });

    actionCallBack(); //rerendering parent
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="bg-white/80 z-10 rounded-2xl p-1"
    >
      <motion.form
        variants={itemVariants}
        className="center"
        onSubmit={onSubmitDeleteHandle}
      >
        <input type="text" name="noteId" defaultValue={noteId} hidden />
        <button type="submit" onClick={(e) => e.stopPropagation()}>
          <Image
            className="scale-75 hover:scale-90 cursor-pointer"
            title="delete note"
            src="/delete.svg"
            width={30}
            height={30}
            alt="delete icon"
          ></Image>
        </button>
      </motion.form>
      <motion.form
        variants={itemVariants}
        className="center"
        onSubmit={onSubmitRelearnHandle}
      >
        <input type="text" name="noteId" defaultValue={noteId} hidden />
        <button
          type="submit"
          className="text-center text-xs text-blue-500 cursor-pointer hover:underline hover:scale-105"
          onClick={(e) => e.stopPropagation()}
        >
          relearn
        </button>
      </motion.form>
    </motion.div>
  );
}
