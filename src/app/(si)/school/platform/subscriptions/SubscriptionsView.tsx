"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TSubscription } from "@/shared/types";
import { isBefore } from "date-fns";
import { ArrowUpDown, KeyIcon } from "lucide-react";
import SubscriptionComponent from "./SubscriptionComponent";
import ZeroNotesMessage from "@/components/common/ZeroNotesMessage";

const SORT = {
  BY_EXPIRATION_DATE_DESC: 0,
  BY_EXPIRATION_DATE_ASC: 1,
  EXPIRED: 2,
  ACTIVE: 3,
};

export default function SubscriptionsView({
  initialSubscriptions,
}: {
  initialSubscriptions: TSubscription[];
}) {
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState(-1);
  const router = useRouter();

  const filteredSubscriptions = useMemo(() => {
    let nextSubscriptions = initialSubscriptions.filter((subscription) => {
      return subscription.email
        .toLowerCase()
        .trim()
        .includes(search.toLowerCase().trim());
    });

    if (filterBy === -1) {
      return nextSubscriptions;
    }

    switch (filterBy) {
      case SORT.BY_EXPIRATION_DATE_ASC:
        return [...nextSubscriptions].sort((e1, e2) =>
          isBefore(e1.key_expiration_date, e2.key_expiration_date) ? -1 : 1
        );
      case SORT.BY_EXPIRATION_DATE_DESC:
        return [...nextSubscriptions].sort((e1, e2) =>
          isBefore(e1.key_expiration_date, e2.key_expiration_date) ? 1 : -1
        );
      case SORT.ACTIVE:
        return nextSubscriptions.filter((e) =>
          isBefore(new Date(), e.key_expiration_date)
        );
      case SORT.EXPIRED:
        return nextSubscriptions.filter((e) =>
          isBefore(e.key_expiration_date, new Date())
        );
      default:
        return nextSubscriptions;
    }
  }, [filterBy, initialSubscriptions, search]);

  return (
    <>
      <div className="box-layout center-vertically !p-2 mt-20 enter-fade">
        <div className="center w-full pl-3">
          <KeyIcon color="white" />
          <input
            placeholder="Search your subscriptions here..."
            className="text-text-main outline-0 w-full h-full pl-3"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="px-3 rounded-t-none text-text-main center justify-between w-full enter-fade-up enter-delay-1">
          <select
            className="w-full appearance-none sm:hover:text-text-second cursor-pointer !py-2 rounded-3xl h-full"
            defaultValue={-1}
            onChange={(e) => {
              setFilterBy(Number(e.target.value));
            }}
          >
            <option value={-1} disabled>
              Filter users by
            </option>
            <option value={SORT.BY_EXPIRATION_DATE_ASC}>
              {"Key expiration date " + "\u2191"}
            </option>
            <option value={SORT.BY_EXPIRATION_DATE_DESC}>
              {"Key expiration date " + "\u2193"}
            </option>
            <option value={SORT.ACTIVE}>{"Active subscriptions"}</option>
            <option value={SORT.EXPIRED}>{"Expired subscriptions"}</option>
          </select>
          <ArrowUpDown
            color="white"
            height={20}
            width={20}
            className="right-3 pointer-events-none"
          />
        </div>
      </div>

      {filteredSubscriptions.length > 0 ? (
        <div className="mt-5 flex flex-col items-center space-y-4 w-full h-full active:outline-0">
          {filteredSubscriptions.map((subscription) => {
            return (
              <SubscriptionComponent
                subscription={subscription}
                key={subscription.email}
                rerender={() => router.refresh()}
              />
            );
          })}
        </div>
      ) : (
        <ZeroNotesMessage message="No subscriptions found." />
      )}
    </>
  );
}
