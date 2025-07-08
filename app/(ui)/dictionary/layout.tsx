'use client';
import "@/app/globals.css";
import { NavBar } from './../../../components/NavBar';
import { TokenContextProvider } from "@/components/TokenContextProvider"; 
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [appClickInteraction, setAppClickInteraction] = useState(false); // used to inform NavBar that should collapse on the phones when something is clicked

  return (
    <TokenContextProvider>
      <NavBar shouldCollapse={appClickInteraction} resetCollapseFromParent={(a : boolean) => setAppClickInteraction(a)}/> 
      <div className="w-full center-vertically" onClick={() => setAppClickInteraction(true)}>
        {children}
      </div>
    </TokenContextProvider>
  );
}
