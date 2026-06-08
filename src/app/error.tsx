"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="box-layout text-box enter-fade-up mt-10">
      <h1 className="mb-3 text-2xl font-bold md:text-3xl">
        Something went wrong
      </h1>

      <p className="mb-5 text-sm md:text-base">
        We could not load this page. Please try again later.
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="primary-btn center gap-2 sm:my-0"
        >
          <RotateCcw size={18} aria-hidden="true" />
          Try again
        </button>

        <Link href="/" className="primary-btn center sm:my-0">
          Home page
        </Link>
      </div>
    </main>
  );
}
