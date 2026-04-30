import { isBefore } from "date-fns";
import { getUserByToken } from "@/features/auth/application/users";
import NoValidToken from "./NoValidToken";
import ChangePasswordForm from "./ChangePasswordForm";

export default async function ResetPassword({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const userRes = await getUserByToken(token);

  if (!userRes.success || !userRes.data) {
    return <NoValidToken />;
  }

  const user = userRes.data;
  const tokenExpirationDate = user.account_action_token_expires_at;

  const isTokenValid =
    !!user.account_action_token &&
    !!tokenExpirationDate &&
    isBefore(new Date(), new Date(tokenExpirationDate));

  return isTokenValid ? (
    <ChangePasswordForm userId={user.id} />
  ) : (
    <NoValidToken />
  );
}
