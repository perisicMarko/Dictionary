import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/animationVariants';
import Link from 'next/link';
import { useActionState } from 'react';
import { resendVerificationMail } from '@/actions/auth/user';

export function VerificationEmailSent({ email }: { email: string }) {
      const [resendState, resendAction, isPendingReset] = useActionState(
        resendVerificationMail,
        undefined
      );
        
    return (
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="flex flex-col items-center sm:w-[500px] w-3/4 rounded-3xl bg-slate-800 p-3 sm:p-5 mt-15 sm:mt-20"
      >
        <motion.p variants={itemVariants} className="text-center text-white">
          <b>Verification email has been sent.<br/> </b>
          Check your email <b className="text-blue-300"> spam</b> section and mark email as{" "}
          <b className="text-blue-300">report not spam</b> so you can receive our
          messages.
          <br />
        </motion.p>
        <Link
          href="https://mail.google.com/"
          className="hover:scale-115 text-white my-3"
        >
          <u className="text-blue-300">Gmail link.</u>
        </Link>
        <motion.form action={resendAction} className="w-full">
          <input name="email" defaultValue={email} hidden />
          <button className="primaryBtn" type="submit">
            {isPendingReset ? "Resending mail..." : "Resend mail"}
          </button>
        </motion.form>
        {resendState && (
          <motion.span className="text-white">
            Verification email was successfully resent.
          </motion.span>
        )}
      </motion.div>
    );
}   
    