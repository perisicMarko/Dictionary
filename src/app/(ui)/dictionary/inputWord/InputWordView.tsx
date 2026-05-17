import GenerateNoteForm from "./GenerateNoteForm";

export default function InputWordView({ initialWords }: { initialWords: string[] }) {

  return (
        <GenerateNoteForm initialWords={initialWords} />
  );
}
