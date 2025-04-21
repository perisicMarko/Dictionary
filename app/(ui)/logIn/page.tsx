"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useActionState, useEffect, useState } from "react";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { authenticateLogIn } from "@/actions/auth/user";

export default function LogIn() {
  const [state, action, isPending] = useActionState(authenticateLogIn, undefined);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [semaphore, setSemaphore] = useState(false);

  useEffect(() => {
    if(state?.success)
      router.push("/dictionary/inputWord");
  }, [router, state?.success]);
  
  
  if(state?.errors?.email && email !== '' && semaphore){
    setEmail('');
    setPass('');
    setSemaphore(false);
  }
  if(state?.errors?.password && pass !== '' && semaphore){
    setPass('');
    setSemaphore(false);
  }
  const emptyCredentials = pass === "" || email === "";

  if(state?.subscription != '' && semaphore){
    setEmail('');
    setPass('');
    setSemaphore(false);
  }

  return (
  <>
    {state && state?.subscription != '' && 
      <motion.div initial='hidden' animate='show' variants={containerVariants} className="md:w-[500px] w-1/2 bg-slate-800 rounded-3xl mt-40">
        <motion.p variants={itemVariants} className="text-white text-center p-3">
          <b>{state?.subscription}</b>
        </motion.p>
      </motion.div>
    }
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className={"bg-slate-800 rounded-3xl border-2 border-blue-50 w-1/2 md:w-[500px] " + (state && state?.subscription != '' ? " mt-5" : " mt-25 sm:mt-30 md:mt-30")}
    >
      <div className="flex justify-end items-center bg-slate-950 border-blue-50 rounded-t-3xl">
        <Link className="xBtn mr-3 py-1 text-white" href="/">
          <b>x</b>
        </Link>
      </div>
      <form
        className="form flex flex-col items-center justify-center m-5"
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
            className="formInput"
            type="text"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
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
            className="formInput"
            type="password"
            name="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          {state?.errors?.password && (
            <p className="error ml-1">{state.errors.password}</p>
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
