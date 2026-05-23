import { readAuthenticatedUser } from "@/server/auth/userSession";
import { findAllNotesByUserId } from "../../infrastructure/repository";
import { logOutUser } from "@/features/auth";


export async function getUsersLearningNotes() {
  const user = await readAuthenticatedUser();
  if (!user) {
    await logOutUser();
    return { success: false };
  }

  const { userId } = user;
  const notes = (await findAllNotesByUserId(userId) as any[]);
  return {
    success: true,
    data: notes.filter((w) => {
      const res = w.is_learned == false;
      return res;
    })
  };
}