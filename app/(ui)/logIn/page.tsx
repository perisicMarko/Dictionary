"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

export default function LogIn() {
  const [respondMessage, setRespondMessage] = useState<{
    errors: { email: string; password: string };
    email: string;
  }>();
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsPending(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const response = await fetch("/api/auth/logIn", {
      method: "POST",
      //headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (response.status != 200) {
      setIsPending(false);
      const res = await response.json();
      if (res.email === "") {
        setEmail("");
        setPass("");
      }
      if (res.errors.password != "") setPass("");

      setRespondMessage(res); // display error if no user has been founded with that credentials
    } else {
      router.push("/dictionary/inputWord");
    }
  };

  const emptyCredentials = pass === "" || email === "";

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="mt-25 sm:mt-30 md:mt-30 bg-slate-800 rounded-3xl border-2 border-blue-50 w-[1/2] md:w-[500px]"
    >
      <div className="flex justify-end items-center bg-slate-950 border-blue-50 rounded-t-3xl">
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
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          {respondMessage?.errors?.email != "" && (
            <p className="error ml-1">{respondMessage?.errors.email}</p>
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
          {respondMessage?.errors?.password && (
            <p className="error ml-1">{respondMessage.errors.password}</p>
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
  );
}
