import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="box-width mt-15 enter-fade">
        <video controls autoPlay muted className="rounded-3xl w-full">
          <source src="/promo_video.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="relative mt-15 center-vertically box-layout overflow-hidden enter-fade">
        <svg
          viewBox="0 0 600 260"
          preserveAspectRatio="none"
          className="absolute inset-0 z-0 h-full w-full pointer-events-none"
          aria-hidden="true"
        >
          <rect
            x="10"
            y="10"
            width="580"
            height="240"
            rx="15"
            ry="15"
            stroke="#60A5FA"
            strokeWidth="3"
            fill="transparent"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animated-border-rect"
          />
        </svg>

        <h2 className="relative z-10 text-center text-text-main px-4 py-2 mb-2 enter-fade-up enter-delay-1">
          <i>&quot;Learning takes time, so take it step by step.&quot;</i>
        </h2>

        <div className="relative z-10 w-full center-vertically enter-fade-up enter-delay-1">
          <Link
            className="flex justify-end text-box hover:scale-105 hover:underline text-[14px] mb-2 sm:text-[18px] transition-all"
            href="/about"
          >
            About the app
          </Link>
          <Link className="primary-btn center" href="/login">
            <b>Log in</b>
          </Link>
          <div className="grid grid-cols-2 w-full mt-3">
            <Link
              className="flex items-start justify-start text-text-main hover:scale-105 hover:underline text-[14px] sm:text-[18px] tranistion-all"
              href="/signup"
            >
              Sign up
            </Link>
            <Link
              className="flex items-start justify-end text-text-main hover:scale-105 hover:underline text-[14px] sm:text-[18px] transition-all"
              href="/forgotPassword"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
