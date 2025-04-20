import { motion } from "framer-motion";
import Image from "next/image";
import { itemVariants } from "@/lib/animationVariants";
import { useEffect, useRef, useState } from "react";
import { containerVariants } from "@/lib/animationVariants";

export function SearchBar({
  updateSearch,
  children
}: {
  updateSearch: (arg: string) => void;
  children: React.ReactElement;
}) {
  const searchBarRef = useRef<HTMLInputElement>(null);
  const [help, setHelp] = useState(false);

  useEffect(() => {
    const eventHandler = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (activeElement?.tagName.toLowerCase() === 'input' || activeElement?.tagName.toLowerCase() === 'textarea')
        return;
      
      if(event.key.toLowerCase() === 'f'){
        event.preventDefault();
        searchBarRef.current?.focus();
      }
    }
    document.addEventListener('keydown', eventHandler);

    return () => document.removeEventListener('keydown', eventHandler);
  }, []);

  return (
    <>
    <motion.div
      initial="hidden"
      animate="show"
      variants={itemVariants}
      className="mt-15 w-3/4 sm:w-[600px] bg-slate-800 rounded-4xl grid grid-cols-[auto_auto_1fr] items-center"
    >
      <span
        className="text-white md:ml-4 ml-3 cursor-pointer hover:scale-115 rounded-full text-2xl"
        title="click for help"
        onClick={() => setHelp(!help)}
      >
        ?
      </span>
      <Image
        src="/magnifyGlass.svg"
        alt="magnify glass icon"
        width={20}
        height={20}
        className="inline-block md:ml-4 ml-1 scale-90 md:scale-100"
        onClick={() => {
          searchBarRef?.current?.focus();
        }}
      ></Image>
      <input
        className="text-white p-2 inline-block outline-0 rounded-r-4xl"
        ref={searchBarRef}
        type="text"
        name="search"
        placeholder="Search for words here..."
        onChange={(e) => {
          updateSearch(e.target.value);
        }}
      />
    </motion.div>
    {help && 
      <motion.div
             initial="hidden"
             animate="show"
             variants={containerVariants}
             className="bg-slate-800 w-3/4 sm:w-[600px] mt-5 rounded-3xl text-white"
           >
        <div className="flex justify-end bg-slate-950 rounded-t-2xl">
          <span className="xBtn mr-4 py-1" onClick={() => setHelp(!help)}>
            <b>x</b>
          </span>
        </div>
        {children}
      </motion.div>
    }
    </>
  );
}
