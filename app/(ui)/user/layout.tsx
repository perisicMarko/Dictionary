'use client'
import "@/app/globals.css";
import Link from 'next/link';
import { logOut } from '@/actions/auth';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
        <nav className="bg-blue-400 block w-full rounded-4xl h-[50px]">
          <div className="flex justify-start my-3 ml-10">
            <form className="inline-block" action={logOut}>
              <button className="bg-red-700 hover:scale-110 border-red-400 border-2 rounded-full px-3 cursor-pointer text-blue-950"> Log out </button>
            </form>
            <Link href='/user' className="ml-340  bg-blue-950 hover:bg-blue-400 hover:scale-110 cursor-pointer rounded-full border-2 text-blue-50 px-3"> Home page </Link>
            <Link href='/user/history' className="ml-5  bg-blue-950 hover:bg-blue-400 hover:scale-110 cursor-pointer rounded-full border-2 text-blue-50 px-3"> Word history </Link>
            <Link href='/user/yourWords' className="ml-5  bg-blue-950 hover:bg-blue-400 hover:scale-110 cursor-pointer rounded-full border-2 text-blue-50 px-3"> Your words</Link>
          </div>
        </nav>
        
        {children}
    </>
  );
}
