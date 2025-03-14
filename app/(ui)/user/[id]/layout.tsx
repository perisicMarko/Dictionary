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
        <nav className="bg-blue-400 block w-full rounded-4xl h-[50px]">
          <div className="flex sm:justify-start justify-between items-center top-2 sm:mb-5 ml-1 mt-2 sm:ml-10">
            <form className="inline-block" action={logOut}>
              <button className="bg-red-700 sm:hover:scale-110 scale-75 sm:scale-105 border-red-400 border-2 rounded-full sm:px-3 p-1 cursor-pointer text-blue-950"> Log out </button>
            </form>
            <Link href={'/user/' + id + '/recall'} className="sm:ml-320 scale-80 sm:scale-105 bg-blue-950 hover:bg-blue-400 sm:hover:scale-110 cursor-pointer rounded-full sm:border-2 text-blue-50 py-1 px-1 sm:px-3"> Recall </Link>
            <Link href={'/user/' + id} className="sm:ml-5 scale-75 sm:scale-105  bg-blue-950 hover:bg-blue-400 sm:hover:scale-110 cursor-pointer rounded-full sm:border-2 text-blue-50 py-1 px-1 sm:px-3"> Home page </Link>
            <Link href={'/user/' + id + '/history'} className="sm:ml-5  scale-75 sm:scale-105 bg-blue-950 hover:bg-blue-400 sm:hover:scale-110 cursor-pointer rounded-full sm:border-2 py-1 px-1 text-blue-50 sm:px-3"> Word history </Link>
            <Link href={'/user/' + id + '/yourWords'} className="sm:ml-5  scale-75 sm:scale-105 bg-blue-950 hover:bg-blue-400 sm:hover:scale-110 cursor-pointer rounded-full sm:border-2 text-blue-50 py-1 px-1 sm:px-3"> Your words</Link>
          </div>
        </nav>
        
        {children}
    </>
  );
}
