import { redirect } from "next/navigation";
import { getUsersBySchool } from "@/features/auth/application/users";
import StudentsView from "./StudentsView";
import { TStudent } from "@/shared/types";

export default async function Page() {
  const usersRes = await getUsersBySchool();

  if (!usersRes.success) {
    redirect("/school");
  }

  return <StudentsView initialUsers={usersRes.data as TStudent[]} />;
}
