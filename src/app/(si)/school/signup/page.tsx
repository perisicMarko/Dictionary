"use client";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { authenticateSignup } from "@/features/auth/application/schoolAuth";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import Loader from "@/components/common/Loader";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [state, action, isPending] = useActionState(
    authenticateSignup,
    undefined
  );

  const [email, setEmail] = useState("");
  const router = useRouter();

  if (state?.error === "Email already used.") {
    window.alert("This email is already used for another account.");
    state.error = "";
  }

  useEffect(() => {
    if (state?.success) router.push("/school");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.success]);

  return (
    <>
      {state?.partner === false && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="mt-10 box-layout"
        >
          <motion.p variants={itemVariants} className="text-text-main p-1">
            Sorry, we are not partner with you at the momment. Please contact
            us!
          </motion.p>
        </motion.div>
      )}
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="mt-10 box-layout"
      >
        <form className="form" action={action}>
          <motion.div variants={itemVariants} className="mt-3">
            <label htmlFor="name" className="text-text-main">
              School name:
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
              className={`primary-btn !w-1/2 center " +
                ${email === "" ? " opacity-50" : ""}`}
            >
              {isPending ? <Loader /> : "Sign up"}
            </button>
            <motion.div
              variants={itemVariants}
              className="inline-block hover:scale-105 ml-3"
            >
              <Link href="/school" className="text-box">
                <i>
                  <u>Or log in here</u>
                </i>
              </Link>
            </motion.div>
          </motion.div>
        </form>
      </motion.div>
    </>
  );
}
