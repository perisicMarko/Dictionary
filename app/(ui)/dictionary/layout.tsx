"use client";
import "@/app/globals.css";
import { NavBar } from './../../../components/NavBar';
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { TokenContextProvider } from "@/components/TokenContextProvider";
import { useContext } from "react";
import { TokenContext } from "@/components/TokenContextProvider";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname();
  const router = useRouter();
  const tokenContext = useContext(TokenContext);
  
  const handleSubmit = async (e : React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/auth/logOut', {
      method: "POST",
      credentials: 'include',
    });

    tokenContext?.setAccessToken('');
    router.push('/');
  }
  
  return (
    <TokenContextProvider>
      <NavBar handleSubmit={handleSubmit} accessToken={tokenContext?.accessToken} path={path}/> 
      {children}
    </TokenContextProvider>
  );
}
