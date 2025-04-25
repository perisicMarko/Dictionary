import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { useRouter } from "next/navigation";
import { setAsLearned } from "@/actions/manageNotes";
import { TokenContext } from "../TokenContextProvider";
import { useContext } from "react";


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
    const response = await setAsLearned(noteId, true, tokenContext?.accessToken)
    if (!response?.status) {
      tokenContext.setAccessToken('');
      router.push("/logIn");
    }else if(response.status === 201)
      tokenContext.setAccessToken(response.accessToken || '');

    rerenderHandle(); //rerendering parent
  }
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="bg-white/80 flex flex-col items-center justify-center pointer-events-auto z-10 left-2 py-2 px-1 rounded-2xl"
    >
      <motion.form
        variants={itemVariants}
        className="center"
        action={() => {onSubmitDeleteHandle()}}
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

      <Link
        href={"/dictionary/recall/edit/" + noteId}
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

      <motion.span
        variants={itemVariants}
        className=" block hover:scale-105 hover:underline text-blue-500 cursor-pointer"
        onClick={() => {
          changeQuality(6);
          toggleMenu();
        }}
        title='show notes'
      >
        <b>N</b>
      </motion.span>
      <motion.span
        variants={itemVariants}
        className="block hover:scale-105 hover:underline text-blue-500 cursor-pointer text-center"
        onClick={() => {
          changeQuality(-1);
          toggleMenu();
        }}
        title='grade recall'
      >
        <b>G</b>
      </motion.span>
    </motion.div>
  );
}
