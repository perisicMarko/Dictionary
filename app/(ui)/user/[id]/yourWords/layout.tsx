import "@/app/globals.css";
import { logOut } from '@/actions/auth';
import Link from 'next/link';
import Image from "next/image";


export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}>) {

  const { id } = await params; 

  return (
    <>
        <nav className="bg-slate-900 w-full h-[50px] grid grid-cols-[auto_1fr] items-center">
          <div className="flex justify-start items-center ml-3 md:ml-7">
            <form action={logOut}>
              <button className="hover:scale-110 scale-105 cursor-pointer"> <Image src='/logOut.svg' alt='logOut icon' width={20} height={20}></Image> </button>
            </form>
          </div>
            <div className="flex justify-end items-center xl:space-x-5 mr-2 sm:mr-5">
              <Link id='layoutInputLink' href={'/user/' + id + '/inputWord'} className="py-1 px-1 sm:px-3 navigationBtn text-white"> Input word </Link>
              <Link id='layoutRecallLink' href={'/user/' + id + '/recall'} className="py-1 px-1 sm:px-3 navigationBtn text-white"> Recall </Link>
              <Link id='layoutHistoryLink' href={'/user/' + id + '/yourWords'} className="py-1 px-1 sm:px-3 navigationBtn text-blue-400"> Your words </Link>
              <Link id='layoutLearnedLink' href={'/user/' + id + '/history'} className="py-1 px-1 sm:px-3 navigationBtn text-white"> Learned words </Link>
            </div>
        </nav>
        
        {children}
    </>
  );
}
