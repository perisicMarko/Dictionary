"use client";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { TSubscription } from "@/lib/types";
import { isBefore } from "date-fns";
import { motion } from "framer-motion";
import { ArrowUpDown, KeyIcon } from "lucide-react";
import { useState, useEffect } from "react";
import SubscriptionComponent from "./SubscriptionComponent";
import { getSubscriptionsBySchool } from "@/actions/manageSchools";
import Loading from "@/app/(ui)/loading";

const SORT = {
  BY_EXPIRATION_DATE_DESC: 0,
  BY_EXPIRATION_DATE_ASC: 1,
  EXPIRED: 2,
  ACTIVE: 3,
};

export default function Page() {
  const [subscriptions, setSubscriptions] = useState<
    TSubscription[] | undefined
  >(undefined);
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState(-1);
  const [rerenderFromChild, setRerenderFromChild] = useState(false);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const res = await getSubscriptionsBySchool();
      setSubscriptions(res);
    };
    fetchSubscriptions();
  }, [rerenderFromChild]);

  let filteredSubscriptions = subscriptions?.filter(
    (subscription: TSubscription) => {
      return subscription.email
        .toLowerCase()
        .trim()
        .includes(search.toLowerCase().trim());
    }
  );

  if (filterBy != -1 && filteredSubscriptions != undefined) {
    switch (filterBy) {
      case SORT.BY_EXPIRATION_DATE_ASC:
        filteredSubscriptions.sort((e1, e2) =>
          isBefore(e1.key_expiration_date, e2.key_expiration_date) ? -1 : 1
        );
        break;
      case SORT.BY_EXPIRATION_DATE_DESC:
        filteredSubscriptions.sort((e1, e2) =>
          isBefore(e1.key_expiration_date, e2.key_expiration_date) ? 1 : -1
        );
        break;
      case SORT.ACTIVE:
        filteredSubscriptions = filteredSubscriptions.filter((e) => {
          const now = Date();
          return isBefore(now, e.key_expiration_date);
        });
        break;
      case SORT.EXPIRED:
        filteredSubscriptions = filteredSubscriptions.filter((e) => {
          const now = Date();
          return isBefore(e.key_expiration_date, now);
        });
        break;
    }
  }

  return (
    <>
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="box-layout center-vertically !p-2 mt-20"
      >
        <div className="center w-full pl-3">
          <KeyIcon color="white" />
          <input
            placeholder="Search your subscriptions here..."
            className="text-white outline-0 w-full h-full pl-3"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="px-3 rounded-t-none text-white center justify-between w-full"
        >
          <select
            className="w-full appearance-none sm:hover:text-second cursor-pointer !py-2 rounded-3xl h-full"
            defaultValue={-1}
            onChange={(e) => {
              setFilterBy(Number(e.target.value));
              console.log(e.target.value);
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
        </motion.div>
      </motion.div>
      {subscriptions !== undefined ? (
        <div className="mt-5 flex flex-col items-center space-y-4 w-full h-full active:outline-0">
          {filteredSubscriptions && filteredSubscriptions?.length > 0 ? (
            filteredSubscriptions?.map((s) => {
              return (
                <SubscriptionComponent
                  subscription={s}
                  key={s.email}
                  rerender={() => {
                    setRerenderFromChild(!rerenderFromChild);
                  }}
                />
              );
            })
          ) : (
            <motion.p
              initial="hidden"
              animate="show"
              variants={itemVariants}
              className="bg-main text-box p-2 box-width rounded-3xl"
            >
              No subscriptions found.
            </motion.p>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
