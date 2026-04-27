"use client";
import VerificationEmailSent from "./VerificationEmailSent";
import Link from "next/link";
import { useActionState, useState } from "react";
import { authenticateSignUp } from "@/features/auth/application/userAuth";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import Loader from "@/components/common/Loader";

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
          className="box-layout mt-15 sm:mt-20"
        >
          <motion.p variants={itemVariants} className="text-text-main text-center">
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
          className="mt-5 h-1/2 box-layout !p-0 relative"
        >
          <div className="collapse-window">
            <Link className="x-btn" href="/">
              <b>x</b>
            </Link>
          </div>

          <div className="center mt-5">
            <form className="form w-full px-3 pb-5" action={action}>
              <motion.div variants={itemVariants} className="mt-3">
                <label htmlFor="name" className="text-text-main">
                  Name:{" "}
                </label>
                <input
                  className="form-input"
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
                <label htmlFor="lastName" className="text-text-main">
                  Last name:{" "}
                </label>
                <input
                  className="form-input"
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
                <label htmlFor="email" className="text-text-main">
                  Email:{" "}
                </label>
                <input
                  className="form-input"
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
                <label htmlFor="password" className="text-text-main">
                  Password:{" "}
                </label>
                <input className="form-input" type="password" name="password" />
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
                <label htmlFor="confirmPassword" className="text-text-main">
                  Confirm password:{" "}
                </label>
                <input
                  className="form-input"
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
                    "primary-btn center !w-1/2 " +
                    (email === "" && " opacity-50")
                  }
                >
                  {isPending ? <Loader /> : "Sign up"}
                </button>
                <motion.div
                  variants={itemVariants}
                  className="inline-block hover:scale-105 ml-3 transition-all"
                >
                  <Link href="logIn" className="text-text-main">
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
