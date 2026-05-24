import "@/app/globals.css";
import { NavBar } from "@/reusableComponents/NavBar";
import { readAuthenticatedUser } from "@/server/auth/userSession";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await readAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
