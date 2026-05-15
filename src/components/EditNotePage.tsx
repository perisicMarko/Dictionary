"use client";

import { editNote } from "@/features/notes/application";
import { TNoteApp } from "@/shared/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";

export default function EditNotePage({
  pathSrc,
  note,
}: {
  pathSrc: string;
  note: TNoteApp;
}) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function onSubmitEditHandle(formData: FormData) {
    const response = await editNote(
      (formData.get("userNotes") as FormDataEntryValue).toString(),
      note.id
    );

    if (!response.success) {
      router.push("/login");
      return;
    }

    router.push(pathSrc);
  }

  return (
    <div className="box-layout center-vertically mt-15 enter-fade">
      <form
        className="rounded-3xl space-y-4 w-full p-4"
        action={(formData) => onSubmitEditHandle(formData)}
      >
        <h2 className="text-box enter-fade-up enter-delay-1">
          Edit your notes for:{" "}
          <b title="Word" className="text-text-second">
            {note.dictionary_words.word}
          </b>
        </h2>

        <div className="enter-fade-up enter-delay-1">
          <textarea
            name="userNotes"
            id="userNotes"
            defaultValue={note.user_notes}
            className="bg-white/5 rounded-3xl h-87.5 sm:h-125 resize-none block w-full p-5 text-text-second"
          ></textarea>
        </div>

        <div className="center sm:my-3 enter-fade-up enter-delay-1">
          <button
            className="primary-btn center"
            onClick={() => setIsPending(true)}
          >
            {isPending ? <Loader /> : "Edit"}
          </button>
        </div>
      </form>
    </div>
  );
}
