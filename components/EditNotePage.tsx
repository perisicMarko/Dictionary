"use client";
import { editNote, getNoteById } from "@/actions/manageNotes";
import { TDBNoteEntry } from "@/lib/types";
import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import Loader from "@/components/common/Loader";
import Loading from "@/app/(ui)/loading";
import { TokenContext } from "@/components/TokenContextProvider";

export default function Edit({pathSrc}: {pathSrc: string}) {
  const params = useParams();
  const noteId = params.noteId;
  const [note, setNote] = useState<TDBNoteEntry | null>();
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const tokenContext = useContext(TokenContext);

  useEffect(() => {
    async function getNote() {
      const n = await getNoteById(Number(noteId));
      setNote(n);
    }
    getNote();
  }, [noteId]);

  async function onSubmitEditHandle(formData: FormData) {
      const response = await editNote(formData.get('userNotes')?.toString() || '', formData.get('generatedNotes')?.toString() || '', Number(noteId), tokenContext?.accessToken || '');
      if (!response?.success)
        console.log('Note update failed, returning to yourWords page');
      else if(response.status === 201)
        tokenContext?.setAccessToken(response.accessToken || '');

      router.push(pathSrc);
    };

  return (
    note ?
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="box-layout center-vertically mt-15 xl:h-[800px] h-3/4"
    >
      <form
        className="rounded-3xl space-y-4 w-full p-4"
        action={(e) => onSubmitEditHandle(e)}
      >
        <motion.h2
          variants={itemVariants}
          className="text-box"
        >
          Edit your notes for: <b title="Word" className="hover:underline">{note.word}</b>
        </motion.h2>
        <motion.div variants={itemVariants}>
          <label htmlFor="userNotes" className="text-white">
            Your notes:
          </label>
          <textarea
            name="userNotes"
            id="userNotes"
            defaultValue={note?.user_notes}
            className="bg-white rounded-3xl xl:h-[180px] md:h-[220px] sm:h-[180px] h-[130px] block w-full p-2 mt-1 text-slate-800"
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
