import "@/app/globals.css";
import NavBar from "@/schoolComponents/NavBar";
import { decryptSession } from "@/server/auth/schoolSession";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await decryptSession();

  if (!session.success) {
    redirect("/school");
  }

  return (
    <>
      <NavBar/> 
      {children}
    </>
  );
}
