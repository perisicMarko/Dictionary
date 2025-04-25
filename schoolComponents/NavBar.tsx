'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { containerVariants } from '@/lib/animationVariants';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { logOut } from '@/actions/auth/school';

export default function NavBar(){
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(true);

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

    const handleLogOut = async () => {
        await logOut();
        console.log('hello logout');
        router.push('/school');
      };

    return (
        isVisible && 
        <motion.nav initial='hidden' animate='show' variants={containerVariants} className="fixed top-0 z-20 bg-slate-800 w-full h-[50px] grid grid-cols-[auto_1fr] items-center">
        <div className="flex justify-start items-center ml-3 md:ml-7">
          <button
            onClick={() => handleLogOut()}
            className="hover:scale-115 scale-105 cursor-pointer"
          >
            {" "}
            <Image
              src="/logOut.svg"
              alt="logOut icon"
              width={20}
              height={20}
              priority
            ></Image>{" "}
          </button>
        </div>
      </motion.nav>
    );
}