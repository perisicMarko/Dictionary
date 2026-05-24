import RecallNoteHelp from "@/features/notes/recall/ui/Help";
import { getRecallNotes } from "@/features/notes/recall";
import { redirect } from "next/navigation";
import { TNoteApp } from "@/shared/types";
import RecallNotesList from "@/features/notes/recall/ui/RecallNotesList";
import ZeroNotesMessage from "@/features/notes/ui/ZeroNotesMessage";

export default async function Page() {
  const recallNotesRes = await getRecallNotes();

  if (!recallNotesRes.success) {
    redirect('/login');
  }

  const recallNotes = recallNotesRes.data as TNoteApp[];

  return (
    <>
      <RecallNoteHelp />
      {recallNotes.length > 0 ? (
        <RecallNotesList initialNotes={recallNotes} />
      ) : (
        <ZeroNotesMessage
          message={
            "Great! You have no words to recall at the moment. Keep up the good work!"
          }
        />
      )}
    </>
  );
}
