import EditNotePage from "@/features/notes/edit/ui/EditNotePage";
import { getNoteById } from "@/features/notes/edit/application";
import { TNoteApp } from "@/shared/types";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    noteId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { noteId } = await params;
  const response : { success: boolean, data?: undefined | TNoteApp } = await getNoteById(Number(noteId));

  if (!response?.success) {
    redirect('/login');
  }

  return (
    <EditNotePage
      pathSrc="/notes/recall"
      note={response.data as TNoteApp}
    />
  );
}
