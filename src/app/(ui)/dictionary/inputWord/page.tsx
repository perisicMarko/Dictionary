import { getUsersWords } from "@/features/notes/application";
import InputWordView from "./InputWordView";

export default async function UserInput() {
  const wordsResult = await getUsersWords();
  const initialWords = wordsResult.success ? (wordsResult.data as string[]) : [];

  return <InputWordView initialWords={initialWords} />;
}
