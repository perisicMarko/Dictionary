"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TMeaning, TWordApp } from "@/shared/types";
import { saveNote } from "@/features/notes/application";
import AudioPlayer from "@/components/common/AudioPlayer";
import Loader from "@/components/common/Loader";
import { generateWordNotes } from "@/features/dictionary/application";
import DisplayNotes from "@/components/common/DisplayNotes";

export default function GenerateNoteForm({
  savedWords,
}: {
  savedWords: string[];
}) {
  const [word, setWord] = useState("");
  const [generatedNote, setGeneratedNote] = useState<TWordApp | null>(null);
  const [isGenerating, startGenerating] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const wordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    wordInputRef.current?.focus();
  }, []);

  const normalizedWord = word.trim().toLowerCase();
  const isAlreadyInDictionary = savedWords.includes(normalizedWord);
  const allowSaveAction = generatedNote !== null && normalizedWord === generatedNote.word.toLowerCase() && !isAlreadyInDictionary;
  const allowGenerateAction = (normalizedWord.length !== 0 && !generatedNote && errorMessage.length === 0) || 
    (normalizedWord.length !== 0 && !isAlreadyInDictionary); // it should allow if the error is not related to the duplicate words

  const resetPreview = (nextError = "") => {
    setGeneratedNote(null);
    setErrorMessage(nextError);
  };

  useEffect(() => {
    if (savedWords.includes(word.trim().toLowerCase())) {
      setErrorMessage("Word is already added. Check it in your notes.");
    } else {
      setErrorMessage("");
    }
  }, [word]);

  const handleGenerate = () => {
    wordInputRef.current?.blur();

    startGenerating(() => {
      void (async () => {
        const generatedNoteRes = await generateWordNotes(normalizedWord);
        if (generatedNoteRes.success) {
          setGeneratedNote(generatedNoteRes.data as TWordApp);
          setErrorMessage("");
          return;
        } else {
          resetPreview(generatedNoteRes.message);
        }
      })();
    });
  };

  const handleSave = async (formData: FormData) => {
    if (!generatedNote) {
      return;
    }

    const res = await saveNote(
      generatedNote.word,
      generatedNote.audio,
      formData.get("userNotes")?.toString() || "",
      generatedNote.generated_notes as TMeaning[],
      generatedNote.word_id as number
    );

    if (!res.success) {
      router.push("/login");
      setIsSaving(false);
      return;
    }

    if (wordInputRef.current) {
      wordInputRef.current.value = "";
      wordInputRef.current.focus();
    }

    setWord("");
    setIsSaving(false);
    resetPreview();
  };

  return (
    <div className="box-width mt-25 h-3/4 md:py-5 md-py-10 xl:py-16 sm:max-h-100 enter-fade">
      <form
        action={handleSave}
        className="space-y-2 h-full bg-main rounded-3xl w-full p-6 enter-fade-up enter-delay-1"
      >
        <input
          value={word}
          ref={wordInputRef}
          className="rounded-3xl text-center text-text-main w-full h-8.75 sm:h-10 xl:h-12 p-2 mt-5"
          type="text"
          name="word"
          onChange={(e) => {
            setWord(e.target.value.toLowerCase());
            setErrorMessage("");

          }}
          placeholder="Enter a new word here"
        />

        {errorMessage.length !== 0 ? <p className="error mt-2 text-center">{errorMessage}</p> : null}

        <div className="flex justify-start w-full mt-2">
          {generatedNote && generatedNote.generated_notes ? (
            <div className="w-full">
              <AudioPlayer src={generatedNote.audio} />
            </div>
          ) : null}
        </div>

        {generatedNote ? (
          <>
            <div className="w-full center">
              <textarea
                rows={1}
                placeholder="Type your notes here..."
                className="p-2 sm:p-4 rounded-2xl w-full mt-2 text-text-second bg-white resize-none h-fit"
                name="userNotes"
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  const lineHeight = parseFloat(getComputedStyle(target).lineHeight);
                  const maxHeight = lineHeight * 5;
                  target.style.height =
                    Math.min(target.scrollHeight, maxHeight) + "px";
                }}
              />
            </div>
            <div className="w-full overflow-auto">
              <DisplayNotes
                word={(generatedNote as TWordApp).word}
                meanings={(generatedNote as TWordApp).generated_notes}
                includeWord={true}
              />
            </div>
          </>
        ) : null}

        <div className={
          `w-full center-vertically
          ${(allowSaveAction ? "mt-7" : "")}
          ${(!generatedNote) ? "mt-0" : "mt-7"}`
        }>
          <button
            type="button"
            className={`w-full center bg-second text-text-main sm:hover:scale-105 active:scale-95 rounded-3xl mx-1 h-8.75 sm:h-10 xl:h-12 cursor-pointer inline-block transition-all
                ${!allowGenerateAction ? " opacity-50" : ""}`}
            onClick={handleGenerate}
            hidden={allowSaveAction}
            disabled={!allowGenerateAction}
          >
            {isGenerating ? <Loader /> : <b>Generate</b>}
          </button>

          <button
            type="submit"
            className="w-full bg-second center text-text-main sm:hover:scale-105 active:scale-95 rounded-3xl h-8.75 sm:h-10 xl:h-12 cursor-pointer inline-block transition-all"
            hidden={!allowSaveAction}
            onClick={() => {
              wordInputRef.current?.focus();
              setIsSaving(true);
            }}
          >
            {isSaving ? <Loader /> : <b>Save</b>}
          </button>
        </div>
      </form>
    </div>
  );
}
