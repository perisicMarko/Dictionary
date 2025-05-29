import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  containerVariants,
  itemVariants,
  transition,
} from "@/lib/animationVariants";
import { useRef, useContext, useState, useTransition } from "react";
import { TWordApp } from "@/lib/types";
import { saveNotes } from "@/actions/manageNotes";
import { TokenContext } from "@/components/TokenContextProvider";
import AudioPlayer from "@/components/common/AudioPlayer";
import Loader from "@/components/common/Loader";
import { fetchApiNotes } from "@/actions/manageDictApi";

export default function SaveNoteForm({
  toggleHelp,
}: {
  toggleHelp: () => void;
}) {
  const [word, setWord] = useState('');
  const [note, setNote] = useState<TWordApp | { error: string } | null>(); // for preview of api response
  const [generate, setGenerate] = useState(false); // for displaying textarea for generated notes
  const [isGenerating, startGenerating] = useTransition(); // keeping track of generating notes action
  const [error, setError] = useState(""); // if inputted word is not supported, this error should be displayed
  const [isSaving, setIsSaving] = useState(false); // true when action saveNote is active
  const tokenContext = useContext(TokenContext);
  const router = useRouter();
  const wordInputRef = useRef<HTMLInputElement>(null);

  const isErrorNote = (
    note: TWordApp | { error: string } | null | undefined
  ): note is { error: string } => {
    return note != null && "error" in note;
  };

  const cleanUp = (flag: number) => {
    setGenerate(false);
    setNote(null);
    if (flag) {
      // when flag is 1 it should return <></> cause inside {} in return it is expected to return something
      setError("This word is not supported. Please check your spellng.");
      return <></>;
    }
    setWord("");
  }

  const handleSubmit = async (formData: FormData) => {
    if (tokenContext?.accessToken == undefined) {
      setIsSaving(false);
      return;
    }

    cleanUp(0);

    const res = await saveNotes(
      formData.get("word")?.toString() as string,
      formData.get("audio")?.toString() as string,
      formData.get("userNotes")?.toString() as string,
      formData.get("generatedNotes")?.toString() as string,
      formData.get("accessToken")?.toString() as string
    );

    if (wordInputRef.current)
      // expanding cleanUp
      wordInputRef.current.value = "";

    if (res?.status === 201) {
      const newToken = res.accessToken;
      tokenContext?.setAccessToken(newToken);
    } else if (res?.status === 401) router.push("/logIn");

    setIsSaving(false);
  }

  let buttonStyle =
    "center bg-blue-400 text-white sm:hover:scale-105 active:scale-95 rounded-3xl m-1 h-[35px] sm:h-[40px] md:h-[40px] xl:h-[48px] cursor-pointer inline-block transition-all";
  if (!isErrorNote(note) && note)
    buttonStyle += " col-span-1";
  else
    buttonStyle += " col-span-2";

  wordInputRef.current?.focus(); // focus input on component mount

  if (note != null && isErrorNote(note) && note?.error) cleanUp(1);

  const isDisabled = word.trim() === "";

  return (
    <motion.div
      layout
      transition={transition}
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      variants={containerVariants}
      key="input"
      className="center-verticaly box-width mt-25 h-3/4 md:py-5 md-py-10 xl:py-16 sm:max-h-[400px]"
    >
      <motion.form
        variants={itemVariants}
        action={(e) => {
          handleSubmit(e);
        }}
        className="space-y-2 h-full bg-slate-800 rounded-3xl center-verticaly w-full p-6"
      >
        <input
          name="accessToken"
          value={tokenContext?.accessToken}
          hidden
          readOnly
        />
        <input
          defaultValue={(!isErrorNote(note) && note?.word) || ""}
          ref={wordInputRef}
          key="userWord"
          className="rounded-3xl text-center text-slate-800 bg-white w-full h-[35px] sm:h-[40px] md:h-[40px] xl:h-[48px] p-2 mt-5"
          type="text"
          name="word"
          onChange={(e) => setWord(e.target.value)}
          placeholder="Enter new word here..."
        />
        {error && <p className="error mt-1 text-center">{error}</p>}
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
        {generate && !isErrorNote(note) && note && (
          <>
            <div className="w-full center">
              <textarea
                rows={5}
                placeholder="Type your notes here..."
                className="p-2 rounded-2xl w-full  mt-2 text-slate-800 bg-white max-h-40 xl:max-h-70"
                name="userNotes"
                key="userNotes"
              />
            </div>
            <div className="p-3 w-full">
              <h2 className="text-blue-400 self-start">
                <b>{note?.word}</b>
              </h2>
              <textarea
                rows={5}
                placeholder="Notes will be generated here..."
                className="w-full mt-2 text-blue-300 h-50 xl:h-100 xl:max-h-100 px-1 resize-none xl:resize-y"
                name="generatedNotes"
                key="genNotes"
                value={note.parsedNote}
                onChange={(e) => {
                  note.parsedNote = e.target.value;
                }}
              />
            </div>
          </>
        )}
        <div className="w-full center-vertically">
          <div className="w-full grid grid-cols-2 gap-2">
            <motion.button
              variants={itemVariants}
              className={
                buttonStyle +
                (wordInputRef &&
                !isErrorNote(note) &&
                wordInputRef.current?.value.toLowerCase() !=
                  note?.word.toLowerCase()
                  ? " col-span-2"
                  : "") + (isDisabled ? ' opacity-50' : '')
              }
              onClick={async (e) => {
                e.preventDefault();
                if (isDisabled === true) {
                  wordInputRef?.current?.focus();
                  return;
                }

                startGenerating(async () => {
                  const notes = await fetchApiNotes(word.trim().toLowerCase())
              
                  if (notes && !("error" in notes)) {
                    setNote(notes);
                    setError("");
                  } else {
                    cleanUp(1);
                  }
                  setGenerate(true);
                });
              }
            }
            >
              {isGenerating ? <Loader /> : <b>Generate</b>}
            </motion.button>
            {generate && (
              <motion.button
                type="submit"
                className="bg-blue-400 center text-white sm:hover:scale-105 active:scale-95 rounded-3xl m-1 h-[35px] sm:h-[40px] md:h-[40px] xl:h-[48px] cursor-pointer inline-block col-span-1 transition-all"
                hidden={
                  wordInputRef &&
                  !isErrorNote(note) &&
                  wordInputRef.current?.value.toLowerCase() !=
                    note?.word.toLowerCase()
                }
                variants={itemVariants}
                onClick={() => setIsSaving(true)}
              >
                {isSaving ? <Loader /> : <b>Save</b>}
              </motion.button>
            )}
          </div>
          <span
            className="hover:underline hover:scale-105 cursor-pointer text-white mt-3"
            onClick={() => toggleHelp()}
          >
            Need any help?
          </span>
        </div>
      </motion.form>
    </motion.div>
  );
}
