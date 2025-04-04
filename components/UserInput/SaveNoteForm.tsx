import AudioPlayer from "../shared/AudioPlayer";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { useRef, useContext } from 'react';
import { TWordApp } from "@/lib/types";
import { TokenContext } from "../TokenContextProvider";

export default function SaveNoteForm({
    cleanUp,
    note,
    changeWord,
    error,
    toggleHelp, 
    generate, 
    isDisabled,
    changeGenerate,
    changeRequest,
}:
{
    cleanUp: (e: number) => void;
    note: TWordApp | { error: string; } | null | undefined;
    changeWord: (e: string) => void;
    error: string;
    toggleHelp: () => void;
    generate: boolean;
    isDisabled: boolean;
    changeGenerate: (e: boolean) => void;
    changeRequest: (e: boolean) => void;
}) {
    const tokenContext = useContext(TokenContext);
    const router = useRouter();
    const wordInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (tokenContext?.accessToken == undefined) return;
    cleanUp(0);
    const formData = new FormData(e.target as HTMLFormElement);

    const res = await fetch("/api/dictionary/saveNotes", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        word: formData.get("word"),
        userNotes: formData.get("userNotes"),
        generatedNotes: formData.get("generatedNotes"),
        audio: formData.get("audio"),
        accessToken: formData.get("accessToken"),
      }),
    });

    if (res.status === 201) {
      const data = await res.json();
      const newToken = data.accessToken;
      tokenContext?.setAccessToken(newToken);
    } else if (res.status === 401) router.push("/logIn");
  }


  const isErrorNote = (
    note: TWordApp | { error: string } | null | undefined
  ): note is { error: string } => {
    return note != null && "error" in note;
  };

  let buttonStyle = "bg-blue-400 text-white hover:scale-105 active:scale-95 rounded-3xl m-1 h-[35px] sm:h-[40px] md:h-[40px] xl:h-[48px] cursor-pointer inline-block";
  if (!(note && !isErrorNote(note))) {
    buttonStyle += " w-full col-span-2";
  } else if (note) 
    buttonStyle += " col-span-1";


  wordInputRef.current?.focus();

  if(note != null && isErrorNote(note) && note?.error) 
    cleanUp(1);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 1,
      }}
      variants={containerVariants}
      key="input"
      className="flex flex-col justify-center items-center sm:mt-25 md:mt-25 xl:mt-70 w-3/4 h-3/4 sm:w-[500px] md: py-5 md-py-10 xl:py-16 sm:max-h-[400px] rounded-2xl"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col justify-center items-center w-full"
      >
        <form
          method="POST"
          onSubmit={handleSubmit}
          className="bg-slate-800 space-y-2 h-full rounded-4xl p-7 flex flex-col justify-center items-center w-full"
        >
          <input
            name="accessToken"
            value={tokenContext?.accessToken}
            hidden
            readOnly
          />
          <input
            defaultValue={!isErrorNote(note) && note?.word || ''}
            ref={wordInputRef}
            key="userWord"
            className="rounded-3xl text-center textColor bg-white w-full h-[35px] sm:h-[40px] md:h-[40px] xl:h-[48px] p-2 mt-5"
            type="text"
            name="word"
            onChange={(e) => changeWord(e.target.value)}
            placeholder="Enter new word here..."
          />
          {error && <p className="error mt-1">{error}</p>}
          <div className="flex justify-start w-full mt-2">
            <input
              key="audioInput"
              type="text"
              hidden
              name="audio"
              defaultValue={
                isErrorNote(note) || note === null ? undefined : note?.audio
              }
            />
            {note != null && !isErrorNote(note) && note?.parsedNote && (
              <div className="w-full">
                <AudioPlayer
                  src={isErrorNote(note) || note === null ? "" : note!.audio}
                ></AudioPlayer>
              </div>
            )}
          </div>
          {generate && (
            <div className="w-full center">
              <textarea
                rows={5}
                placeholder="Type your notes here..."
                className="p-2 rounded-2xl w-full  mt-2 text-slate-800 bg-white max-h-40 xl:max-h-70"
                name="userNotes"
                key="userNotes"
              />
            </div>
          )}
          {generate && (
            <div className="p-3 w-full">
              <h2 className="text-blue-400 self-start">
                <b>{!isErrorNote(note) && note?.word}</b>
              </h2>
              <textarea
                rows={5}
                placeholder="Notes will be generated here..."
                className="w-full mt-2 text-blue-300 h-50 xl:h-100 xl:max-h-100 px-1 resize-none xl:resize-y"
                name="generatedNotes"
                key="genNotes"
                defaultValue={
                  isErrorNote(note) || note === null || note === undefined
                    ? ""
                    : note!.parsedNote
                }
              />
            </div>
          )}
          <div className="w-full flex flex-col items-center">
            <div className="w-full grid grid-cols-2 gap-2">
              <button
                className={buttonStyle}
                onClick={(e) => {
                  changeGenerate(true);

                  if (isDisabled === true) {
                    wordInputRef?.current?.focus();
                    e.preventDefault();
                    return;
                  }

                  e.preventDefault();
                  changeRequest(true);
                }}
              >
                <b>Generate</b>
              </button>
              {generate && (
                <button type="submit" className={buttonStyle}>
                  {" "}
                  <b>Save</b>{" "}
                </button>
              )}
            </div>
            <span
              className="hover:underline hover:scale-105 cursor-pointer text-white mt-3"
              onClick={() => toggleHelp()}
            >
              Need any help?
            </span>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
