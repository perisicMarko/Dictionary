import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { containerVariants } from "@/lib/animationVariants";
import { ArrowUpDown, Search } from "lucide-react";

export const SORT = {
  BY_DATE_DESC: 0,
  BY_DATE_ASC: 1,
  BY_RECALL_DATE_DESC: 2,
  BY_RECALL_DATE_ASC: 3,
};

export default function SearchBar({
  updateSearch,
  placeholder,
  sortBy,
  changeSortBy,
  children
}: {
  updateSearch: (arg: string) => void;
  placeholder: string;
  sortBy: boolean;
  changeSortBy: (arg : number) => void;
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
      variants={containerVariants}
      className={`box-layout mt-5 !py-2 !px-1 grid grid-cols-[auto_auto_1fr] items-center ${sortBy ? '!rounded-b-none' : ''}`}
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
        className="text-white inline-block outline-0 focus:outline-none rounded-r-4xl"
        ref={searchBarRef}
        type="text"
        name="search"
        placeholder={placeholder}
        onChange={(e) => {
          updateSearch(e.target.value);
        }}
      />
    </motion.div>
    {sortBy && 
    <motion.div initial='hidden' animate='show' variants={containerVariants} className="box-layout !py-0 !px-4 !rounded-t-none relative text-white">
      <ArrowUpDown color='white' height={20} width={20} className="absolute right-3 top-auto pointer-events-none" />
              <select
                className="w-full appearance-none bg-slate-800 text-white !py-2 !px-1 rounded-3xl h-full"
                defaultValue={-1}
                onChange={(e) => changeSortBy(Number(e.target.value))}
              >
                <option value={-1} disabled>
                  Sort notes by
                </option>
                <option value={SORT.BY_DATE_ASC}>{"Date " + "\u2191"}</option>
                <option value={SORT.BY_DATE_DESC}>{"Date " + "\u2193"}</option>
                <option value={SORT.BY_RECALL_DATE_ASC}>
                  {"Recall date " + "\u2191"}
                </option>
                <option value={SORT.BY_RECALL_DATE_DESC}>
                  {"Recall date " + "\u2193"}
                </option>
              </select>
    </motion.div>
    }
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
