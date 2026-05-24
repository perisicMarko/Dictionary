"use client";
import VerificationEmailSent from "@/features/auth/ui/signup/VerificationEmailSent";
import Link from "next/link";
import { useActionState, useState } from "react";
import { authenticateSignup } from "@/features/auth/application/userAuth";
import Loader from "@/reusableComponents/Loader";
import { X } from "lucide-react";

export default function Signup() {
  const [state, action, isPending] = useActionState(
    authenticateSignup,
    undefined
  );
  const [email, setEmail] = useState("");
  const submittedEmail = email || state?.email || "";

  return (
    <>
      {state?.subscriptionStatusMessage ? (
        <div className="box-layout mt-15 sm:mt-20 enter-fade">
          <p className="text-text-main text-center enter-fade-up enter-delay-1">
            <b>{state.subscriptionStatusMessage}</b>
          </p>
        </div>
      ) : null}

      {state?.success ? (
        <VerificationEmailSent email={submittedEmail} />
      ) : (
        <div className="mt-5 h-1/2 box-layout p-0! relative enter-fade">
          <div className="collapse-window">
            <Link className="x-btn" href="/">
              <X />
            </Link>
          </div>

          <div className="center mt-5">
            <form className="form w-full px-3 pb-5" action={action}>
              <div className="mt-3 enter-fade-up enter-delay-1">
                <label htmlFor="name" className="text-text-main">
                  Name:{" "}
                </label>
                <input
                  className="form-input"
                  type="text"
                  name="name"
                  defaultValue={state?.name}
                />
                {state?.errors?.name ? (
                  <p className="error" key="name">
                    Name:
                  </p>
                ) : null}
                <ul className="list-disc">
                  {state?.errors?.name?.map((e) => (
                    <li key={e} className="error ml-6">
                      {e}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 enter-fade-up enter-delay-1">
                <label htmlFor="lastName" className="text-text-main">
                  Last name:{" "}
                </label>
                <input
                  className="form-input"
                  type="text"
                  name="lastName"
                  defaultValue={state?.lastName}
                />
                {state?.errors?.lastName ? (
                  <p className="error" key="lastName">
                    Last name:
                  </p>
                ) : null}
                <ul className="list-disc">
                  {state?.errors?.lastName?.map((e) => (
                    <li key={e} className="error ml-6">
                      {e}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 enter-fade-up enter-delay-1">
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
                {state?.errors?.email ? (
                  <p className="error" key="email">
                    Email:
                  </p>
                ) : null}
                <ul className="list-disc">
                  {state?.errors?.email?.map((e) => (
                    <li key={e} className="error ml-6">
                      {e}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 enter-fade-up enter-delay-1">
                <label htmlFor="password" className="text-text-main">
                  Password:{" "}
                </label>
                <input className="form-input" type="password" name="password" />
                {state?.errors?.password ? (
                  <p className="error" key="password">
                    Password:
                  </p>
                ) : null}
                <ul className="list-disc">
                  {state?.errors?.password?.map((e) => (
                    <li key={e} className="error ml-6">
                      {e}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 enter-fade-up enter-delay-1">
                <label htmlFor="confirmPassword" className="text-text-main">
                  Confirm password:{" "}
                </label>
                <input
                  className="form-input"
                  type="password"
                  name="confirmPassword"
                />
                {state?.errors?.confirmPassword ? (
                  <p className="error">{state.errors.confirmPassword}</p>
                ) : null}
              </div>

              {state?.errorMessage ? (
                <div className="mt-3 enter-fade-up enter-delay-1">
                  <p className="error text-center">
                    <b>{state.errorMessage}</b>
                  </p>
                </div>
              ) : null}
              
              <div className="center mt-3 enter-fade-up enter-delay-1">
                <button
                  disabled={isPending}
                  className="primary-btn center w-1/2!"
                >
                  {isPending ? <Loader /> : "Sign up"}
                </button>
                <div className="inline-block hover:scale-105 ml-3 transition-all">
                  <Link href="/login" className="text-text-main">
                    <i>
                      <u>Or log in here</u>
                    </i>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
