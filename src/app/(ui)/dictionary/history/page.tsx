import { getUsersHistory } from "@/features/notes/application";
import { TNoteApp } from "@/shared/types";
import HistoryView from "./HistoryView";

export default async function History() {
  const words = await getUsersHistory();
  const initialWords = words?.success ? (words.data as TNoteApp[]) : [];

  return <HistoryView initialWords={initialWords} />;
}
