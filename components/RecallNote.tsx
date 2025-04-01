"use client";
import dynamic from "next/dynamic";
import { TDBNoteEntry } from "@/lib/types";
import AudioPlayer from "./AudioPlayer";
import { useState, useRef, useContext } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { TokenContext } from "./TokenContextProvider";
import { useRouter } from "next/navigation";

function RecallNote({
  note,
  handle,
}: {
  note: TDBNoteEntry;
  handle: () => void;
}) {
  const [menu, setMenu] = useState(false);
  const [quality, setQuality] = useState(-1);
  const containerRef = useRef(null);
  const [arrowSrc, setArrowSrc] = useState(false);
  const tokenContext = useContext(TokenContext);
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  async function onSubmitDeleteHandle(e : React.FormEvent){
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    if(tokenContext?.accessToken === undefined)
      return;
    const response = await fetch('/api/dictionary/recall/learned', {
      method: 'POST', 
      credentials: 'include', 
      body: JSON.stringify({accessToken: tokenContext?.accessToken, noteId: Number(formData.get('noteId')), status: true}),
    });    

    console.log(response);
    if(response.status === 401)
      router.push('/');


    handle();//refresh parrent
  }

  async function onSubmitGradeHandle(e : React.FormEvent){
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    if(tokenContext?.accessToken === undefined)
      return;
    setQuality(-1);
    const response = await fetch('/api/dictionary/recall/grade', {
      method: 'POST', 
      credentials: 'include', 
      body: JSON.stringify({noteId: Number(formData.get('noteId')), accessToken: tokenContext?.accessToken, quality: formData.get('recall')}),
    });
    console.log(response);
    handle();//refresh parrent
  }

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      ref={containerRef}
      className="bg-slate-800 relative w-3/4 sm:w-[600px] max-h-[800px] rounded-4xl mt-8 p-7"
      onClick={() => {
        setMenu(false);
      }}
    >
      <div className="absolute right-0 top-5 flex flex-col items-center rounded-2xl w-[55px] h-[110px]">
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
        {menu && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="bg-white/80 flex flex-col items-center pointer-events-auto z-10 left-2 py-1 px-1 rounded-2xl"
          >
            <Link
              href={"/dictionary/recall/edit/" + note.id}
              type="submit"
              onClick={() => setMenu(false)}
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

            <motion.form
              variants={itemVariants}
              className="center"
              onSubmit={onSubmitDeleteHandle}
            >
              <input
                type="text"
                name="noteId"
                defaultValue={note.id}
                hidden 
              />
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

            <motion.span
              variants={itemVariants}
              className="ml-1 block hover:scale-105 hover:underline text-blue-500 cursor-pointer"
              onClick={() => {
                setQuality(6);
                setMenu(!menu);
              }}
            >
              <b>notes</b>
            </motion.span>
            <motion.span
              variants={itemVariants}
              className="ml-1 block hover:scale-105 hover:underline text-blue-500 cursor-pointer"
              onClick={() => {
                setQuality(-1);
                setMenu(!menu);
              }}
            >
              <b>grade</b>
            </motion.span>
          </motion.div>
        )}
      </div>
      <span className=" text-white" title="word">
        <b>{note.word}</b>
      </span>

      {quality === 6 ? (
        <>
          <AudioPlayer src={note.audio}></AudioPlayer>
          <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="space-y-2 mt-2 justify-center items-center overflow-auto h-[200px] md:h-[250px] xl:h-[400px]"
          >
            <motion.h2
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-2 text-blue-400"
            >
              <b>
                <u>Your notes:</u>
              </b>
            </motion.h2>
            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="whiteSpaces text-blue-300"
            >
              {note.user_notes
                ? note.user_notes
                : "You have not inserted yor notes."}
            </motion.p>
            <motion.h2
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-2 text-blue-400"
            >
              <b>
                <u>Generated notes:</u>
              </b>
            </motion.h2>
            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="whiteSpaces text-blue-300"
            >
              {note.generated_notes}
            </motion.p>
          </motion.div>
        </>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="center"
        >
          <motion.form
            variants={itemVariants}
            className="rounded-2xl w-full py-2 relative"
            onSubmit={onSubmitGradeHandle}
          >
            <input 
              type="text" 
              name="noteId" 
              defaultValue={note.id}
              hidden 
            />
            <label htmlFor="recall" className="text-white text-xs sm:text-xl">
              Remember this word?
            </label>
            <Image
              src="/arrowDown.svg"
              alt="arrow icon"
              width={20}
              height={20}
              className="ml-3 w-auto h-auto top-10 sm:top-12 pointer-events-none md:top-13 xl:top-14 right-5 sm:right-11 scale-80 sm:scale-100 z-5 inline-block absolute"
            ></Image>
            <select
              id="recall"
              defaultValue={-1}
              name="recall"
              onClick={() => {
                setMenu(false);
                setArrowSrc(!arrowSrc);
              }}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="relative mt-1 block text-white hover:scale-105 active:scale-95 bg-blue-400 w-full h-[35px] sm:h-[40px] md:h-[40px] xl:h-[48px] appearance-none cursor-pointer py-2 rounded-3xl focus:outline-none px-3 text-xs sm:text-xl"
            >
              <option value="-1" disabled>
                Grade from 0-5{" "}
              </option>
              <option value="0">0(complete blackout)</option>
              <option value="1">
                1(incorrect response, the correct one remembered after reading
                notes)
              </option>
              <option value="2">
                2(incorrect response, where the correct one seemed easy to
                recall)
              </option>
              <option value="3">
                3(correct response, recalled with serious difficulty)
              </option>
              <option value="4">4(correct response, after hestitation)</option>
              <option value="5">5(perfect response)</option>
            </select>

            {quality != -1 && (
              <motion.button variants={itemVariants} className="primaryBtn">
                <b>Grade</b>
              </motion.button>
            )}
          </motion.form>
        </motion.div>
      )}
    </motion.div>
  );
}

export default dynamic(() => Promise.resolve(RecallNote), { ssr: false });
