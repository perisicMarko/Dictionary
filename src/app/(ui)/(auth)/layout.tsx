import { readAuthenticatedUser } from "@/server/auth/userSession";
import { redirect } from "next/navigation";

export default async function SignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await readAuthenticatedUser();

  if (user) {
    redirect("/dictionary/inputWord");
  }

  return children;
}
