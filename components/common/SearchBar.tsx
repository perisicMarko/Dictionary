import { motion } from "framer-motion";
import { itemVariants } from "@/lib/animationVariants";
import { useEffect, useRef, useState } from "react";
import { containerVariants } from "@/lib/animationVariants";
import { Search } from "lucide-react";

export function SearchBar({
  updateSearch,
  placeholder,
  children
}: {
  updateSearch: (arg: string) => void;
  placeholder: string;
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
      className="mt-5 box-layout !p-0 grid grid-cols-[auto_auto_1fr] items-center"
    >
      <span
        className="text-white md:ml-4 ml-3 cursor-pointer hover:scale-115 rounded-full text-2xl"
        title="click for help"
        onClick={() => setHelp(!help)}
      >
        ?
      </span>
      <Search
       color="white"
       className="inline-block md:ml-4 ml-1 scale-90"
       onClick={() => {
         searchBarRef?.current?.focus();
       }}
      />
      <input
        className="text-white p-2 inline-block outline-0 focus:outline-none rounded-r-4xl"
        ref={searchBarRef}
        type="text"
        name="search"
        placeholder={placeholder}
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
             className="box-layout mt-5 text-white relative"
           >
        <div className="collapse-window">
          <span className="x-btn mr-4 py-1" onClick={() => setHelp(!help)}>
            <b>x</b>
          </span>
        </div>
        {children}
      </motion.div>
    }
    </>
  );
}
