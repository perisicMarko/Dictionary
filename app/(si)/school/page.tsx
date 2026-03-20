"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useActionState, useEffect, useState } from "react";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";
import { SchoolLogIn } from "@/actions/auth/school";

export default function LogIn() {
  const [logInState, action, isPending] = useActionState(SchoolLogIn, undefined);
  const [formData, setFormData] = useState<{email: string, password: string}>({email: '', password: ''});
  const {email, password} = formData;

  const router = useRouter();
  const emptyCredentials = password === "" || email === "";

  useEffect(() => {
    if(logInState?.success)
      router.push('/school/platform/students');
  }, [router, logInState?.success]);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="mt-25 sm:mt-30 md:mt-30 box-layout p-5"
    >
      <form
        className="form center-vertically"
        action={(e) => {
          setFormData({email: '', password: ''});
          action(e);
        }}
      >
        <motion.div variants={itemVariants} className="w-full">
          <label htmlFor="email" className="text-text-main">
            Email:{" "}
          </label>
          <input
            className="form-input"
            type="text"
            name="email"
            value={email}
            onChange={(e) => {
              setFormData({...formData, email: e.target.value});
            }}
          />
          {logInState?.errors?.email != "" && (
            <p className="error ml-1">{logInState?.errors?.email}</p>
          )}
        </motion.div>
        <motion.div variants={itemVariants} className="w-full">
          <label htmlFor="password" className="text-text-main">
            Password:{" "}
          </label>
          <input
            className="form-input"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          {logInState?.errors?.password && (
            <p className="error ml-1">{logInState?.errors.password}</p>
          )}
        </motion.div>
        <motion.div variants={itemVariants} className="center w-3/4 mt-2">
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
            className="flex items-start justify-end text-text-main hover:scale-105 hover:underline text-[14px] sm:text-[18px]"
            href="/school/signUp"
          >
            <u>Sign up here</u>
          </Link>
        </motion.div>
      </form>
    </motion.div>
  );
}
