"use client";

import { useEffect, useState } from "react";
import { TNoteApp } from "@/shared/types";
import ShowNotes from "./(notes)/ShowNotes";
import ShowDrawers from "./(drawers)/ShowDrawers";
import { ChevronUp } from "lucide-react";

const DRAWER_LAYOUT_KEY = "toggleDrawers";

export default function YourWords() {
  const [initialNotes, setInitialNotes] = useState<TNoteApp[] | null>(null);
  const [showDrawers, setShowDrawers] = useState(false);
  const [scrollToTop, setScrollToTop] = useState(false);

  useEffect(() => {
    const storedValue = sessionStorage.getItem(DRAWER_LAYOUT_KEY);

    if (storedValue === null) {
      sessionStorage.setItem(DRAWER_LAYOUT_KEY, "false");
      return;
    }

    setShowDrawers(storedValue === "true");
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadNotes = async () => {
      const { getUsersNotes } = await import("@/features/notes/application");
      const response = await getUsersNotes();

      if (!isMounted) {
        return;
      }

      if (response.success) {
        setInitialNotes(response.data as TNoteApp[]);
      } else {
        setInitialNotes([]);
      }
    };

    void loadNotes();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const controlScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollToTop(currentScrollY > lastScrollY && currentScrollY > 100);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", controlScroll);

    return () => window.removeEventListener("scroll", controlScroll);
  }, []);

  const changeLayout = (nextShowDrawers: boolean) => {
    sessionStorage.setItem(DRAWER_LAYOUT_KEY, String(nextShowDrawers));
    setShowDrawers(nextShowDrawers);
  };

  return (
    <>
      {scrollToTop ? (
        <div
          title="Back to top"
          className="cursor-pointer fixed z-100 bottom-5 sm:right-4 right-0.5 rounded-2xl bg-main/80 p-3 text-text-main transition-all duration-200 hover:text-text-second enter-fade"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <ChevronUp />
        </div>
      ) : null}

      <div className="box-layout !p-0 grid grid-cols-2 relative border-4 sm:border-6 mt-17 z-0 border-main enter-fade overflow-hidden">
        <div
          className={`text-text-main rounded-l-3xl w-full h-full p-2 sm:p-3 cursor-pointer center z-10 ${
            showDrawers ? "font-bold" : ""
          }`}
          onClick={() => changeLayout(true)}
          title="Show drawers"
        >
          Drawers
        </div>

        <div
          className={`absolute bg-second z-5 w-1/2 h-full rounded-3xl top-0 transition-all duration-500 ${
            showDrawers ? "left-0" : "left-1/2"
          }`}
        ></div>

        <div
          className={`text-text-main rounded-r-3xl w-full h-full p-2 sm:p-3 cursor-pointer center z-10 ${
            !showDrawers ? "font-bold" : ""
          }`}
          onClick={() => changeLayout(false)}
          title="Show notes"
        >
          Notes
        </div>
      </div>

      {showDrawers ? (
        <ShowDrawers key="drawers" />
      ) : (
        <ShowNotes key="notes" initialWords={initialNotes} />
      )}
    </>
  );
}
