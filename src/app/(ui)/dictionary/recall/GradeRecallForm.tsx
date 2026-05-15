"use client";

import { useState, useTransition } from "react";
import { updateReviewDateByNoteId } from "@/features/notes/application";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import Loader from "../../../../components/common/Loader";

export function GradeRecallForm({
  toggleMenu,
  noteId,
  onGraded,
}: {
  toggleMenu: () => void;
  noteId: number;
  onGraded?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [recallQuality, setRecallQuality] = useState(-1);
  const router = useRouter();

  async function onSubmitGradeHandle() {
    const response = await updateReviewDateByNoteId(recallQuality, noteId);

    if (!response.success) {
      router.push("/login");
      return;
    }

    setRecallQuality(-1);

    if (onGraded) {
      onGraded();
      return;
    }

    router.refresh();
  }

  return (
    <div className="center w-full enter-fade-up">
      <form
        className="rounded-2xl w-full py-2"
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            await onSubmitGradeHandle();
          });
        }}
      >
        <label htmlFor="recall" className="text-text-main text-base sm:text-xl">
          Remember this word?
        </label>
        <div className="center relative w-full">
          {recallQuality === -1 && (
            <ChevronDown
              color="white"
              width={25}
              height={25}
              className="absolute right-5 z-5 pointer-events-none"
            />
          )}
          <select
            id="recall"
            value={recallQuality}
            onClick={() => toggleMenu()}
            onChange={(e) => setRecallQuality(Number(e.target.value))}
            className="primary-btn appearance-none py-2 focus:outline-none px-3 text-xs sm:text-xl"
          >
            <option value="-1" disabled>
              Grade from 0-5{" "}
            </option>
            <option value="0">0 – completely forgotten</option>
            <option value="1">
              1 – wrong, remembered after checking notes
            </option>
            <option value="2">2 – wrong, but felt easy to recall</option>
            <option value="3">3 – correct, but with great effort</option>
            <option value="4">4 – correct, some hesitation</option>
            <option value="5">5 – perfect, immediate recall</option>
          </select>
        </div>
        {recallQuality !== -1 && (
          <button
            type="submit"
            className="primary-btn center enter-fade-up enter-delay-1"
            disabled={isPending}
          >
            {isPending ? <Loader /> : <b>Grade</b>}
          </button>
        )}
      </form>
    </div>
  );
}
