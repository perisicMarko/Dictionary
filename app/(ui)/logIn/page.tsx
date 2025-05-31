"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useActionState, useEffect, useState } from "react";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";
import { authenticateLogIn } from "@/actions/auth/user";

export default function LogIn() {
  const [state, action, isPending] = useActionState(
    authenticateLogIn,
    undefined
  );
  const router = useRouter();
  const [formData, setFormData] = useState<{email: string, password: string}>({email: '', password: ''})
  const {email, password} = formData;
  const [semaphore, setSemaphore] = useState(false);

  useEffect(() => {
    if (state?.success) router.push("/dictionary/inputWord");
  }, [router, state?.success]);

  if (state?.errors?.email && state?.subscription != "" && semaphore) {
    setFormData({email: '', password: ''})
    setSemaphore(false);
  }
  if (state?.errors?.password && password !== "" && semaphore) {
    setFormData({...formData, password: ''})
    setSemaphore(false);
  }
  const emptyCredentials = password === "" || email === "";

  return (
    <>
      {state && state?.subscription != "" && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="box-layout mt-40 "
        >
          <motion.p
            variants={itemVariants}
            className="text-box"
          >
            <b>{state?.subscription}</b>
          </motion.p>
        </motion.div>
      )}
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className={
          "relative box-layout border-2 border-blue-50 " + (isPending && " opacity-50 ") +
          (state?.subscription !== "" ? " mt-5 " : " mt-8 sm:mt-10 md:mt-12 ")
        }
        
      >
        <div className="collapse-window">
          <Link className="x-btn" href="/">
            <b>x</b>
          </Link>
        </div>
        <form
          className="form flex flex-col items-center justify-center mt-5"
          action={(e) => {
            action(e);
            setSemaphore(true);
          }}
        >
          <motion.div variants={itemVariants} className="w-full">
            <label htmlFor="email" className="text-white">
              Email:{" "}
            </label>
            <input
              className="form-input"
              type="text"
              name="email"
              value={email}
              onChange={(e) => {
                setFormData({...formData, email: e.target.value})
              }}
            />
            {state?.errors?.email != "" && (
              <p className="error ml-1">{state?.errors?.email}</p>
            )}
          </motion.div>
          <motion.div variants={itemVariants} className="w-full">
            <label htmlFor="password" className="text-white">
              Password:{" "}
            </label>
            <input
              className="form-input"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            {state?.errors?.password && (
              <p className="error ml-1">{state.errors.password}</p>
            )}
          </motion.div>
          <motion.div variants={itemVariants} className="center mt-2 w-3/4">
            <button
              disabled={isPending || emptyCredentials}
              className={
                "primary-btn center " + (emptyCredentials && " opacity-50")
              }
            >
              {isPending ? <Loader /> : "Log in"}
            </button>
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            className="center my-1"
          >
            <Link
              className="flex items-start justify-end text-white hover:scale-105 hover:underline text-[14px] sm:text-[18px] transition-all"
              href="/forgotPassword"
            >
              <u>Forgot password?</u>
            </Link>
          </motion.div>
        </form>
      </motion.div>
    </>
  );
}
