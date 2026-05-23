import { getUsersWords } from "@/features/notes/inputWord/application";
import GenerateNoteForm from "./GenerateNoteForm";

export default async function UserInput() {
  const wordsResult = await getUsersWords();
  const savedWords = wordsResult.success ? (wordsResult.data as string[]) : [];

  return <GenerateNoteForm savedWords={savedWords} />;
}
