import { motion } from "framer-motion";
import { containerVariants } from "@/lib/animationVariants";
import Link from "next/link";
import { NotebookPen } from "lucide-react";

export default function HistoryNoteMenu({ noteId }: { noteId: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="bg-white/80 z-10 rounded-2xl p-2"
    >
      <Link
        href={"/dictionary/yourWords/edit/" + noteId}
        onClick={(e) => e.stopPropagation()}
        title='edit notes'
      >
        <NotebookPen color='#1E293B' className="hover:scale-105 cursor-pointer"/>
        
      </Link>
    </motion.div>
  );
}
