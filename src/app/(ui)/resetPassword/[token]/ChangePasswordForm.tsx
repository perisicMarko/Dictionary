import { motion } from "framer-motion";
import { useActionState, useState } from "react";
import { containerVariants, itemVariants } from "@/shared/lib/animationVariants";
import { completePasswordReset } from "@/features/auth/application/resetPassword";
import { TUser } from "@/shared/types";
import Loader from "@/components/common/Loader";
import SuccessWindow from "./SuccessWindow";

export default function ChangePasswordForm({
  user,
}: {
  user: TUser | undefined;
}) {
  const [state, action, isPending] = useActionState(
    completePasswordReset,
    undefined
  );

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const { newPassword, confirmPassword } = formData;

  return (
    <>
      {state?.success ? (
        <SuccessWindow />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="box-layout mt-20 sm:mt-25 md:mt-30 xl:mt-50"
        >
          <motion.form
            variants={itemVariants}
            className="form w-full h-full"
            action={action}
          >
            <input name="userId" defaultValue={user?.id} hidden />
            <div>
              <label htmlFor="password" className="text-text-main">
                Enter new password:
              </label>
              <input type="password" name="password" className="form-input" 
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})} 
              />
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
                className="form-input"
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
              {state?.errors?.confirmPassword === false && (
                <motion.span variants={itemVariants} className="error">
                  Passwords do not match.
                </motion.span>
              )}
            </div>
            <div className="center mt-5">
              <button
                type="submit"
                className={`primary-btn z-0 center ${
                  (!newPassword || !confirmPassword) && " opacity-50"
                }`}
                disabled={!newPassword || !confirmPassword}
              >
                {isPending ? <Loader /> : "Reset password"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </>
  );
}
