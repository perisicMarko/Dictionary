"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { containerVariants } from "@/lib/animationVariants";
import ShowNotes from "./ShowNotes";
import ShowDrawers from "./(drawers)/ShowDrawers";

export default function YourWords() {
  const [showSwitch, setShowSwitch] = useState(false);

  return (
    <>
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="appWidth bg-slate-800 rounded-4xl grid grid-cols-2 relative border-4 sm:border-6 mt-17 z-0 border-slate-800"
      >
        <div
          className={
            "text-white rounded-l-3xl w-full h-full p-2 sm:p-3 cursor-pointer center z-10 " +
            (showSwitch && " font-bold")
          }
          onClick={() => setShowSwitch(true)}
        >
          Drawers
        </div>
        <motion.div
          initial={{ opacity: 0, right: "0%" }}
          animate={{
            opacity: 1,
            right: showSwitch ? "50%" : "0%",
          }}
          transition={{delay: 0.1, duration: 0.5}}
          className="absolute bg-blue-400 z-5 w-1/2 h-full rounded-3xl right-0"
        ></motion.div>
        <div
          className={
            "text-white rounded-r-3xl w-full h-full p-2 sm:p-3 cursor-pointer center z-10 " +
            (!showSwitch && " font-bold")
          }
          onClick={() => setShowSwitch(false)}
        >
          Notes
        </div>
      </motion.div>

      {showSwitch ? <ShowDrawers key={0} /> : <ShowNotes key={1} />}
    </>
  );
}
