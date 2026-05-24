"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Notes from "@/features/notes/ui/Notes";
import { TNoteApp, TDrawer } from "@/shared/types";
import Drawer from "./Drawer";

const EXIT_DURATION_MS = 220;

export default function OpenedDrawer({
  drawer,
  drawerNotes,
  search,
  openDrawerById,
  allNotes,
  onDeleteDrawer,
}: {
  drawer: TDrawer;
  drawerNotes: TNoteApp[];
  search: string;
  openDrawerById: (id: number) => void;
  allNotes: TNoteApp[];
  onDeleteDrawer?: (drawerId: number) => void;
}) {
  const [visibleNotes, setVisibleNotes] = useState<TNoteApp[]>(drawerNotes);
  const router = useRouter();

  useEffect(() => {
    setVisibleNotes(drawerNotes);
  }, [drawerNotes]);

  const searchedWords =
    visibleNotes.filter((w) =>
      w.dictionary_words.word.toLowerCase().includes(search.toLowerCase().trim())
    ) ?? [];

  function handleRemoveNote(noteId: number) {
    setVisibleNotes((prev) => prev.filter((n) => n.id !== noteId));

    setTimeout(() => {
      router.refresh();
    }, EXIT_DURATION_MS);
  }

  return (
    <>
      <Drawer
        key={drawer.id}
        drawer={drawer}
        allNotes={allNotes}
        drawerNotes={visibleNotes}
        onDeleted={onDeleteDrawer}
        openDrawerById={(id: number) => openDrawerById(id)}
        isDrawerOpened={true}
      />
      {visibleNotes.length === 0 ? (
        <div className="mt-5 box-layout enter-fade">
          <p className="text-box enter-fade-up enter-delay-1">This drawer is empty.</p>
        </div>
      ) : searchedWords.length === 0 ? (
        <div className="box-layout mt-5 text-box enter-fade">No words found.</div>
      ) : (
        <Notes
          notes={searchedWords}
          isHistoryNote={false}
          drawerId={drawer.id}
          onRemoveNote={handleRemoveNote}
        />
      )}
    </>
  );
}
