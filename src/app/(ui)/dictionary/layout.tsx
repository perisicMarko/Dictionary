"use client";
import "@/app/globals.css";
import { NavBar } from "./../../../components/NavBar";
import { TokenContextProvider } from "@/components/TokenContextProvider";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  useEffect(() => {
    const handleClick = () => {
      setAppClickInteraction(true);
    };

    document.addEventListener("click", handleClick, true); // <- capture mode

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  const [appClickInteraction, setAppClickInteraction] = useState(false); // used to inform NavBar that should collapse on the phones when something is clicked

  return (
    <>
      <NavBar
        shouldCollapse={appClickInteraction}
        resetCollapseFromParent={(a: boolean) => setAppClickInteraction(a)}
      />
      {children}
    </>
  );
}
