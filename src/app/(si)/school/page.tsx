"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Loader from "@/components/common/Loader";
import { authenticateLogin } from "@/features/auth/application/schoolAuth";

type SchoolLoginState =
  {
    success: boolean;
    errors: {
      email?: string[] | string;
      password?: string[] | string;
    } | undefined;
    email: string;
  } | undefined;

export default function Login() {
  const router = useRouter();
  const [loginState, setLoginState] = useState<SchoolLoginState>(undefined);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const emptyCredentials = password === "" || email === "";

  return (
    <div className="mt-25 sm:mt-30 md:mt-30 box-layout p-5 enter-fade">
      <form
        className="form center-vertically enter-fade-up"
        onSubmit={(e) => {
          e.preventDefault();

          const submittedFormData = new FormData(e.currentTarget);

          startTransition(async () => {
            const nextState = await authenticateLogin(undefined, submittedFormData);
            setLoginState(nextState);

            if (nextState?.success) {
              router.replace("/school/platform/students");
              return;
            }

            setFormData((prev) => ({
              email: typeof nextState?.email === "string" && nextState.email !== ""
                ? nextState.email
                : prev.email,
              password: "",
            }));
          });
        }}
      >
        <div className="w-full">
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
          {loginState?.errors?.email != "" && (
            <p className="error ml-1">{loginState?.errors?.email}</p>
          )}
        </div>
        <div className="w-full">
          <label htmlFor="password" className="text-text-main">
            Password:{" "}
          </label>
          <input
            className="form-input"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          {loginState?.errors?.password && (
            <p className="error ml-1">{loginState?.errors.password}</p>
          )}
        </div>
        <div className="center w-3/4 mt-2">
          <button
            disabled={isPending || emptyCredentials}
            className={`primary-btn center ${emptyCredentials ? "opacity-50" : ""
              }`}
          >
            {isPending ? <Loader /> : "Log in"}
          </button>
        </div>
        <div className="center my-1 enter-fade-up enter-delay-1">
          <Link
            className="flex items-start justify-end text-text-main hover:text-text-second text-[14px] sm:text-[18px]"
            href="/school/signup"
          >
            <b>Sign up here</b>
          </Link>
        </div>
      </form>
    </div>
  );
}
