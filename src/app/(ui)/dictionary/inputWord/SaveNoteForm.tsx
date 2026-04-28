import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  containerVariants,
  itemVariants,
  transition,
} from "@/shared/lib/animationVariants";
import { useRef, useContext, useState, useTransition, useEffect } from "react";
import { TMeaning, TWordApp } from "@/shared/types";
import { getUsersWords, saveNotes } from "@/features/notes/application";
import AudioPlayer from "@/components/common/AudioPlayer";
import Loader from "@/components/common/Loader";
import { fetchApiNotes } from "@/features/dictionary/application";
import DisplayNotes from "@/components/common/DisplayNotes";

export default function SaveNoteForm({
  toggleHelp,
}: {
  toggleHelp: () => void;
}) {
  const [words, setWords] = useState<string[]>([]);
  const [word, setWord] = useState("");
  const [note, setNote] = useState<TWordApp | { error: string } | null>(); // for preview of api response
  const [generated, setGenerated] = useState(false); // for displaying textarea for generated notes
  const [isGenerating, startGenerating] = useTransition(); // keeping track of generating notes action
  const [error, setError] = useState(""); // if inputted word is not supported, this error should be displayed
  const [isSaving, setIsSaving] = useState(false); // true when action saveNote is active, used for displaying loader on save button
  const [isWordAdded, setIsWordAdded] = useState(false); // used to check if word is already added, it is in state variable because typing new word should not reset the error message
  const router = useRouter();
  const wordInputRef = useRef<HTMLInputElement>(null);

  const isErrorNote = (
    note: TWordApp | { error: string } | null | undefined
  ): note is { error: string } => {
    return note != null && note != undefined && "error" in note;
  };

  const cleanUp = (flag: boolean) => {
    setGenerated(false);
    setNote(null);
    if (flag) {
      setError("This word is not supported. Please check your spellng.");
      return <></>; // when flag is true it should return <></> cause inside {} in return it is expected to return something
    }
    setWord("");
  };

  const handleSubmit = async (formData: FormData) => {
    cleanUp(false);
    if (!isErrorNote(note)) {
      const res = await saveNotes(
        formData.get("word")?.toString().toLowerCase() as string,
        formData.get("audio")?.toString() as string,
        formData.get("userNotes")?.toString() as string,
        note?.generated_notes as TMeaning[],
        note?.word_id as number
      );

      if (wordInputRef.current)
        // expanding cleanUp
        wordInputRef.current.value = "";

    
      if(!res.success)
        router.push("/login");

      setIsSaving(false);
    }
  };

  let buttonStyle =
    "center bg-second text-text-main sm:hover:scale-105 active:scale-95 rounded-3xl m-1 h-[35px] sm:h-[40px] md:h-[40px] xl:h-[48px] cursor-pointer inline-block transition-all";
  if (!isErrorNote(note) && note) buttonStyle += " col-span-1";
  else buttonStyle += " col-span-2";

  useEffect(() => {
    const fetchWords = async () => {
      const res = await getUsersWords();
      if (res.success) setWords(res.data as string[]);
    };
    fetchWords();
    wordInputRef.current?.focus();
  }, []);

  const isDisabled =
    word.trim() === "" ||
    (!isErrorNote(note) && word === note?.word) ||
    words === undefined;
    
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
        className="space-y-2 h-full bg-main rounded-3xl center-verticaly w-full p-6"
      >
        <input
          value={word}
          ref={wordInputRef}
          key="userWord"
          className="rounded-3xl text-center text-text-main w-full h-[35px] sm:h-[40px] md:h-[40px] xl:h-[48px] p-2 mt-5"
          type="text"
          name="word"
          onChange={(e) => {
            setWord(e.target.value.toLowerCase());
            if (!isWordAdded) setError("");
          }}
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
          {note != null && !isErrorNote(note) && note?.generated_notes && (
            <div className="w-full">
              <AudioPlayer
                src={isErrorNote(note) || note === null ? "" : note!.audio}
              ></AudioPlayer>
            </div>
          )}
        </div>
        {generated && !isErrorNote(note) && note && (
          <>
            <div className="w-full center">
              <textarea
                rows={1}
                placeholder="Type your notes here..."
                className="p-2 sm:p-4 rounded-2xl w-full mt-2 text-text-second bg-white resize-none h-fit"
                name="userNotes"
                key="userNotes"
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  const lineHeight = parseFloat(
                    getComputedStyle(target).lineHeight
                  );
                  const maxHeight = lineHeight * 5;
                  target.style.height =
                    Math.min(target.scrollHeight, maxHeight) + "px";
                }}
              />
            </div>
            <div className="w-full overflow-auto">
              <DisplayNotes
                word={note.word}
                meanings={note.generated_notes}
                includeWord={true}
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
                  : "") +
                (isDisabled ? " opacity-50" : "")
              }
              onClick={async (e) => {
                e.preventDefault();
                wordInputRef.current?.blur();

                startGenerating(async () => {
                  const note = await fetchApiNotes(word.trim().toLowerCase());
                  if (note && !("error" in note)) {
                    setNote(note);
                    setError("");
                  } else {
                    cleanUp(true);
                  }
                  if (words?.indexOf(word) != -1) {
                    setIsWordAdded(true);
                    setError("word is already added");
                  }else
                    setIsWordAdded(false);

                  setGenerated(true);
                });
              }}
              disabled={isDisabled}
            >
              {isGenerating ? <Loader /> : <b>Generate</b>}
            </motion.button>
            {generated && (
              <motion.button
                type="submit"
                className={`bg-second center text-text-main sm:hover:scale-105 active:scale-95 rounded-3xl m-1 h-[35px] sm:h-[40px] md:h-[40px] xl:h-[48px] cursor-pointer inline-block col-span-1 transition-all ${
                  isWordAdded ? "opacity-50" : ""
                }`}
                hidden={
                  wordInputRef &&
                  !isErrorNote(note) &&
                  wordInputRef.current?.value.toLowerCase() !=
                    note?.word.toLowerCase()
                }
                variants={itemVariants}
                onClick={() => {
                  wordInputRef.current?.focus();
                  setIsSaving(true);
                }}
                disabled={isWordAdded}
              >
                {isSaving ? <Loader /> : <b>Save</b>}
              </motion.button>
            )}
          </div>
          <span
            className="hover:underline hover:scale-105 cursor-pointer text-text-main mt-3 transition-all"
            onClick={() => toggleHelp()}
          >
            Need any help?
          </span>
        </div>
      </motion.form>
    </motion.div>
  );
}
