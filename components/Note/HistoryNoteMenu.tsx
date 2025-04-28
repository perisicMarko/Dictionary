import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { backToRecallSystem, deleteNote } from "@/actions/manageNotes";
import { TokenContext } from "../TokenContextProvider";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

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
      className="bg-white/80 z-10 rounded-2xl p-2"
    >
      <motion.form
        variants={itemVariants}
        className="center"
        action={onSubmitDeleteHandle}
      >
        <input type="text" name="noteId" defaultValue={noteId} hidden />
        <button type="submit" onClick={(e) => e.stopPropagation()} title='delete note permanently' className="hover:scale-105 cursor-pointer">
          <Trash2 color="#1E293B"/>
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
          className="text-center text-xs text-slate-800 cursor-pointer hover:scale-105"
          onClick={(e) => e.stopPropagation()}
          title='relearn note'
        >
          <b>R</b>
        </button>
      </motion.form>
    </motion.div>
  );
}