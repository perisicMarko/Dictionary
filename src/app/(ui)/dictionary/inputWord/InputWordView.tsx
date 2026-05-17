import GenerateNoteForm from "./GenerateNoteForm";

export default function InputWordView({ savedWords }: { savedWords: string[] }) {

  return (
        <GenerateNoteForm savedWords={savedWords} />
  );
}
