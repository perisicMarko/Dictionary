import { motion } from "framer-motion";
import Image from "next/image";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { backToRecallSystem, deleteNote } from "@/actions/manageNotes";
import { TokenContext } from "../TokenContextProvider";
import { useContext } from "react";
import { useRouter } from "next/navigation";

export default function HistoryNoteMenu({
  actionCallBack,
  toggleMenu,
  noteId,
}: {
  actionCallBack: () => void;
  toggleMenu: () => void;
  noteId: number;
}) {
  const tokenContext = useContext(TokenContext);
  const router = useRouter();

  async function onSubmitRelearnHandle() {
    toggleMenu();
    if (tokenContext?.accessToken === undefined) return;
    const res = await backToRecallSystem(noteId, tokenContext?.accessToken || '');

    if(!res?.success){
      tokenContext.setAccessToken('');
      router.push('/logIn');    
    }else if(res.status === 201)
      tokenContext.setAccessToken(res.accessToken || '');
    actionCallBack(); //rerendering parent
  }

  async function onSubmitDeleteHandle(formData: FormData) {
    toggleMenu();
    if (tokenContext?.accessToken === undefined) return;
    const res = await deleteNote(Number(formData.get('noteId')), tokenContext?.accessToken);

    if(!res?.success){ 
      tokenContext.setAccessToken('');
      router.push('/logIn');    
    }else if(res.status === 201)
      tokenContext.setAccessToken(res.accessToken || '');
      
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
        action={onSubmitDeleteHandle}
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