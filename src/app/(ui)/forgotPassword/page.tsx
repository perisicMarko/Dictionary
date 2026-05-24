"use client";
import { requestPasswordReset } from "@/features/auth/application/resetPassword";
import { useActionState, useState } from "react";
import Link from "next/link";
import Loader from "@/reusableComponents/Loader";

export default function ForgotPassword() {
  const [state, action, isPending] = useActionState(requestPasswordReset, undefined);
  const [email, setEmail] = useState("");

  return (
    <div className="box-layout mt-20 center-vertically md:mt-30 p-1 xl:mt-50 enter-fade">
      {state?.success === true && (
        <div className="box-layout absolute top-auto left-auto h-50 sm:h-62.5 center-vertically z-20 enter-fade-up enter-delay-1">
          <span className="text-center text-text-main">
            Email with instructions has been sent, please check your email<br/>
            <b className="text-text-second">(it may ends up in spam).</b>
          </span>
          <Link
            href="https://mail.google.com/"
            className="hover:text-text-main mt-3 text-text-second transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            Link to Gmail.
          </Link>
        </div>
      )}
      <span className="my-2 transition-colors enter-fade-up">
        <Link href="/" className="text-text-main hover:text-text-second">
          Back to home page
        </Link>
      </span>
      <form className="w-full center-vertically space-y-5 enter-fade-up enter-delay-1" action={action}>
        <input
          type="text"
          name="email"
          className="form-input"
          placeholder="Enter your email here..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {state?.success === false && (
          <span className="error my-1 align-baseline">
            {state.errorMessage}
          </span>
        )}
        <button
          className={"primary-btn !mt-3 center " + (email === "" ? "opacity-50" : "")}
          disabled={email === ""}
        >
          {isPending ? <Loader /> : "Send email"}
        </button>
      </form>
    </div>
  );
}
