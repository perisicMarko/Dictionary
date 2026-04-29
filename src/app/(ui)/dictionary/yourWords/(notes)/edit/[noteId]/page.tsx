import EditNotePage from "@/components/EditNotePage";
import { getNoteById } from "@/features/notes/application";
import { TNoteApp } from "@/shared/types";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    noteId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { noteId } = await params;
  const response = await getNoteById(Number(noteId));

  if (!response.success || !response.data) {
    notFound();
  }

  return (
    <EditNotePage
      pathSrc="/dictionary/yourWords"
      note={response.data as TNoteApp}
    />
  );
}
