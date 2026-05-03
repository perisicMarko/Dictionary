import { redirect } from "next/navigation";
import { decryptSession } from "@/server/auth/schoolSession";

export default async function SchoolSignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await decryptSession();

  if (session.success) {
    redirect("/school/platform/students");
  }

  return children;
}
