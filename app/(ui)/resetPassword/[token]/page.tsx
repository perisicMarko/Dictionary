"use client";
import { useParams } from "next/navigation";
import { getUserByToken } from "@/actions/manageUsers";
import { useLayoutEffect, useState } from "react";
import { TUser } from "@/lib/types";
import { isBefore } from "date-fns";
import NoValidToken from "./NoValidToken";
import ChangePasswordForm from "./ChangePasswordForm";
import Loading from "@/app/(ui)/loading";

export default function ResetPassword() {
  const params = useParams();
  let token = params.token;
  if (typeof token === "object") token = token[0];
  const [user, setUser] = useState<TUser | undefined>();

  useLayoutEffect(() => {
    if (!token) {
      return;
    }

    const fetchUser = async () => {
      const retVal = await getUserByToken(token);
      setUser(retVal);
    };

    fetchUser();
  }, [token]);

  let isValid = false;
  const now = new Date();
  const tokenExpirationDate = user?.refresh_token_expiration_date || undefined;
  const tokenDate = new Date(tokenExpirationDate || "") || undefined;

  if (!tokenExpirationDate) {
    isValid = false;
  } else if (
    user?.refresh_token != undefined &&
    tokenDate != undefined &&
    isBefore(now, tokenDate)
  ) {
    isValid = true;
  }

  return (
    <>
      {!user ? (
        <Loading />
      ) : !isValid ? (
        <NoValidToken />
      ) : (
        <ChangePasswordForm user={user} />
      )}
    </>
  );
}
