"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { containerVariants, itemVariants } from "@/shared/lib/animationVariants";

export default function Page() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="mt-10 m-5 box-layout overflow-auto relative"
    >
      <div className="collapse-window">
        <Link className="x-btn mr-4 py-1 text-box" href="/">
          <b>x</b>
        </Link>
      </div>
      <motion.div variants={itemVariants}>
        <h2 className="title text-text-main">What does this app do?</h2>
        <p className="text-text-main">
          This app helps you actively recall words you would like to learn by
          calculating the optimal time for you to recall them.
          <br />
        </p>
        <h2 className="title text-text-main">How to use this app?</h2>
        <p className="text-text-main">
          This app allows you to review all the words you have learned (on the
          &quot;Learned Words&quot; page), as well as the words you still need
          to learn (on the &quot;Your Words&quot; page).
          <br />
          Words you should recall will show up on page called 
          &quot;Recall.&quot; <br />
          You will receive an email when it&apos;s time to recall certain words.{" "}
          <br />
        </p>
        <h2 className="title text-text-main">How recall works?</h2>
        <p className="text-text-main">
          There are five rounds of repetition, and each time you will grade how
          well you have remembered a word. Repetitions will reset if you mark a
          word as not recalled well enough, using a rating scale from 0 to 5.
          Any rating below 3 (0, 1, or 2) is considered &quot;not good
          enough.&quot;
        </p>
        <h3 className="title text-text-main">
          More information about the app can be found on each page&apos;s
          dedicated help button.
        </h3>
      </motion.div>
    </motion.div>
  );
}
