"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useTransition } from "react";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";
import {
  authenticateLogIn,
  type LogInActionState,
} from "@/features/auth/application/userAuth";
import { LogInStatus } from "@/shared/auth/loginStatus";
import { generateVerificationMail } from "@/features/auth/application/sendVerificationEmail";

export default function LogIn() {
  const initialState: LogInActionState = {
    success: false,
    errorMessage: "",
    status: LogInStatus.EMPTY,
  };
  const [state, setState] = useState<LogInActionState>(initialState);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [formData, setFormData] = useState<{ email: string; password: string }>(
    { email: "", password: "" }
  );
  const { email, password } = formData;

  async function onSubmit(formData: FormData) {
    const loginEmail = (formData.get("email") as FormDataEntryValue).toString();
    startTransition(() => {
      void (async () => {
        const result = await authenticateLogIn(state, formData);
        setState(result);

        if (result.success) {
          router.replace("/dictionary/inputWord");
          return;
        }

        if (result.status === LogInStatus.UNVERIFIED) {
          await generateVerificationMail(loginEmail);
        }

        setFormData({ email: "", password: "" });
      })();
    });
  }

  const emptyCredentials = password === "" || email === "";

  return (
    <>
      {(state.status !== LogInStatus.INVALID_SUBSCRIPTION && state.status !== LogInStatus.UNVERIFIED)
        && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className={
              "relative box-layout mt-15 " + (isPending && " opacity-50 ")
            }
          >
            <div className="collapse-window">
              <Link className="x-btn" href="/">
                <b>x</b>
              </Link>
            </div>
            <form
              className="form flex flex-col items-center justify-center mt-5"
              action={onSubmit}
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
                    setFormData({ ...formData, email: e.target.value });
                  }}
                />
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
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </motion.div>
              {state.status === LogInStatus.WRONG_CREDENTIALS && !isPending && !formData.email && (
                <motion.div variants={itemVariants} className="w-full">
                  <h2 className="error text-center">
                    <b>Wrong credentials</b>
                  </h2>
                  <p className="error text-center">
                    Invalid email or password.
                  </p>
                </motion.div>
              )}
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
                  className="flex items-start justify-end text-text-main hover:scale-105 hover:underline text-[14px] sm:text-[18px] transition-all"
                  href="/forgotPassword"
                >
                  <u>Forgot password?</u>
                </Link>
              </motion.div>
            </form>
          </motion.div>
        )}

      {state.status === LogInStatus.INVALID_SUBSCRIPTION && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="box-layout mt-10"
        >
          <motion.p variants={itemVariants} className="text-box">
            <b>There is no subscription for this email addres.</b>
          </motion.p>
        </motion.div>
      )}

      {state.status === LogInStatus.UNVERIFIED && (
        <motion.div
          className="box-layout center-vertically mt-15"
          variants={containerVariants}
        >
          <motion.h2 className="text-box" variants={itemVariants}>
            <b>Your account is not verified!</b>
          </motion.h2>
          <motion.span className="text-box" variants={itemVariants}>
            Verification email has been sent to you.
          </motion.span>
          <br />
          <Link
            href="https://mail.google.com/"
            className="hover:scale-115 text-text-main transition-all"
          >
            <u className="text-text-second">Gmail link.</u>
          </Link>
        </motion.div>
      )}
    </>
  );
}
