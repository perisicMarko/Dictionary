'use client'
import "@/app/globals.css";
import Link from 'next/link';
import React, { useState } from "react";
import { logOut } from '@/lib/auth';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [showHint, setShowHint] = useState(false);

  return (
    <>
        <nav className="bg-blue-300 block w-full h-[50px]">
          <div className="flex justify-start my-3 ml-10">
            <form className="inline-block" action={logOut}>
              <button className="bg-red-700 hover:scale-110 border-red-400 border-2 rounded-full px-3 cursor-pointer text-blue-950"> Log out </button>
            </form>
            <span className="ml-187 hover:underline textThemeColor" onClick={() => setShowHint(!showHint)}><b>Click for learning hint</b></span>
            <Link href='history' className="ml-150  bg-blue-950 hover:bg-blue-400 hover:scale-110 cursor-pointer rounded-full border-2 text-blue-50 px-3"> Word history </Link>
            <Link href='yourWords' className="ml-5  bg-blue-950 hover:bg-blue-400 hover:scale-110 cursor-pointer rounded-full border-2 text-blue-50 px-3"> Your words</Link>
          </div>
        </nav>
        {children}
    </>
  );
}
