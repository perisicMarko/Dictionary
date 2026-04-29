import { getUsersDrawers } from "@/features/drawers/application";
import { getUsersNotes } from "@/features/notes/application";
import { TDrawer, TNoteApp } from "@/shared/types";
import ShowDrawersView from "./ShowDrawersView";

export default async function ShowDrawers() {
  const drawersRes = await getUsersDrawers();
  const notesRes = await getUsersNotes();

  const initialDrawers = drawersRes.success ? (drawersRes.data as TDrawer[]) : [];
  const initialNotes = notesRes.success ? (notesRes.data as TNoteApp[]) : [];

  return (
    <ShowDrawersView
      initialDrawers={initialDrawers}
      initialNotes={initialNotes}
      isAuthenticated={drawersRes.success && notesRes.success}
    />
  );
}
