"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";
import {
  authenticateLogin,
  type LoginActionState,
} from "@/features/auth/application/userAuth";
import { LoginStatus } from "@/shared/auth/loginStatus";
import { generateVerificationMail } from "@/features/auth/application/sendVerificationEmail";

export default function Login() {
  const initialState: LoginActionState = {
    success: false,
    errorMessage: "",
    status: LoginStatus.EMPTY,
  };
  const [state, setState] = useState<LoginActionState>(initialState);
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
        const result = await authenticateLogin(state, formData);
        setState(result);

        if (result.success) {
          router.replace("/dictionary/inputWord");
          return;
        }

        if (result.status === LoginStatus.UNVERIFIED) {
          await generateVerificationMail(loginEmail);
        }

        setFormData((currentState) => ({
          email: currentState.email,
          password: "",
        }));
      })();
    });
  }

  const emptyCredentials = password === "" || email === "";

  return (
    <>
      {state.status !== LoginStatus.INVALID_SUBSCRIPTION &&
        state.status !== LoginStatus.UNVERIFIED && (
          <div
            className={
              "relative box-layout mt-15 enter-fade " + (isPending && " opacity-50 ")
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
              <div className="w-full enter-fade-up enter-delay-1">
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
              </div>
              <div className="w-full enter-fade-up enter-delay-1">
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
              </div>
              {state.status === LoginStatus.WRONG_CREDENTIALS && !isPending && (
                <div className="w-full enter-fade-up enter-delay-1">
                  <h2 className="error text-center">
                    <b>Wrong credentials</b>
                  </h2>
                  <p className="error text-center">
                    Invalid email or password.
                  </p>
                </div>
              )}
              <div className="center mt-2 w-3/4 enter-fade-up enter-delay-1">
                <button
                  disabled={isPending || emptyCredentials}
                  className={
                    "primary-btn center " + (emptyCredentials && " opacity-50")
                  }
                >
                  {isPending ? <Loader /> : "Log in"}
                </button>
              </div>
              <div className="center my-1 enter-fade-up enter-delay-1">
                <Link
                  className="flex items-start justify-end text-text-main hover:scale-105 hover:underline text-[14px] sm:text-[18px] transition-all"
                  href="/forgotPassword"
                >
                  Forgot password?
                </Link>
              </div>
            </form>
          </div>
        )}

      {state.status === LoginStatus.INVALID_SUBSCRIPTION && (
        <div className="box-layout mt-10 enter-fade">
          <p className="text-box enter-fade-up enter-delay-1">
            <b>There is no subscription for this email addres.</b>
          </p>
        </div>
      )}

      {state.status === LoginStatus.UNVERIFIED && (
        <div className="box-layout center-vertically mt-15 enter-fade">
          <h2 className="text-box enter-fade-up enter-delay-1">
            <b>Your account is not verified!</b>
          </h2>
          <span className="text-box enter-fade-up enter-delay-1">
            Verification email has been sent to you.
          </span>
          <br />
          <Link
            href="https://mail.google.com/"
            className="hover:scale-115 text-text-main transition-all"
          >
            <u className="text-text-second">Gmail link.</u>
          </Link>
        </div>
      )}
    </>
  );
}
