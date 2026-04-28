import { updateSubscriptionEmail } from "@/features/schools/application";
import { containerVariants } from "@/shared/lib/animationVariants";
import { TSubscription } from "@/shared/types";
import { motion } from "framer-motion";
import { Menu, X, Edit, KeyIcon } from "lucide-react";
import { useState } from "react";

export default function SubscriptionComponent({
  subscription,
  rerender,
}: {
  subscription: TSubscription;
  rerender: () => void;
}) {
  const [dropMenu, setDropMenu] = useState(false);
  const [editSubscription, setEditSubscription] = useState(false);
  const [newSubscriptionEmail, setNewSubscriptionEmail] = useState(
    subscription.email
  );

  return (
    <motion.div
      key={subscription.email}
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="box-layout relative"
      onClick={() => setDropMenu(false)}
    >
      <div
        className="absolute right-0 top-5 flex flex-col items-center rounded-2xl w-[100px]"
        title="Menu"
      >
        {dropMenu || editSubscription ? (
          <X
            color="white"
            className="btn"
            width={25}
            height={25}
            onClick={() => {
              if (editSubscription)
                // conditional in order to reuse this X for collapsing the edit ui
                setEditSubscription(false);

              setDropMenu(false);
            }}
          />
        ) : (
          !editSubscription && (
            <Menu
              color="white"
              className="btn"
              width={25}
              height={25}
              onClick={(e) => {
                e.stopPropagation();
                setDropMenu(true);
              }}
            />
          )
        )}

        {dropMenu && !editSubscription && (
          <div className="bg-white/80 center-vertically pointer-events-auto z-10 left-2 gap-1 px-2 py-1 rounded-2xl">
            <Edit
              onClick={() => setEditSubscription(true)}
              className="text-text-second hover:text-text-main cursor-pointer"
            />
          </div>
        )}
      </div>
      <div className="text-text-main">
        {editSubscription ? (
          <>
            <h2 className="text-text-main mt-3">Edit key email address:</h2>
            <input
              className="w-full text-text-main rounded-3xl border-2 py-1 px-2 !my-2 border-white h-[38px]"
              value={newSubscriptionEmail}
              onChange={(e) => setNewSubscriptionEmail(e.target.value)}
            ></input>
            <button
              className={`primary-btn !h-[38px] ${
                newSubscriptionEmail.trim() === subscription.email
                  ? " opacity-50"
                  : ""
              }`}
              disabled={newSubscriptionEmail === subscription.email}
              onClick={() => {updateSubscriptionEmail(subscription.email, newSubscriptionEmail); rerender(); setEditSubscription(false)}}
            >
              Confirm edit
            </button>
          </>
        ) : (
          <>
            <h2>
              <KeyIcon color="white" className="inline-block mr-2" />
              Key details:
            </h2>
            <ul className="pl-10 list-disc space-y-1">
              <li>{subscription.email}</li>
              <li>
                expires at {subscription.key_expiration_date.toDateString()}
              </li>
            </ul>
          </>
        )}
      </div>
    </motion.div>
  );
}
