"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { TUser } from "@/lib/types";
import { getUserByToken, isUserVerified } from "@/features/auth/application/userAuth";
import { motion } from "framer-motion";
import { isBefore } from "date-fns";
import Link from "next/link";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import Loading from "../../loading";
import NoValidToken from "./NoValidToken";

export default function Page() {
  const params = useParams();
  let token = params.token;
  if (typeof token === "object") token = token[0];
  const [user, setUser] = useState<TUser | undefined>();
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      const res = await getUserByToken(token);
      if(res.success)
        setUser(res.user);
    };

    fetchUser();
    setIsFetching(false);
    
  }, [token]);

  useEffect(() => { 
    const setUserVerified = async () => {
      if(user && isValid)
        await isUserVerified(user.id);
    }
      setUserVerified();
  });

  let isValid = false;
  const now = new Date();
  const tokenExpirationDate = user?.account_action_token_expires_at
    ? user.account_action_token_expires_at
    : false;
  const tokenDate = tokenExpirationDate
    ? new Date(tokenExpirationDate)
    : undefined;

  if (!tokenExpirationDate) {
  } else if (
    user?.account_action_token != undefined &&
    tokenDate != undefined &&
    isBefore(now, tokenDate)
  )
    isValid = true;

  return (
    <>
      {user ? (
        <>
          {isValid ? (
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
                  href="/login"
                  className="hover:scale-115 hover:underline text-text-second transition-all"
                >
                  log in page link
                </Link>
                .
              </motion.p>
            </motion.div>
          ) : 
            <NoValidToken />
          }
        </>
      ) : isFetching ? (
        <Loading />
      ) : (
        <NoValidToken />
      )}
    </>
  );
}
