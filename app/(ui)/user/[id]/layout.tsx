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
          <div className="flex justify-start my-3 ml-10">
            <form className="inline-block" action={logOut}>
              <button className="bg-red-700 hover:scale-110 border-red-400 border-2 rounded-full px-3 cursor-pointer text-blue-950"> Log out </button>
            </form>
            <Link href={'/user/' + id + '/recall'} className="ml-320 bg-blue-950 hover:bg-blue-400 hover:scale-110 cursor-pointer rounded-full border-2 text-blue-50 px-3"> Recall </Link>
            <Link href={'/user/' + id} className="ml-5  bg-blue-950 hover:bg-blue-400 hover:scale-110 cursor-pointer rounded-full border-2 text-blue-50 px-3"> Home page </Link>
            <Link href={'/user/' + id + '/history'} className="ml-5  bg-blue-950 hover:bg-blue-400 hover:scale-110 cursor-pointer rounded-full border-2 text-blue-50 px-3"> Word history </Link>
            <Link href={'/user/' + id + '/yourWords'} className="ml-5  bg-blue-950 hover:bg-blue-400 hover:scale-110 cursor-pointer rounded-full border-2 text-blue-50 px-3"> Your words</Link>
          </div>
        </nav>
        
        {children}
    </>
  );
}
