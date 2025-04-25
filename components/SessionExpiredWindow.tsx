import { logOutUser } from "@/actions/auth/user";
import { restoreSession } from "@/actions/manageSession/restoreSession";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";

export default function SessionExpiredWindow({
  collapseWindow,
}: {
  collapseWindow: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();

  return (
    <motion.div
      className="appWidth bg-slate-800 rounded-3xl z-100 absolute top-30 p-5"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.h2 variants={itemVariants} className="text-center text-white">
        <b>Your session will expire very soon.</b>
      </motion.h2>
      <motion.p className="text-white text-center" variants={itemVariants}>
        Would you like to restore it and stay logged or do you want to log out?
      </motion.p>
      <form
        action={() => {
          collapseWindow(false);
          restoreSession();
        }}
        className="mt-5"
      >
        <div className="grid grid-cols-2 gap-2">
          <button className="primaryBtn" type="submit">
            Restore Session
          </button>
          <button
            className="primaryBtn"
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
