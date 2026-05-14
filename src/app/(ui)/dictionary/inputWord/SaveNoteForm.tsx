"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TMeaning, TWordApp } from "@/shared/types";
import { saveNotes } from "@/features/notes/application";
import AudioPlayer from "@/components/common/AudioPlayer";
import Loader from "@/components/common/Loader";
import { generateWordNotes } from "@/features/dictionary/application";
import DisplayNotes from "@/components/common/DisplayNotes";

type ErrorNote = { error: string };

function isErrorNote(
  note: TWordApp | ErrorNote | null | undefined
): note is ErrorNote {
  return note != null && "error" in note;
}

export default function SaveNoteForm({
  initialWords,
}: {
  initialWords: string[];
}) {
  const [savedWords, setSavedWords] = useState(initialWords);
  const [word, setWord] = useState("");
  const [note, setNote] = useState<TWordApp | ErrorNote | null>(null);
  const [generated, setGenerated] = useState(false);
  const [isGenerating, startGenerating] = useTransition();
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isWordAdded, setIsWordAdded] = useState(false);
  const router = useRouter();
  const wordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    wordInputRef.current?.focus();
  }, []);

  const normalizedWord = word.trim().toLowerCase();
  const generatedMatchesCurrentWord =
    !!note && !isErrorNote(note) && normalizedWord === note.word.toLowerCase();
  const canGenerate = normalizedWord !== "" && !generatedMatchesCurrentWord;
  const canSave = generated && generatedMatchesCurrentWord && !isWordAdded;

  const resetPreview = (nextError = "") => {
    setGenerated(false);
    setNote(null);
    setError(nextError);
  };

  const handleGenerate = () => {
    wordInputRef.current?.blur();

    startGenerating(() => {
      void (async () => {
        const duplicateWord = savedWords.includes(normalizedWord);

        if (duplicateWord) {
          setIsWordAdded(true);
          resetPreview("Word is already added. Check it in your notes.");
          return;
        }

        setIsWordAdded(false);
        const generatedNoteRes = await generateWordNotes(normalizedWord);

        if (generatedNoteRes && generatedNoteRes.success) {
          setNote(generatedNoteRes.data as TWordApp);
          setGenerated(true);
          setError("");
          return;
        }

        resetPreview("This word is not supported. Please check your spelling.");
      })();
    });
  };

  const handleSubmit = async (formData: FormData) => {
    if (!note || isErrorNote(note)) {
      return;
    }

    const res = await saveNotes(
      note.word,
      note.audio,
      formData.get("userNotes")?.toString() as string,
      note.generated_notes as TMeaning[],
      note.word_id as number
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
    setIsWordAdded(false);
    setSavedWords((currentWords) => [...currentWords, normalizedWord]);
    resetPreview();
  };

  return (
    <div className="box-width mt-25 h-3/4 md:py-5 md-py-10 xl:py-16 sm:max-h-100 enter-fade">
      <form
        action={handleSubmit}
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
            setError("");
            setIsWordAdded(false);
          }}
          placeholder="Enter new word here..."
        />

        {error ? <p className="error mt-1 text-center">{error}</p> : null}

        <div className="flex justify-start w-full mt-2">
          {note && !isErrorNote(note) && note.generated_notes ? (
            <div className="w-full">
              <AudioPlayer src={note.audio} />
            </div>
          ) : null}
        </div>

        {generated && note && !isErrorNote(note) ? (
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
                word={note.word}
                meanings={note.generated_notes}
                includeWord={true}
              />
            </div>
          </>
        ) : null}

        <div className="w-full center-vertically">
          <div className="w-full grid grid-cols-2 gap-2">
            <button
              type="button"
              className={
                "center bg-second text-text-main sm:hover:scale-105 active:scale-95 rounded-3xl m-1 h-8.75 sm:h-10 xl:h-12 cursor-pointer inline-block transition-all " +
                (canSave ? "col-span-1" : "col-span-2") +
                (!canGenerate ? " opacity-50" : "")
              }
              onClick={handleGenerate}
              disabled={!canGenerate || isGenerating}
            >
              {isGenerating ? <Loader /> : <b>Generate</b>}
            </button>

            {generated ? (
              <button
                type="submit"
                className={
                  "bg-second center text-text-main sm:hover:scale-105 active:scale-95 rounded-3xl m-1 h-8.75 sm:h-10 xl:h-12 cursor-pointer inline-block col-span-1 transition-all " +
                  (!canSave ? "opacity-50" : "")
                }
                hidden={!generatedMatchesCurrentWord}
                onClick={() => {
                  wordInputRef.current?.focus();
                  setIsSaving(true);
                }}
                disabled={!canSave}
              >
                {isSaving ? <Loader /> : <b>Save</b>}
              </button>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
}
