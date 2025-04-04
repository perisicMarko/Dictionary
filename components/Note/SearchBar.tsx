import { motion } from "framer-motion";
import Image from "next/image";
import { itemVariants } from "@/lib/animationVariants";
import { useRef } from "react";

export function SearchBar({
  toggleHelp,
  updateSearch,
}: {
  toggleHelp: () => void;
  updateSearch: (arg: string) => void;
}) {
  const searchBarRef = useRef<HTMLInputElement>(null);
  
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={itemVariants}
      className="mt-10 w-3/4 sm:w-[600px] bg-slate-800 rounded-4xl grid grid-cols-[auto_auto_1fr] items-center"
    >
      <span
        className="text-white md:ml-4 ml-3 cursor-pointer hover:scale-115 rounded-full text-2xl"
        title="click for help"
        onClick={() => toggleHelp()}
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
  );
}
