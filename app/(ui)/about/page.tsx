"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animationVariants";

export default function Page() {

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="mt-10 m-5 sm:w-[660px] bg-slate-800 rounded-2xl border-2 border-blue-50 overflow-auto"
    >
      <div className="flex justify-end bg-slate-950">
        <Link className="xBtn mr-4 py-1 text-white" href="/">
          <b>x</b>
        </Link>
      </div>
      <motion.div variants={itemVariants} className="p-5">
        <h2 className="title text-white">What does this app do?</h2>
        <p className="text-white">
          This app helps you actively recall words you would like to learn by
          following the concept called the &quot;forgetting curve&quot;, using
          spaced repetition technique.
          <br />
          Learn more about it on{" "}
          <Link
            href="https://en.wikipedia.org/wiki/Spaced_repetition"
            target="blank"
            className="hover:underline"
          >
            <b>spaced repetition Wikipedia page</b>
          </Link>
          , or watch this{" "}
          <Link
            href="https://www.youtube.com/watch?v=X_TWGOxz8X4"
            target="blank"
            className="hover:underline"
          >
            <b>brief video</b>
          </Link>{" "}
          on spaced repetition and why it works.
        </p>
        <h2 className="title text-white">How to use this app?</h2>
        <p className="text-white">
          This app allows you to review all the words you have learned (on the
          &quot;Learned Words&quot; page), as well as the words you still need
          to learn (on the &quot;Your Words&quot; page).
          <br />
          The main function of the app is to repeat words based on the above
          explanation. The page dedicated to that purpose is called
          &quot;Recall.&quot; <br />
          You will receive an email when it&apos;s time to recall certain words.{" "}
          <br />
        </p>
        <h2 className="title text-white">How recall works?</h2>
        <p className="text-white">
          There are five rounds of repetition, and each time you will grade how
          well you have remembered a word. Repetitions will reset if you mark a
          word as not recalled well enough, using a rating scale from 0 to 5.
          Any rating below 3 (0, 1, or 2) is considered &quot;not good
          enough.&quot;
        </p>
        <h3 className="title text-white">
          More information about the app can be found on each page&apos;s
          dedicated help link.
        </h3>
      </motion.div>
    </motion.div>
  );
}
