"use client";
import { editNote, getNoteById } from "@/features/notes/application";
import { TNoteApp } from "@/lib/types";
import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import Loader from "@/components/common/Loader";
import Loading from "@/app/(ui)/loading";

export default function Edit({pathSrc}: {pathSrc: string}) {
  const params = useParams();
  const noteId = params.noteId;
  const [note, setNote] = useState<TNoteApp>();
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getNote() {
      const n = await getNoteById(Number(noteId));
      setNote(n as TNoteApp);
    }
    getNote();
  }, [noteId]);

  async function onSubmitEditHandle(formData: FormData) {
      const response = await editNote((formData.get('userNotes') as FormDataEntryValue).toString(), Number(noteId));
      if (!response.success)
        router.push('/login');
      else 
        router.push(pathSrc);
    };

  return (
    note ?
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="box-layout center-vertically mt-15"
    >
      <form
        className="rounded-3xl space-y-4 w-full p-4"
        action={(e) => onSubmitEditHandle(e)}
      >
        <motion.h2
          variants={itemVariants}
          className="text-box"
        >
          Edit your notes for: <b title="Word" className="hover:underline">{note.dictionary_words.word}</b>
        </motion.h2>
        <motion.div variants={itemVariants}>
          <label htmlFor="userNotes" className="inline-block text-text-main my-3">
            Your notes:
          </label>
          <textarea
            name="userNotes"
            id="userNotes"
            defaultValue={note?.user_notes}
            className="bg-white rounded-3xl h-[350px] sm-h-[500px] resize-none block w-full p-5 text-text-second"
          ></textarea>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
          className="center sm:my-3"
        >
          <button className="primary-btn center" onClick={() => setIsPending(true)}>
            {isPending ? (
              <Loader />
            ) : (
              "Edit"
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
    : <Loading />
  );
}
