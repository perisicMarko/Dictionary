import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import Image from "next/image";

export function Help({
  toggleHelp,
  help,
}: {
  toggleHelp: () => void;
  help: boolean;
}) {
    
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      key="help"
      className="w-3/4 sm:w-[500px] md:w-[600px] xl:w-[700px] xl:h-[400px] rounded-4xl mt-15 xl:mt-50 p-3"
      id="help"
    >
      <motion.h2
        variants={itemVariants}
        className="hover:underline mb-5 cursor-pointer bg-slate-800 text-box h-[30px] center w-full rounded-3xl"
        onClick={() => toggleHelp()}
      >
        {help ? "Go back" : "Need hlep?"}
      </motion.h2>
      <motion.div
        variants={itemVariants}
        className="center-vertically md:center"
      >
        <Image
          className="block xl:inline-block rounded-4xl mr-3 w-auto h-auto"
          width={350}
          height={280}
          src="/wordInput.png"
          alt="picture of word input"
        ></Image>
        <motion.p
          variants={{
            hidden: {
              opacity: 0,
              x: 50,
            },
            show: {
              opacity: 1,
              x: 0,
            },
          }}
          className="xl:inline-block bg-slate-800 text-box rounded-2xl p-2 sm:w-[200px]"
        >
          Input the word you would like to remember, then click the
          &quot;Generate&quot; button.
        </motion.p>
      </motion.div>
      <motion.div
        variants={itemVariants}
        className="mt-5 center-vertically md:center"
      >
        <Image
          className="block xl:inline-block rounded-4xl mr-3 w-auto h-auto"
          width={350}
          height={50}
          src="/generateNotes.png"
          alt="generate notes"
        ></Image>
        <motion.p
          variants={{
            hidden: {
              opacity: 0,
              x: 50,
            },
            show: {
              opacity: 1,
              x: 0,
            },
          }}
          className="block xl:inline-block bg-slate-800 text-white rounded-3xl p-2 text-center sm:w-[200px]"
        >
          Pronunciation of word and two text areas will pop up: one filled with
          generated notes from the app and an empty one reserved for your
          personal notes.
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
