import EditNotePage from "@/features/notes/edit/ui/EditNotePage";
import { getNoteById } from "@/features/notes/edit/application";
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
      pathSrc="/notes/yourWords"
      note={response.data as TNoteApp}
    />
  );
}
