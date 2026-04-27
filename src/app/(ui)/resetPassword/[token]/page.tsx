"use client";
import { useParams } from "next/navigation";
import { getUserByToken } from "@/features/auth/application/users";
import { useEffect, useState } from "react";
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
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchUser = async () => {
      const retVal = await getUserByToken(token);
      setUser(retVal);
    };

    fetchUser();
    setIsFetching(false);
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
      {isFetching ? (
        <Loading />
      ) : !isValid ? (
        <NoValidToken />
      ) : (
        <ChangePasswordForm user={user} />
      )}
    </>
  );
}
