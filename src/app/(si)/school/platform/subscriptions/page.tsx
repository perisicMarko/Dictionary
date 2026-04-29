import { redirect } from "next/navigation";
import { decryptSession } from "@/server/auth/schoolSession";
import { getSubscriptionsBySchool } from "@/features/schools/application";
import SubscriptionsView from "./SubscriptionsView";
import { TSubscription } from "@/shared/types";

export default async function Page() {
  const session = await decryptSession();

  if (!session?.success && !session?.data) {
    redirect("/school");
  }

  const subscriptionsRes = await getSubscriptionsBySchool();

  if(!subscriptionsRes.success && !subscriptionsRes.data){
    redirect('/school');
  }

  const subscriptions = subscriptionsRes.data as TSubscription[];

  return <SubscriptionsView initialSubscriptions={subscriptions} />;
}
