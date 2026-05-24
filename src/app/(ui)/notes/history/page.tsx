import { getUsersHistoryNotes } from "@/features/notes/history/application";
import { TNoteApp } from "@/shared/types";
import HistoryView from "@/features/notes/history/ui/HistoryView";
import { redirect } from "next/navigation";

export default async function History() {
  const words = await getUsersHistoryNotes();
  if(!words.success){
    redirect("/login");
  }
  const learnedWords = words.data as TNoteApp[];

  return <HistoryView learnedWords={learnedWords} />;
}
