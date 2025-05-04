import { motion } from "framer-motion";
import { useActionState } from "react";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { updateUsersPassword } from "@/actions/manageUsers/resetPassword";
import { TUser } from "@/lib/types";
import Loader from "@/components/Loader";
import SuccessWindow from "./SuccessWindow";

export default function ChangePasswordForm({
  user,
}: {
  user: TUser | undefined;
}) {
  const [state, action, isPending] = useActionState(
    updateUsersPassword,
    undefined
  );
  return (
    <>
      {state?.success ? (
        <SuccessWindow />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="appWidth rounded-3xl bg-slate-800 p-5 mt-20 sm:mt-25 md:mt-30 xl:mt-50"
        >
          <motion.form
            variants={itemVariants}
            className="form w-full h-full"
            action={action}
          >
            <input name="userId" defaultValue={user?.id} hidden />
            <div>
              <label htmlFor="password" className="text-white">
                Enter new password:
              </label>
              <input type="password" name="password" className="formInput" />
              {(state?.errors?.password?.length || 0) > 0 && (
                <span className="error">Password:</span>
              )}
              <ul className="list-disc">
                {state?.errors?.password &&
                  state.errors.password.map((e) => (
                    <li key={e} className="error ml-6">
                      {e}
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm new password:</label>
              <input
                type="password"
                name="confirmPassword"
                className="formInput"
              />
              {state?.errors?.confirmPassword === false && (
                <motion.span variants={itemVariants} className="error">
                  Passwords do not match.
                </motion.span>
              )}
            </div>
            <div className="center mt-5">
              <button type="submit" className="primaryBtn z-0 center">
                {isPending ? <Loader /> : "Reset password"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </>
  );
}
