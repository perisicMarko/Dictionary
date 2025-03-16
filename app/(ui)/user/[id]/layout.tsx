import "@/app/globals.css";
import { logOut } from '@/actions/auth';
import Link from 'next/link';
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
        <nav className="bg-blue-400 w-full rounded-4xl h-[50px] grid grid-cols-3 grid-rows-1">
          <div className="col-span-1 flex justify-start items-center xl:ml-5 ml-2">
            <form action={logOut}>
              <button className="bg-red-700 xl:hover:scale-110 scale-75 sm:scale-105 border-red-400 border-2 rounded-full md:px-3 p-1 cursor-pointer text-blue-950"> Log out </button>
            </form>
          </div>
            <div className="col-span-2 flex justify-end items-center xl:space-x-5 mr-2 sm:mr-5">
              <Link href={'/user/' + id + '/recall'} className="text-center scale-80 xl:scale-105 bg-blue-950 hover:bg-blue-400 xl:hover:scale-110 cursor-pointer rounded-full xl:border-2 text-blue-50 py-1 px-1 sm:px-3"> Recall </Link>
              <Link href={'/user/' + id} className="text-center scale-80 xl:scale-105  bg-blue-950 hover:bg-blue-400 xl:hover:scale-110 cursor-pointer rounded-full xl:border-2 text-blue-50 py-1 px-1 sm:px-3"> Input word </Link>
              <Link href={'/user/' + id + '/history'} className="text-center  scale-80 xl:scale-105 bg-blue-950 hover:bg-blue-400 xl:hover:scale-110 cursor-pointer rounded-full xl:border-2 py-1 px-1 text-blue-50 sm:px-3"> Learned words </Link>
              <Link href={'/user/' + id + '/yourWords'} className="text-center scale-80 xl:scale-105 bg-blue-950 hover:bg-blue-400 xl:hover:scale-110 cursor-pointer rounded-full xl:border-2 text-blue-50 py-1 px-1 sm:px-3"> Your words </Link>
            </div>
        </nav>
        
        {children}
    </>
  );
}
