"use client";
import VerificationEmailSent from "./VerificationEmailSent";
import Link from "next/link";
import { useActionState, useState } from "react";
import { authenticateSignUp } from "@/actions/auth/user";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import Loader from "@/components/Loader";

export default function SignUp() {
  const [state, action, isPending] = useActionState(
    authenticateSignUp,
    undefined
  );
  const [email, setEmail] = useState("");

  if (state?.error === "Email already used.") {
    window.alert("This email is already used for another account.");
    state.error = "";
  }

  return (
    <>
      {state && state?.subscription != "" && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="authWidth bg-slate-800 p-3 mt-15 sm:mt-20 rounded-3xl"
        >
          <motion.p variants={itemVariants} className="text-white text-center">
            <b>{state?.subscription}</b>
          </motion.p>
        </motion.div>
      )}
      {state?.success ? (
        <VerificationEmailSent email={email} />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="mt-5 authWidth h-1/2 bg-slate-800 rounded-3xl border-2 border-blue-50"
        >
          <div className="flex justify-end items-start bg-slate-950 border-blue-50 rounded-t-3xl">
            <Link className="xBtn mr-3 py-1 text-white" href="/">
              <b>x</b>
            </Link>
          </div>

          <div className="center">
            <form className="form w-full px-3 pb-5" action={action}>
              <motion.div variants={itemVariants} className="mt-3">
                <label htmlFor="name" className="text-white">
                  Name:{" "}
                </label>
                <input
                  className="formInput"
                  type="text"
                  name="name"
                  defaultValue={state?.name}
                />
                {state?.errors?.name && (
                  <p className="error" key="name">
                    Name:
                  </p>
                )}
                <ul className="list-disc">
                  {state?.errors?.name &&
                    state?.errors?.name.map((e) => (
                      <li key={e} className="error ml-6">
                        {e}
                      </li>
                    ))}
                </ul>
              </motion.div>
              <motion.div variants={itemVariants} className="mt-3">
                <label htmlFor="lastName" className="text-white">
                  Last name:{" "}
                </label>
                <input
                  className="formInput"
                  type="text"
                  name="lastName"
                  defaultValue={state?.lastName}
                />
                {state?.errors?.lastName && (
                  <p className="error" key="lastName">
                    Last name:
                  </p>
                )}
                <ul className="list-disc">
                  {state?.errors?.lastName &&
                    state?.errors?.lastName.map((e) => (
                      <li key={e} className="error ml-6">
                        {e}
                      </li>
                    ))}
                </ul>
              </motion.div>
              <motion.div variants={itemVariants} className="mt-3">
                <label htmlFor="email" className="text-white">
                  Email:{" "}
                </label>
                <input
                  className="formInput"
                  type="text"
                  name="email"
                  defaultValue={state?.email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {state?.errors?.email && (
                  <p className="error" key="email">
                    Email:
                  </p>
                )}
                <ul className="list-disc">
                  {state?.errors?.email &&
                    state?.errors?.email.map((e) => (
                      <li key={e} className="error ml-6">
                        {e}
                      </li>
                    ))}
                </ul>
              </motion.div>
              <motion.div variants={itemVariants} className="mt-3">
                <label htmlFor="password" className="text-white">
                  Password:{" "}
                </label>
                <input className="formInput" type="password" name="password" />
                {state?.errors?.password && (
                  <p className="error" key="password">
                    Password:
                  </p>
                )}
                <ul className="list-disc">
                  {state?.errors?.password &&
                    state.errors.password.map((e) => (
                      <li key={e} className="error ml-6">
                        {e}
                      </li>
                    ))}
                </ul>
              </motion.div>
              <motion.div variants={itemVariants} className="mt-3">
                <label htmlFor="confirmPassword" className="text-white">
                  Confirm password:{" "}
                </label>
                <input
                  className="formInput"
                  type="password"
                  name="confirmPassword"
                />
                {state?.errors?.confirmPassword && (
                  <p className="error">{state.errors.confirmPassword}</p>
                )}
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                className="center mt-3"
              >
                <button
                  disabled={isPending || email === ""}
                  className={
                    "bg-blue-400 center text-white rounded-3xl block m-1 h-[35px] sm:h-[40px] md:h-[40px] xl:h-[48px] cursor-pointer w-1/2 hover:scale-105 active:scale-95 " +
                    (email === "" && " opacity-50")
                  }
                >
                  {isPending ? <Loader /> : "Sign up"}
                </button>
                <motion.div
                  variants={itemVariants}
                  className="inline-block hover:scale-105 ml-3"
                >
                  <Link href="logIn" className="text-white">
                    <i>
                      <u>Or log in here</u>
                    </i>
                  </Link>
                </motion.div>
              </motion.div>
            </form>
          </div>
        </motion.div>
      )}
    </>
  );
}
