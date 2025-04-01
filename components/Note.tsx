"use client";
import { TDBNoteEntry } from "@/lib/types";
import AudioPlayer from "./AudioPlayer";
import dynamic from "next/dynamic";
import { useState, useRef, useContext } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { TokenContext } from "./TokenContextProvider";

function Note({
  prop,
  historyNote,
  handle,
}: {
  prop: TDBNoteEntry;
  historyNote: boolean;
  handle: () => void;
}) {
  const [drop, setDrop] = useState(false);
  const [menu, setMenu] = useState(false);
  const title = drop ? "Click to collapse." : "Click for notes.";
  const containerRef = useRef(null);
  const tokenContext = useContext(TokenContext);

  const note = prop;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  async function onSubmitRelearnHandle(e : React.FormEvent){
    e.preventDefault();
    setMenu(!menu);
    const formData = new FormData(e.target as HTMLFormElement);
    if(tokenContext?.accessToken === undefined)
      return;
    const response = await fetch('/api/dictionary/history/relearn', {
      method: 'POST', 
      credentials: 'include', 
      body: JSON.stringify({accessToken: tokenContext?.accessToken, noteId: Number(formData.get('noteId')), status: false}),
    });    

    console.log(response);

    handle();//refresh parrent
  }

  async function onSubmitDeleteHandle(e : React.FormEvent){
    e.preventDefault();
    setMenu(!menu);
    const formData = new FormData(e.target as HTMLFormElement);
    if(tokenContext?.accessToken === undefined)
      return;
    const response = await fetch('/api/dictionary/history/delete', {
      method: 'POST', 
      credentials: 'include', 
      body: JSON.stringify({accessToken: tokenContext?.accessToken, noteId: Number(formData.get('noteId'))}),
    });    

    console.log(response);

    handle();//refresh parrent
  }

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      ref={containerRef}
      className="relative bg-slate-800 w-3/4 sm:w-[600px] max-h-[720px] sm:max-h-[800px] rounded-4xl mt-8 p-7"
      title={title}
      onClick={() => {
        setMenu(false);
        setDrop(!drop);
      }}
    >
      <div className="absolute flex flex-col items-center justify-center top-5 right-0 rounded-2xl w-1/6">
        {historyNote && (
          <Image
            className="scale-75 hover:scale-90 cursor-pointer"
            title="options"
            src="/menu.svg"
            width={30}
            height={30}
            alt="menu icon"
            onClick={(e) => {
              e.stopPropagation();
              setMenu(!menu);
            }}
          ></Image>
        )}
        {menu && historyNote && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="bg-white/80 z-10 rounded-2xl p-1"
          >
            <motion.form
              variants={itemVariants}
              className="center"
              onSubmit={onSubmitDeleteHandle}
            >
              <input type="text" name="noteId" defaultValue={note.id} hidden />
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
              <input type="text" name="noteId" defaultValue={note.id} hidden />
              <button
                type="submit"
                className="text-center text-xs text-blue-500 cursor-pointer hover:underline hover:scale-105"
                onClick={(e) => e.stopPropagation()}
              >
                relearn
              </button>
            </motion.form>
          </motion.div>
        )}
      </div>

      <h2 className="text-white mb-3" title="word">
        <b>{note.word}</b>
      </h2>
      <div className="flex flex-col justify-center items-center space-y-2">
        <AudioPlayer src={note.audio}></AudioPlayer>
        <button
          className="primaryBtn"
          onClick={() => {
            setDrop(!drop);
            setMenu(false);
          }}
        >
          Show notes
          <Image
            src={drop ? "/arrowUp.svg" : "/arrowDown.svg"}
            alt="arrow icon"
            width={20}
            height={20}
            className="ml-3 inline-block w-auto h-auto"
          ></Image>
        </button>
      </div>
      {drop && (
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-4 overflow-auto h-[300px] xl:h-[400px]"
        >
          <h2 className="mt-2 text-blue-400">
            <b>Your notes:</b>
          </h2>
          <p className="whiteSpaces text-blue-300">
            {note.user_notes
              ? note.user_notes
              : "You have not inserted yor notes."}
          </p>
          <h2 className="mt-2 text-blue-400">
            <b>Generated notes:</b>
          </h2>
          <p className="whiteSpaces text-blue-300">{note.generated_notes}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default dynamic(() => Promise.resolve(Note), { ssr: false });
