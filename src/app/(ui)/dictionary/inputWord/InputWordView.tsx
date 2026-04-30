import SaveNoteForm from "./SaveNoteForm";

export default function InputWordView({ initialWords }: { initialWords: string[] }) {

  return (
        <SaveNoteForm initialWords={initialWords} />
  );
}
