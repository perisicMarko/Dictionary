"use client";
import { getNoteById } from "@/actions/manageNotes";
import { TDBNoteEntry } from "@/lib/types";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { containerVariants, itemVariants } from "@/lib/animationVariants";

export default function Edit() {
  const params = useParams();
  const noteId = params.noteId;
  console.log(noteId);
  const [note, setNote] = useState<TDBNoteEntry | null>();
  const router = useRouter();

  useEffect(() => {
    async function getNote() {
      const n = await getNoteById(Number(noteId));
      setNote(n);
    }
    getNote();
  }, [noteId]);


  async function onSubmitEditHandle(e : React.FormEvent){
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement)
    const response = await fetch('/api/dictionary/recall/edit', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({noteId: Number(noteId), userNotes: formData.get('userNotes'), generatedNotes: formData.get('generatedNotes')}),
    });
    if(response.ok)
      router.push('/dictionary/recall')
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="flex flex-col justify-center items-center mt-15 bg-slate-800 rounded-4xl xl:h-[800px] h-3/4 w-3/4 xl:w-[600px] p-5"
    >
      <form className="rounded-2xl space-y-4 w-full p-4" onSubmit={onSubmitEditHandle}>
        <motion.h2
          variants={itemVariants}
          className="text-center hover:underline text-white"
        >
          <b>Edit your notes here:</b>
        </motion.h2>
        <motion.div variants={itemVariants}>
          <label htmlFor="userNotes" className="text-white">
            Your notes:
          </label>
          <textarea
            name="userNotes"
            id="userNotes"
            defaultValue={note?.user_notes}
            className="bg-white rounded-2xl  xl:h-[180px] md:h-[220px] sm:h-[180px] h-[130px] block w-full p-2 mt-1 text-slate-800"
          ></textarea>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label htmlFor="generatedNotes" className="text-white">
            Generated notes:
          </label>
          <textarea
            name="generatedNotes"
            id="generatedNotes"
            defaultValue={note?.generated_notes}
            className=" bg-white rounded-2xl xl:h-[375px] md:h-[250px] sm:h-[200px] h-[150px] block w-full p-2 mt-1 text-slate-800"
          ></textarea>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
          className="center sm:my-3"
        >
          <button className="primaryBtn">Edit</button>
        </motion.div>
      </form>
    </motion.div>
  );
}
