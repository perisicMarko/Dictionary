"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Loader from "@/components/common/Loader";
import { putNoteInDrawer } from "@/features/drawers/application";
import { useRouter } from "next/navigation";

export default function DrawerNotePicker({
  notes,
  drawerId,
}: {
  notes: { word: string; noteId: number }[] | undefined;
  drawerId: number;
}) {
  const addWordInput = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [importState, importAction, isImporting] = useActionState(
    putNoteInDrawer,
    undefined
  );
  const router = useRouter();

  const normalizedValue = value.trim().toLowerCase();
  const filteredOptions = notes?.filter((note) =>
    note.word.toLowerCase().includes(normalizedValue)
  );
  const selectedNote = notes?.find(
    (note) => note.word.trim().toLowerCase() === normalizedValue
  );
  const isValidWord = !!selectedNote;

  useEffect(() => {
    if (addWordInput.current) {
      addWordInput.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!importState) {
      return;
    }

    if (!importState.success) {
      router.push("/login");
      return;
    }

    setValue("");
  }, [importState, router]);

  return (
    <form
      action={importAction}
      className="center-vertically gap-2 w-full enter-fade-up"
      onClick={(e) => e.stopPropagation()}
    >
      <input name="drawerId" value={drawerId} readOnly hidden />
      <input name="addedNoteId" value={selectedNote?.noteId ?? -1} readOnly hidden />
      <input
        ref={addWordInput}
        list="notes"
        value={value}
        name="word"
        onChange={(e) => setValue(e.target.value)}
        className="text-text-main p-2 outline-none active:outline-none rounded-3xl w-full"
        placeholder="Input your word..."
      />
      <datalist id="notes">
        {filteredOptions?.map((note, index) => (
          <option key={note.word + index} value={note.word} />
        ))}
      </datalist>
      <button
        type="submit"
        className={`w-full center cursor-pointer transition-all xl:hover:scale-105 xl:active:scale-95 bg-second p-2 rounded-3xl text-text-main ${
          normalizedValue === "" || !isValidWord ? "opacity-50" : ""
        }`}
        disabled={!isValidWord || normalizedValue === "" || isImporting}
      >
        <span className="h-[20px] center">
          {isImporting ? <Loader /> : "Put in drawer"}
        </span>
      </button>
    </form>
  );
}
