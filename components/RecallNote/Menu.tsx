import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { useRouter } from "next/navigation";

export default function RecallNoteMenu({
  toggleMenu,
  changeQuality,
  noteId,
  rerenderHandle,
  accessToken,
}: {
  toggleMenu: () => void;
  changeQuality: (e: number) => void;
  noteId: number;
  rerenderHandle: () => void;
  accessToken: string | undefined;
}) {
  const router = useRouter();

  async function onSubmitDeleteHandle(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    if (accessToken === undefined) return;
    const response = await fetch("/api/dictionary/recall/learned", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        accessToken: accessToken,
        noteId: Number(formData.get("noteId")),
        status: true,
      }),
    });

    console.log(response);
    if (response.status === 401) router.push("/");

    rerenderHandle(); //rerendering parent
  }
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="bg-white/80 flex flex-col items-center pointer-events-auto z-10 left-2 py-1 px-1 rounded-2xl"
    >
      <Link
        href={"/dictionary/recall/edit/" + noteId}
        type="submit"
        onClick={() => toggleMenu()}
      >
        <Image
          className="scale-75 hover:scale-90 cursor-pointer"
          title="edit note"
          src="/edit.svg"
          width={30}
          height={30}
          alt="edit icon"
        ></Image>
      </Link>

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

      <motion.span
        variants={itemVariants}
        className="ml-1 block hover:scale-105 hover:underline text-blue-500 cursor-pointer"
        onClick={() => {
          changeQuality(6);
          toggleMenu();
        }}
      >
        <b>notes</b>
      </motion.span>
      <motion.span
        variants={itemVariants}
        className="ml-1 block hover:scale-105 hover:underline text-blue-500 cursor-pointer"
        onClick={() => {
          changeQuality(-1);
          toggleMenu();
        }}
      >
        <b>grade</b>
      </motion.span>
    </motion.div>
  );
}
