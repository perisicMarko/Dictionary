// import { useEffect, useState } from "react";
import { TDrawer, TNoteApp } from "@/shared/types";
import { getUsersNotes } from "@/features/notes";
import { getUsersDrawers, getNoteDrawerMapping} from "@/features/drawers";
import ToggleViewButton from "./ToggleViewButton";
import ItemsView from "./ItemsView";
import { redirect } from "next/navigation";

export default async function Page() {
  const drawersRes = await getUsersDrawers();
  const notesRes = await getUsersNotes();
  const resDrawerNoteMapping = await getNoteDrawerMapping();

  const isAuthenticated = drawersRes.success && notesRes.success && resDrawerNoteMapping.success;

  if(!isAuthenticated){
    redirect('/login');
    return;
  }

  const drawers = drawersRes.data as TDrawer[];
  const notes = notesRes.data as TNoteApp[];
  const drawerNoteMapping = resDrawerNoteMapping.data as {note_id: number, drawer_id: number}[];

  return (
    <>
      <ToggleViewButton />
      <ItemsView notes={notes} drawers={drawers} drawerNoteMapping={drawerNoteMapping} />
    </>
  );
}
