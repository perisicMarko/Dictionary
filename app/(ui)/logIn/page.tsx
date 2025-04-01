"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useRef } from 'react';
import { useRouter } from "next/navigation";


export default function LogIn() {
  const [respondMessage, setRespondMessage] = useState<{errors: {email: string, password: string}, email: string}>();
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passInputRef = useRef<HTMLInputElement>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      setIsPending(true);
      const formData = new FormData(e.target as HTMLFormElement);
      const response = await fetch("/api/auth/logIn", {
        method: "POST",
        //headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.get('email'), password: formData.get('password') }),
      });

      if(response.status != 200) {
        setIsPending(false);
        const res = await response.json();
        if (emailInputRef.current && passInputRef.current && res.email === '') {
          emailInputRef.current.value = '';
          passInputRef.current.value = ''
        }
        if(passInputRef.current && res.errors.password != '')
          passInputRef.current.value = '';

        setRespondMessage(res); // display error if no user has been founded with that credentials
      }else{
        setIsPending(false);
        router.push('/dictionary/inputWord');
      }
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="mt-25 sm:mt-30 md:mt-30 bg-slate-800 rounded-2xl border-2 border-blue-50 w-[1/2] md:w-[500px]"
    >
      <div className="flex justify-end items-center bg-slate-950 border-blue-50 rounded-t-2xl">
        <Link className="xBtn mr-3 py-1 text-white" href="/">
          <b>x</b>
        </Link>
      </div>
      <form
        className="form flex flex-col items-center justify-center m-5"
        onSubmit={handleSubmit}
        method="POST"
      >
        <motion.div variants={itemVariants} className="w-full">
          <label htmlFor="email" className="text-white">
            Email:{" "}
          </label>
          <input
            className="formInput"
            type="text"
            name="email"
            ref={emailInputRef}
            defaultValue={respondMessage?.email}
          />
          {respondMessage?.errors?.email != "" && (
            <p className="error ml-1">{respondMessage?.errors.email}</p>
          )}
        </motion.div>
        <motion.div variants={itemVariants} className="w-full">
          <label htmlFor="password" className="text-white">
            Password:{" "}
          </label>
          <input className="formInput" type="password" ref={passInputRef} name="password" />
          {respondMessage?.errors?.password && (
            <p className="error ml-1">{respondMessage.errors.password}</p>
          )}
        </motion.div>
        <motion.div variants={itemVariants} className="center w-3/4">
          <button disabled={isPending} className="primaryBtn">
            {isPending ? "Loading..." : "Log in"}
          </button>
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 15 },
            show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="center my-1"
        >
          <p className="text-center text-white text-xs sm:text-base mr-3 sm:mr-6 hover:underline">
            You do not have an account yet?
          </p>
          <Link
            href="/signUp"
            className="hover:scale-115 text-white text-center"
          >
            <i>
              <u>Sign up here</u>
            </i>
          </Link>
        </motion.div>
      </form>
    </motion.div>
  );
}
