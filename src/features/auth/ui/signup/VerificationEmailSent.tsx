"use client";

import Link from 'next/link';
import { useActionState } from 'react';
import { resendVerificationMail } from '@/features/auth/application/userAuth';
import Loader from '@/reusableComponents/Loader';

export default function VerificationEmailSent({ email }: { email: string }) {
  const [resendState, resendAction, isPendingReset] = useActionState(
    resendVerificationMail,
    undefined
  );

  return (
    <div className="center-vertically box-layout mt-15 sm:mt-20 enter-fade">
      <p className="text-box enter-fade-up enter-delay-1">
        <b>Verification email has been sent.<br /> </b>
        Check your email <b className="text-text-second">spam</b> section and mark email as{" "}
        <b className="text-text-second">report not spam</b> so you can receive our
        messages.
        <br />
      </p>
      <Link
        href="https://mail.google.com/"
        className="hover:scale-115 text-text-main my-3 transition-all enter-fade-up enter-delay-1"
      >
        <u className="text-text-second">Gmail link.</u>
      </Link>
      <form action={resendAction} className="w-full enter-fade-up enter-delay-1">
        <input name="email" defaultValue={email} hidden />
        <button
          className="primary-btn center"
          type="submit"
          disabled={isPendingReset}
        >
          {isPendingReset ? <Loader /> : "Resend mail"}
        </button>
      </form>
      {resendState?.success ? (
        <span className="text-text-main enter-fade-up enter-delay-1">
          Verification email was successfully resent.
        </span>
      ) : null}
    </div>
  );
}
