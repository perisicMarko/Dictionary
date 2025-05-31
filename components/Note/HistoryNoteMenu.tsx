import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { backToRecallSystem, deleteNote } from "@/actions/manageNotes";
import { TokenContext } from "../TokenContextProvider";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

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

  async function onSubmitRelearnHandle() {
    toggleMenu();
    if (tokenContext?.accessToken === undefined) return;
    const res = await backToRecallSystem(noteId, tokenContext?.accessToken || '');

    if(!res?.success){
      tokenContext.setAccessToken('');
      router.push('/logIn');    
    }else if(res.status === 201)
      tokenContext.setAccessToken(res.accessToken || '');
    rerenderParent(); //rerendering parent
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
        <button type="submit" onClick={(e) => e.stopPropagation()} title='Delete note permanently' className="hover:scale-105 cursor-pointer transition-all w-full">
          <Trash2 color="#1E293B"/>
        </button>
      </motion.form>
      <motion.form
        variants={itemVariants}
        className="center mt-3 px-2 mb-2 w-full"
        onSubmit={onSubmitRelearnHandle}
      >
        <input type="text" name="noteId" defaultValue={noteId} hidden />
        <button
          type="submit"
          className="text-center text-xs text-slate-800 cursor-pointer hover:text-blue-400 transition-all w-full"
          onClick={(e) => e.stopPropagation()}
          title='Relearn word'
        >
          <b>R</b>
        </button>
      </motion.form>
    </motion.div>
  );
}