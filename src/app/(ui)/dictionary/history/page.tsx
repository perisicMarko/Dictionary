import { getUsersHistory } from "@/features/notes/application";
import { TNoteApp } from "@/shared/types";
import HistoryView from "./HistoryView";
import { redirect } from "next/navigation";

export default async function History() {
  const words = await getUsersHistory();
  if(!words.success){
    redirect("/login");
  }
  const initialWords = words.data as TNoteApp[];

  return <HistoryView initialWords={initialWords} />;
}
