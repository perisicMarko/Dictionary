"use client";
import Loader from "@/components/common/Loader";
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

  const [formData, setFormData] = useState<{
    email: string;
    date: string;
    language: string;
  }>({ email: "", date: "", language: "" });
  const { email, date, language } = formData;
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
        className="box-layout mt-50"
      >
        <motion.form
          variants={itemVariants}
          action={action}
          className="space-y-2"
        >
          <motion.div
            className="flex flex-col justify-center items-start gap-1"
            variants={itemVariants}
          >
            <label htmlFor="email">Email of the course atendee:</label>
            <input
              name="email"
              type="text"
              className="w-full bg-white text-main rounded-3xl block p-2"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {state?.email != "" && (
              <motion.span className="error">{state?.email}</motion.span>
            )}
          </motion.div>
          <motion.div
            className="flex flex-col justify-center items-start gap-1"
            variants={itemVariants}
          >
            <label htmlFor="courseEnd">End of the course:</label>
            <input
              name="courseEnd"
              type="date"
              className="text-white block w-full appearance-none outline-2 !outline-white rounded-3xl p-1"
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </motion.div>
          {state?.date != "" && (
            <motion.span className="error mb-5">{state?.date}</motion.span>
          )}
          <motion.div
            className="flex flex-col items-start justify-center gap-1"
            variants={itemVariants}
          >
            <label htmlFor="language">Key for:</label>
            <select
              name="language"
              className="text-white outline-none appearance-none rounded-3xl border-2 border-white p-1 w-full hover:text-second"
              defaultValue={-1}
              onChange={(e) =>
                setFormData({ ...formData, language: e.target.value })
              }
            >
              <option disabled value={-1}>
                Select a language
              </option>
              <option value="e">English</option>
            </select>
          </motion.div>
          <div className="mt-5">
            <motion.button
              className={`center primary-btn " +
                ${
                  email === "" || date === "" || language === ""
                    ? " opacity-50"
                    : ""
                }`}
              disabled={email === "" || date === "" || language === ""}
            >
              {isPending ? <Loader /> : "Generate key"}
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
      {state?.success && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="box-layout mt-5"
        >
          <motion.p variants={itemVariants} className="text-white">
            <b>{state?.message}</b>
          </motion.p>
        </motion.div>
      )}
    </>
  );
}
