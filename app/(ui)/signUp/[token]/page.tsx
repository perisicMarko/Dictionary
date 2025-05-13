"use client";
import { useActionState, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { TUser } from "@/lib/types";
import { getUserByToken, verifyUser } from "@/actions/auth/user/index";
import { motion } from "framer-motion";
import { isBefore } from "date-fns";
import Link from "next/link";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import Loader from "@/components/common/Loader";
import Loading from "../../loading";
import NoValidToken from "./NoValidToken";

export default function Page() {
  const params = useParams();
  let token = params.token;
  if (typeof token === "object") token = token[0];
  const [user, setUser] = useState<TUser | undefined>();
  const [state, action, isPending] = useActionState(verifyUser, undefined);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      const retVal = await getUserByToken(token);
      setUser(retVal);
    };

    fetchUser();
    setIsFetching(false);
  }, [token]);

  let isValid = false;
  const now = new Date();
  const tokenExpirationDate = user?.refresh_token_expiration_date
    ? user.refresh_token_expiration_date
    : false;
  const tokenDate = tokenExpirationDate
    ? new Date(tokenExpirationDate)
    : undefined;

  if (!tokenExpirationDate) {
  } else if (
    user?.refresh_token != undefined &&
    tokenDate != undefined &&
    isBefore(now, tokenDate)
  )
    isValid = true;

  return (
    <>
      {user ? (
        <>
          {state?.success === true ? (
            <motion.div
              initial="hidden"
              animate="show"
              variants={containerVariants}
              className="box-layout mt-30"
            >
              <motion.p variants={itemVariants} className="text-box">
                <b>
                  Your account has been verified successfully.
                  <br /> Log in here:{" "}
                </b>
                <Link
                  href="/logIn"
                  className="hover:scale-115 hover:underline text-blue-300"
                >
                  log in page link
                </Link>
                .
              </motion.p>
            </motion.div>
          ) : isValid ? (
            <motion.div
              initial="hidden"
              animate="show"
              variants={containerVariants}
              className="box-layout mt-30"
            >
              <motion.form
                variants={itemVariants}
                className="w-full"
                action={action}
              >
                <input name="userId" defaultValue={user?.id} hidden />
                <button type="submit" className="primary-btn center">
                  {isPending ? <Loader /> : "Click to verify"}
                </button>
              </motion.form>
            </motion.div>
          ) : (
            <NoValidToken />
          )}
        </>
      ) : isFetching ? (
        <Loading />
      ) : (
        <NoValidToken />
      )}
    </>
  );
}
