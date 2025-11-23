"use client";
import { useState, useLayoutEffect, useEffect } from "react";
import { motion } from "framer-motion";
import { containerVariants } from "@/lib/animationVariants";
import ShowNotes from "./ShowNotes";
import ShowDrawers from "./(drawers)/ShowDrawers";
import { ChevronUp } from "lucide-react";

export default function YourWords() {
  const [showSwitch, setShowSwitch] = useState(false);
  const [scrollToTop, setScrollToTop] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const controlScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100)
        setScrollToTop(true);
      else setScrollToTop(false);

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", controlScroll);

    return () => window.removeEventListener("scroll", controlScroll);
  }, []);

  const getLayout = () => {
    const value = sessionStorage.getItem("toggleDrawers");
    if (value === null) sessionStorage.setItem("toggleDrawers", "false");
    else {
      setShowSwitch(value === "true");
    }
  };

  useLayoutEffect(() => {
    getLayout();
  }, []);

  const changeLayout = (value: string) => {
    sessionStorage.setItem("toggleDrawers", value);
    setShowSwitch(value === "true");
  };

  return (
    <>
      {scrollToTop && (
        <motion.div
          title="Back to top"
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="cursor-pointer fixed z-100 bottom-5 sm:right-4 right-0.5 rounded-2xl bg-white/80 p-3 text-main transition-all duration-200 hover:text-second"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <ChevronUp />
        </motion.div>
      )}
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="box-layout !p-0 grid grid-cols-2 relative border-4 sm:border-6 mt-17 z-0 border-main"
      >
        <div
          className={`text-white rounded-l-3xl w-full h-full p-2 sm:p-3 cursor-pointer center z-10 
            ${showSwitch && " font-bold"}`}
          onClick={() => changeLayout("true")}
          title="Show drawers"
        >
          Drawers
        </div>
        <motion.div
          initial={{ opacity: 0, right: "0%" }}
          animate={{
            opacity: 1,
            right: showSwitch ? "50%" : "0%",
          }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="absolute bg-second z-5 w-1/2 h-full rounded-3xl right-0"
        ></motion.div>
        <div
          className={`text-white rounded-r-3xl w-full h-full p-2 sm:p-3 cursor-pointer center z-10 
            ${!showSwitch && " font-bold"}`}
          onClick={() => changeLayout("false")}
          title="Show notes"
        >
          Notes
        </div>
      </motion.div>

      {showSwitch ? <ShowDrawers key={0} /> : <ShowNotes key={1} />}
    </>
  );
}
