"use client";
import { requestPasswordReset } from "@/features/auth/application/resetPassword";
import { motion } from "framer-motion";
import { useActionState, useState } from "react";
import Link from "next/link";
import { containerVariants, itemVariants } from "@/shared/lib/animationVariants";
import Loader from "@/components/common/Loader";

export default function ForgotPassword() {
  const [state, action, isPending] = useActionState(requestPasswordReset, undefined);
  const [email, setEmail] = useState('');

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="box-layout mt-20 center-vertically md:mt-30 p-1 xl:mt-50 "
    >
      {state?.success === true && (
        <motion.div
          variants={itemVariants}
          className="box-layout absolute top-auto left-auto h-[200px] sm:h-[250px] center-vertically z-20"
        >
          <span className="text-center text-text-main">
            Email with instructions has been sent, please check your email<br/>
            <b className="text-text-second">(it may ends up in spam).</b>
          </span>
          <Link
            href="https://mail.google.com/"
            className="hover:scale-115 mt-3 hover:underline text-text-second transition-all"
          >
            Link to Gmail.
          </Link>
        </motion.div>
      )}
      {/* {state?.status === 500 && (
        <motion.div
          variants={itemVariants}
          className="absolute top-auto left-auto h-1/2 center box-layout"
        >
          <span className="text-box">
            Something is wrong, please try again later.
          </span>
        </motion.div>
      )} */}
      <motion.span className="my-2 hover:underline hover:scale-105 transition-all">
        <Link href="/" className="text-text-main">
          Back to home page
        </Link>
      </motion.span>
      <motion.form
        variants={itemVariants}
        className="w-full center-vertically space-y-5"
        action={action}
      >
        <input
          type="text"
          name="email"
          className="form-input"
          placeholder="Enter your email here..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {state?.success === false && (
          <motion.span className="error my-1 align-baseline">
            {state.errorMessage}
          </motion.span>
        )}
        <button className={"primary-btn !mt-3 center " + (email === '' && " opacity-50")} disabled={email === ''} >
          {isPending ? <Loader /> : "Send email"}
        </button>
      </motion.form>
    </motion.div>
  );
}
