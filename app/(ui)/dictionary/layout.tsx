"use client";
import "@/app/globals.css";
import Link from "next/link";
import Image from "next/image";
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
   return; 
  }
  

  return (
    <TokenContextProvider>
      <nav className="bg-slate-900 w-full h-[50px] grid grid-cols-[auto_1fr] items-center">
        <div className="flex justify-start items-center ml-3 md:ml-7">
          <form
          onSubmit={handleSubmit}
          method="POST">
            <input name='accessToken' value={tokenContext?.accessToken} hidden readOnly/>
            <button type='submit' className="hover:scale-115 scale-105 cursor-pointer">
              {" "}
              <Image
                src="/logOut.svg"
                alt="logOut icon"
                width={20}
                height={20}
              ></Image>{" "}
            </button>
          </form>
        </div>
        <div className="flex justify-end items-center xl:space-x-5 mr-2 sm:mr-5">
          <Link
            id="layoutInputLink"
            href={"/dictionary/inputWord"}
            className={`nav-link ${
              path === "/dictionary/inputWord" ? "text-blue-400" : "text-white"
            } py-1 px-1 sm:px-3 navigationBtn`}
          >
            {" "}
            Input word{" "}
          </Link>
          <Link
            id="layoutRecallLink"
            href={"/dictionary/recall"}
            className={`nav-link ${
              path === "/dictionary/recall" ? "text-blue-400" : "text-white"
            } py-1 px-1 sm:px-3 navigationBtn`}
          >
            {" "}
            Recall{" "}
          </Link>
          <Link
            id="layoutHistoryLink"
            href={"/dictionary/yourWords"}
            className={`nav-link ${
              path === "/dictionary/yourWords" ? "text-blue-400" : "text-white"
            } py-1 px-1 sm:px-3 navigationBtn`}
          >
            {" "}
            Your words{" "}
          </Link>
          <Link
            id="layoutLearnedLink"
            href={"/dictionary/history"}
            className={`nav-link ${
              path === "/dictionary/history" ? "text-blue-400" : "text-white"
            } py-1 px-1 sm:px-3 navigationBtn`}
          >
            {" "}
            Learned words{" "}
          </Link>
        </div>
      </nav>

      {children}
    </TokenContextProvider>
  );
}
