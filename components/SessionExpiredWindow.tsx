import { logOutUser } from "@/actions/auth/user";
import { restoreSession } from "@/actions/manageSession/restoreSession";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useActionState } from "react";
import { useRouter } from "next/navigation";
import Loader from "./common/Loader";

export default function SessionExpiredWindow({
  collapseWindow,
}: {
  collapseWindow: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(restoreSession, undefined);

  if (state?.status === 401) router.push("/");

  return (
    <motion.div
      className="box-layout z-100 absolute top-30"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.h2 variants={itemVariants} className="text-box">
        <b>Your session will expire very soon.</b>
      </motion.h2>
      <motion.p className="text-box" variants={itemVariants}>
        Would you like to restore it and stay logged or do you want to log out?
      </motion.p>
      <form
        action={() => {
          collapseWindow(false);
          action();
        }}
        className="mt-5"
      >
        <div className="grid grid-cols-2 gap-2">
          <button className="primary-btn" type="submit">
            {isPending ? "Restore Session" : <Loader />}
          </button>
          <button
            className="primary-btn"
            onClick={(e) => {
              e.preventDefault();
              logOutUser();
              router.push("/");
            }}
          >
            Log me out
          </button>
        </div>
      </form>
    </motion.div>
  );
}
