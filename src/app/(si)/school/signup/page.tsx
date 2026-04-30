"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Loader from "@/components/common/Loader";
import { authenticateSignup } from "@/features/auth/application/schoolAuth";

type SchoolSignupState = 
  undefined |
  {
    success: boolean;
    errors: {
      name?: string[] | undefined;
      email?: string[] | undefined;
      password?: string[] | undefined;
      confirmPassword?: string[] | undefined;
    } | undefined;
    error: string;
    partner: boolean;
    email: string;
    name: string;
  };

export default function Signup() {
  const router = useRouter();
  const [state, setState] = useState<SchoolSignupState>(undefined);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { name, email, password, confirmPassword } = formData;
  const isSubmitDisabled =
    name.trim() === "" ||
    email.trim() === "" ||
    password === "" ||
    confirmPassword === "";

  return (
    <>
      {state?.partner === false && (
        <div className="mt-10 box-layout enter-fade">
          <p className="text-text-main p-1 enter-fade-up enter-delay-1">
            Sorry, we are not partner with you at the momment. Please contact
            us!
          </p>
        </div>
      )}
      <div className="mt-10 box-layout enter-fade">
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();

            const submittedFormData = new FormData(e.currentTarget);

            startTransition(async () => {
              const nextState = await authenticateSignup(undefined, submittedFormData);
              setState(nextState);

              if (nextState?.success) {
                router.replace("/school");
                return;
              }

              setFormData((prev) => ({
                name:
                  typeof nextState?.name === "string" && nextState.name !== ""
                    ? nextState.name
                    : prev.name,
                email:
                  typeof nextState?.email === "string" && nextState.email !== ""
                    ? nextState.email
                    : prev.email,
                password: "",
                confirmPassword: "",
              }));
            });
          }}
        >
          <div className="mt-3 enter-fade-up">
            <label htmlFor="name" className="text-text-main">
              School name:
            </label>
            <input
              className="form-input"
              type="text"
              name="name"
              value={name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {state?.errors?.name && (
              <p className="error" key="name">
                Name:
              </p>
            )}
            <ul className="list-disc">
              {state?.errors?.name &&
                state.errors.name.map((error) => (
                  <li key={error} className="error ml-6">
                    {error}
                  </li>
                ))}
            </ul>
          </div>
          <div className="mt-3 enter-fade-up">
            <label htmlFor="email" className="text-text-main">
              Email:{" "}
            </label>
            <input
              className="form-input"
              type="text"
              name="email"
              value={email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {state?.errors?.email && (
              <p className="error" key="email">
                Email:
              </p>
            )}
            <ul className="list-disc">
              {state?.errors?.email &&
                state.errors.email.map((error) => (
                  <li key={error} className="error ml-6">
                    {error}
                  </li>
                ))}
            </ul>
            {state?.error === "Email already used." ? (
              <p className="error mt-1">
                This email is already used for another account.
              </p>
            ) : null}
          </div>
          <div className="mt-3 enter-fade-up">
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
            {state?.errors?.password && (
              <p className="error" key="password">
                Password:
              </p>
            )}
            <ul className="list-disc">
              {state?.errors?.password &&
                state.errors.password.map((error) => (
                  <li key={error} className="error ml-6">
                    {error}
                  </li>
                ))}
            </ul>
          </div>
          <div className="mt-3 enter-fade-up">
            <label htmlFor="confirmPassword" className="text-text-main">
              Confirm password:{" "}
            </label>
            <input
              className="form-input"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            {state?.errors?.confirmPassword && (
              <p className="error">{state.errors.confirmPassword}</p>
            )}
          </div>
          <div className="center mt-3 enter-fade-up enter-delay-1">
            <button
              disabled={isPending || isSubmitDisabled}
              className={`primary-btn !w-1/2 center ${isSubmitDisabled ? "opacity-50" : ""
                }`}
            >
              {isPending ? <Loader /> : "Sign up"}
            </button>
            <div className="inline-block ml-3">
              <Link href="/school" className="text-box hover:text-text-second">
                <i>
                  <b>Or log in here</b>
                </i>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
