import { logOutUser } from "@/actions/auth/user";
import { restoreSession } from "@/actions/manageSession/restoreSession";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useActionState, useContext } from "react";
import { useRouter } from "next/navigation";
import Loader from "./common/Loader";
import { TokenContext } from "./TokenContextProvider";


export default function SessionExpiredWindow({
  collapseWindow,
}: {
  collapseWindow: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(restoreSession, undefined);
  const tokenContext = useContext(TokenContext);

  if (state?.status === 401) router.push("/");
  if(state?.status === 200 && state.accessToken) tokenContext?.setAccessToken(state.accessToken)

  return (
  <div className="inset-0 bg-white/80 fixed center z-100" onClick={(e) => e.stopPropagation()}>
    <motion.div
      className="box-layout p-50"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.h2 variants={itemVariants} className="text-box">
        <b>Your session will expire very soon.</b>
      </motion.h2>
      <motion.p className="text-box" variants={itemVariants}>
        Would you like to restore it and stay logged in or do you want to log out?
      </motion.p>
      <form
        action={() => {
          collapseWindow(false);
          action();
        }}
        className="mt-5"
      >
        <div className="grid grid-cols-2 gap-2">
          <button className="primary-btn center" type="submit">
            {isPending ? <Loader /> : "Restore Session"}
          </button>
          <button
            className="primary-btn !px-3"
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
    </div>
  );
}
