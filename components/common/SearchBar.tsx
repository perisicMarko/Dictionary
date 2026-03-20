import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
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
  children,
}: {
  updateSearch: (arg: string) => void;
  placeholder: string;
  sortBy: boolean;
  changeSortBy: (arg: number) => void;
  children: React.ReactElement;
}) {
  const searchBarRef = useRef<HTMLInputElement>(null);
  const [help, setHelp] = useState(false);

  useEffect(() => {
    const eventHandler = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (
        activeElement?.tagName.toLowerCase() === "input" ||
        activeElement?.tagName.toLowerCase() === "textarea"
      )
        return;

      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        searchBarRef.current?.focus();
      }
    };
    document.addEventListener("keydown", eventHandler);

    return () => document.removeEventListener("keydown", eventHandler);
  }, []);

  return (
    <>
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="box-layout !p-0 mt-5"
      >
        <motion.div
          initial="hidden"
          animate="show"
          variants={itemVariants}
          className={`!py-2 !px-1 grid grid-cols-[auto_auto_1fr] items-center ${
            sortBy ? "!rounded-b-none" : ""
          }`}
        >
          <span
            className="text-text-main md:ml-4 ml-2 cursor-pointer hover:scale-115 rounded-full text-2xl transition-all"
            title="Click for help"
            onClick={() => setHelp(!help)}
          >
            ?
          </span>
          <Search
            color="white"
            className="inline-block md:mx-2 mx-1 scale-90"
            onClick={() => {
              searchBarRef?.current?.focus();
            }}
          />
          <input
            className="text-text-main inline-block outline-0 focus:outline-none rounded-r-4xl"
            ref={searchBarRef}
            type="text"
            name="search"
            placeholder={placeholder}
            onChange={(e) => {
              updateSearch(e.target.value);
            }}
          />
        </motion.div>
        {sortBy && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="py-0 !px-4 !rounded-t-none text-text-main center justify-between"
          >
            <select
              className="w-full appearance-none sm:hover:text-text-second cursor-pointer text-text-main !py-2 !px-1 rounded-3xl h-full"
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
            <ArrowUpDown
              color="white"
              height={20}
              width={20}
              className="right-3 pointer-events-none"
            />
          </motion.div>
        )}
      </motion.div>
      {help && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="box-layout mt-5 text-text-main relative"
        >
          <div className="collapse-window">
            <span className="x-btn mr-4 py-1" onClick={() => setHelp(!help)}>
              <b>x</b>
            </span>
          </div>
          {children}
        </motion.div>
      )}
    </>
  );
}
