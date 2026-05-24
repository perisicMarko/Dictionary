"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { ArrowUpDown, Search, CircleHelp, X } from "lucide-react";

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
  children: ReactNode;
}) {
  const searchBarRef = useRef<HTMLInputElement>(null);
  const [help, setHelp] = useState(false);

  useEffect(() => {
    const eventHandler = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (
        activeElement?.tagName.toLowerCase() === "input" ||
        activeElement?.tagName.toLowerCase() === "textarea" ||
        activeElement?.getAttribute("contenteditable") === "true"
      )
        return;

      if (!event.ctrlKey && !event.metaKey && !event.altKey && event.key.toLowerCase() === "f") {
        event.preventDefault();
        searchBarRef.current?.focus();
      }
    };
    document.addEventListener("keydown", eventHandler);

    return () => document.removeEventListener("keydown", eventHandler);
  }, []);

  return (
    <>
      <div className="box-layout !p-2 mt-5 enter-fade">
        <div
          className={`!py-2 !px-2 !md:px-5 grid grid-cols-[auto_auto_1fr] items-center  ${
            sortBy ? "!rounded-b-none" : ""
          } enter-fade-up`}
        >
          <button
            type="button"
            className="text-text-main md:ml-4 pl-0 ml-0 md:pl-2 cursor-pointer hover:text-text-second rounded-full transition-all"
            title="Click for help"
            aria-label="Open search help"
            onClick={() => setHelp(!help)}
          >
            <CircleHelp />
          </button>
          <Search
            color="white"
            className="inline-block md:mx-2 mx-1 scale-90"
            onClick={() => {
              searchBarRef.current?.focus();
            }}
          />
          <input
            className="text-text-main inline-block outline-0 focus:outline-none rounded-r-4xl text-sm"
            ref={searchBarRef}
            type="text"
            name="search"
            placeholder={placeholder}
            onChange={(e) => {
              updateSearch(e.target.value);
            }}
          />
        </div>
        {sortBy && (
          <div className="py-2 !px-3 !md:px-5 !rounded-t-none text-text-main center justify-between enter-fade-up enter-delay-1">
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
              className="pointer-events-none"
            />
          </div>
        )}
      </div>
      {help && (
        <div className="box-layout mt-3 text-text-main relative enter-fade">
          <div className="collapse-window mb-5">
            <button
              type="button"
              className="x-btn mr-4 py-1"
              aria-label="Close search help"
              onClick={() => setHelp(!help)}
            >
              <X/>
            </button>
          </div>
          {children}
        </div>
      )}
    </>
  );
}
