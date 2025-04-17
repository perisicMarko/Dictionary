import { motion } from "framer-motion";
import Image from "next/image";
import { containerVariants } from "@/lib/animationVariants";
import Link from "next/link";

export default function HistoryNoteMenu({ noteId }: { noteId: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="bg-white/80 z-10 rounded-2xl p-1"
    >
      <Link
        href={"/dictionary/yourWords/edit/" + noteId}
        onClick={(e) => e.stopPropagation()}
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
    </motion.div>
  );
}
