'use server'
import "@/app/globals.css";
import { logOut } from '@/actions/auth';
import Link from 'next/link';
import Image
 from "next/image";
export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { id: string };
}>) {

  const { id } = await params; 

  return (
    <>
        <nav className="bg-slate-900 w-full rounded-4xl h-[50px] grid grid-cols-[auto_1fr] items-center">
          <div className="flex justify-start items-center xl:ml-5 ml-2">
            <form action={logOut}>
              <button className="hover:scale-110 cursor-pointer ml-2"> <Image src='/logOut.svg' alt='logOut icon' width={20} height={20}></Image> </button>
            </form>
          </div>
            <div className="flex justify-end items-center xl:space-x-5 mr-2 sm:mr-5">
              <Link href={'/user/' + id} className="xl:scale-105 py-1 px-1 sm:px-3 navigationBtn"> Input word </Link>
              <Link href={'/user/' + id + '/recall'} className=" xl:scale-105 py-1 px-1 sm:px-3 navigationBtn"> Recall </Link>
              <Link href={'/user/' + id + '/yourWords'} className="xl:scale-105 py-1 px-1 sm:px-3 navigationBtn"> Your words </Link>
              <Link href={'/user/' + id + '/history'} className="xl:scale-105 py-1 px-1 sm:px-3 navigationBtn"> Learned words </Link>
            </div>
        </nav>
        
        {children}
    </>
  );
}
