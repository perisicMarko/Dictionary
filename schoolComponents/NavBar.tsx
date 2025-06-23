'use client';
import { motion } from 'framer-motion';
import { containerVariants } from '@/lib/animationVariants';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { logOut } from '@/actions/auth/school';
import Link from 'next/link';
import { LogOut } from 'lucide-react';

export default function NavBar(){
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(true);
    const path = usePathname();

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
        router.push('/school');
      };

    return (
      isVisible && 
      <motion.nav initial='hidden' animate='show' variants={containerVariants} className="fixed top-0 z-20 bg-main w-full h-[50px] grid grid-cols-[auto_1fr] items-center">
        <div className="flex justify-start items-center ml-3 md:ml-7">
          <button
            onClick={() => handleLogOut()}
            className="hover:scale-115 scale-105 transition-all cursor-pointer text-white hover:text-second"
          >
            <LogOut
              width={20}
              height={20}
            />
          </button>
        </div>
        <div className='flex justify-end xl:space-x-5 mr-2 sm:mr-5'>
          <Link href='/school/generateKey'
           className={`nav-link ${
             path === "/school/generateKey" ? "text-second" : "text-white"
           } py-1 px-1 sm:px-3 navigationBtn`}
          >
            Generate key
          </Link>
          <Link href='/school/students'
           className={`nav-link ${
             path === "/school/students" ? "text-second" : "text-white"
           } py-1 px-1 sm:px-3 navigationBtn`}
          >
            Students
          </Link>
        </div>
      </motion.nav>
    );
}