import Link from "next/link";
import { isBefore } from "date-fns";
import { verifyUserById } from "@/features/auth/application/userAuth";
import { getUserByToken } from "@/features/auth/application/userRetrieval";
import NoValidToken from "./NoValidToken";

type PageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { token } = await params;

  if (!token) {
    return <NoValidToken />;
  }

  const result = await getUserByToken(token);
  if (!result.success || !result.data) {
    return <NoValidToken />;
  }

  const user = result.data;
  const tokenExpirationDate = user.account_action_token_expires_at;

  const isValid =
    !!user.account_action_token &&
    !!tokenExpirationDate &&
    isBefore(new Date(), new Date(tokenExpirationDate));

  if (!isValid) {
    return <NoValidToken />;
  }

  await verifyUserById(user.id);

  return (
    <div className="box-layout mt-30 enter-fade">
      <p className="text-box enter-fade-up enter-delay-1">
        <b>
          Your account has been verified successfully.
          <br /> Log in here:{" "}
        </b>
        <Link
          href="/login"
          className="hover:scale-115 hover:text-text-main text-text-second transition-all"
        >
          log in page link
        </Link>
        .
      </p>
    </div>
  );
}
