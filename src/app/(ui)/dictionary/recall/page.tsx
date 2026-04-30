import RecallNoteHelp from "@/app/(ui)/dictionary/recall/Help";
import { getRecallNotes } from "@/features/notes/application";
import { redirect } from "next/navigation";
import { TNoteApp } from "@/shared/types";
import RecallNote from "@/app/(ui)/dictionary/recall/RecallNote";
import ZeroNotesMessage from "@/components/common/ZeroNotesMessage";

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
        recallNotes.map((w: TNoteApp) => {
          return (
            <RecallNote
              key={w.id}
              note={w}
            />
          );
        })
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
