import { motion } from "framer-motion";
import { itemVariants } from "@/lib/animationVariants";
import Link from "next/link";

export default function RecallNoteHelp({toggleHelp, help}: {toggleHelp: () => void, help: boolean}) {
  return (
    <>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {
            opacity: 0,
            y: 10,
          },
          show: {
            opacity: 1,
            y: 0,
          },
        }}
        className="center bg-slate-800 rounded-2xl w-3/4 sm:w-[600px] mt-10 px-3"
        onClick={() => {
          toggleHelp();
        }}
      >
        <span className="block hover:scale-105 py-2 hover:underline cursor-pointer text-white text-center">
          <u>Need help?</u>
        </span>
      </motion.div>
      {help && 
      <motion.div
        initial="hidden"
        animate="show"
        variants={itemVariants}
        className="bg-slate-800 w-3/4 sm:w-[600px] rounded-2xl mt-10"
      >
        <div className="rounded-t-2xl flex justify-end bg-slate-950">
          <span
            className="xBtn mr-3 text-white py-1"
            onClick={() => {
              toggleHelp();
            }}
          >
            <b>x</b>
          </span>
        </div>
        <h2 className="text-white text-center mt-1">
          <b>Here is where you recall your words</b>
        </h2>
        <motion.p variants={itemVariants} className="p-4 text-white">
          Click on the menu icon to open the menu. In menu there are edit and
          delete icons, also &quot;notes&quot; for showing word notes and
          &quot;grade&quot; for grading ui, grading ui is initialy selected.
          <br />
          <br />
          <b>How this works?</b>
          <br />
          Recall system is based on forgetting curve and spaced repetition
          algorithm.
          <br />
          When you add a new word it is set to recall for the next day, that is
          the first repetition. After the first one the second one is after 6
          days. When you have done first two repetitions each next is calculated
          based on how good you have graded your recall. If you mark some word
          with grade below 3(0, 1, 2) repetition cycle will be returned to the
          beginning.
          <br />
          <br />
          Also word is considered as learned when it has a big interval for
          recall(30+ days), but app will not move those words automaticaly to
          the &quot;Learned words&quot; page. You can do it on the trash icon in
          the menu which marks word as learned and moves it to the &quot;Learned
          words&quot; page.
          <br />
          <br />
          You can delete word from the app only on &quot;Learned words&quot;
          page by clicking on the menu then on trash icon, only then is
          permanently deleted. So delete on recall and history page are two
          different delete options. It is recommended to leave the word in
          recall system even after the fifth repetition for another repetition
          or more.
          <br />
          <br />
          <b>Email notifications</b>
          <br />
          Note that you will be informed via email when to enter the app to
          recall some words. Email may end up in spam, so you will need to fix
          that by yourself.
          <br />
          In order to fix that:
          <br />
          <span className="pl-1">
            -open{" "}
            <Link
              href="https://mail.google.com/mail"
              className="text-blue-300 hover:underline"
              target="blank"
            >
              mail
            </Link>{" "}
            then spam section
            <br />
            -find our email and select it
            <br />
            -when options appear click on &quot;report not spam&quot;
          </span>
          <br />
          <br />
          If you have followed sing up instructions properly, you should have
          done this upon sing up.
          <br />
        </motion.p>
      </motion.div>
    }   
    </>
  );
}
