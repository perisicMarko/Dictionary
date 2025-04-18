"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useActionState, useEffect, useState } from "react";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { SchoolLogIn } from "@/actions/auth/school";

export default function LogIn() {
  const [logInState, action, isPending] = useActionState(SchoolLogIn, undefined);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const router = useRouter();
  const emptyCredentials = pass === "" || email === "";

  useEffect(() => {
    if(logInState?.success)
      router.push('/school/dashboard');
  }, [router, logInState?.success]);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="mt-25 sm:mt-30 md:mt-30 bg-slate-800 rounded-3xl border-2 border-blue-50 w-[1/2] md:w-[500px]"
    >
      <form
        className="form flex flex-col items-center justify-center m-5"
        action={(e) => {
          setEmail('');
          setPass('');
          action(e);
        }}
      >
        <motion.div variants={itemVariants} className="w-full">
          <label htmlFor="email" className="text-white">
            Email:{" "}
          </label>
          <input
            className="formInput"
            type="text"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          {logInState?.errors?.email != "" && (
            <p className="error ml-1">{logInState?.errors?.email}</p>
          )}
        </motion.div>
        <motion.div variants={itemVariants} className="w-full">
          <label htmlFor="password" className="text-white">
            Password:{" "}
          </label>
          <input
            className="formInput"
            type="password"
            name="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          {logInState?.errors?.password && (
            <p className="error ml-1">{logInState?.errors.password}</p>
          )}
        </motion.div>
        <motion.div variants={itemVariants} className="center w-3/4 mt-2">
          <button
            disabled={isPending || emptyCredentials}
            className={
              "primaryBtn center " + (emptyCredentials && " opacity-50")
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
            className="flex items-start justify-end text-white hover:scale-105 hover:underline text-[14px] sm:text-[18px]"
            href="/school/signUp"
          >
            <u>Sign up here</u>
          </Link>
        </motion.div>
      </form>
    </motion.div>
  );
}
