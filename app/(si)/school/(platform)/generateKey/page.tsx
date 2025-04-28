"use client";
import Loader from "@/components/Loader";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { motion } from "framer-motion";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { generateActivationKey } from "@/actions/manageSchools";

export default function Dashboard() {
  const [state, action, isPending] = useActionState(generateActivationKey, {
    success: false,
    message: "",
    email: "",
    date: "",
  });
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [language, setLanguage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!state) router.push("/school");
  }, [router, state]);


  return (
    <>
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="bg-slate-800 appWidth rounded-3xl mt-50"
      >
        <motion.form
          variants={itemVariants}
          action={action}
          className="p-5 space-y-3"
        >
          <motion.div className="grid grid-cols-[auto_1fr] gap-2 justify-center items-center">
            <label htmlFor="email">Email of the course atendee:</label>
            <input
              name="email"
              type="text"
              className="w-full bg-white text-slate-800 rounded-3xl h-[41px] p-3"
              onChange={(e) => setEmail(e.target.value)}
            />
            {state?.email != "" && (
              <motion.span className="error">{state?.email}</motion.span>
            )}
          </motion.div>
          <motion.div className="grid grid-cols-[auto_1fr] gap-2 items-center justify-center">
            <motion.label htmlFor="courseEnd">End of the course:</motion.label>
            <motion.input
              name="courseEnd"
              type="date"
              className="text-white block outline-2 !outline-white rounded-3xl p-1"
              onChange={(e) => setDate(e.target.value)}
            />
          </motion.div>
          {state?.date != "" && (
            <motion.span className="error mb-5">{state?.date}</motion.span>
          )}
          <motion.div className="grid grid-cols-[auto_1fr] gap-2 items-center justify-center mt-3">
            <motion.label htmlFor="language">Key for:</motion.label>
            <select
              name="language"
              className="text-white outline-none"
              defaultValue={-1}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option disabled value={-1}>Select a language</option>
              <option value="e">English</option>
            </select>
          </motion.div>
          <motion.button
            className={
              "center primaryBtn " +
              ((email === "" || date === "" || language === "") &&
                " opacity-50")
            }
            disabled={email === "" || date === "" || language === ""}
          >
            {isPending ? <Loader /> : "Generate key"}
          </motion.button>
        </motion.form>
      </motion.div>
      {state?.success && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="appWidth p-3 bg-slate-800 rounded-3xl mt-5"
        >
          <motion.p variants={itemVariants} className="text-white">
            <b>{state?.message}</b>
          </motion.p>
        </motion.div>
      )}
    </>
  );
}
