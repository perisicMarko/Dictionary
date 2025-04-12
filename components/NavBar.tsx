'use client'
import { useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import { TokenContext } from "@/components/TokenContextProvider";
import { motion } from 'framer-motion';
import { containerVariants } from "@/lib/animationVariants";

export function NavBar() {
    const path = usePathname();
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(true);
    const tokenContext = useContext(TokenContext);
    const accessToken = tokenContext?.accessToken;
    
    const handleSubmit = async (e : React.FormEvent) => {
      e.preventDefault();
      await fetch('/api/auth/logOut', {
        method: "POST",
        credentials: 'include',
      });
  
      tokenContext?.setAccessToken('');
      router.push('/');
    }

    useEffect(() => {
      let lastScrollY = window.scrollY;

      const controlScroll = () => {
        const currentScrollY = window.scrollY;
        if(currentScrollY > lastScrollY && currentScrollY > 100)
          setIsVisible(false);
        else
          setIsVisible(true);

          lastScrollY = currentScrollY;
      }

      window.addEventListener("scroll", controlScroll);

      return () => window.removeEventListener("scroll", controlScroll);
    }, []);


    
  return (
    isVisible && 
    <motion.nav initial='hidden' animate='show' variants={containerVariants} className="fixed top-0 z-20 bg-slate-800 w-full h-[50px] grid grid-cols-[auto_1fr] items-center">
      <div className="flex justify-start items-center ml-3 md:ml-7">
        <form onSubmit={handleSubmit} method="POST">
          <input name="accessToken" value={accessToken} hidden readOnly />
          <button
            type="submit"
            className="hover:scale-115 scale-105 cursor-pointer"
          >
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
    </motion.nav>
  );
}
