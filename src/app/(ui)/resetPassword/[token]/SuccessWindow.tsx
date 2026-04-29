import Link from 'next/link';

export default function SuccessWindow() {
  return (
    <div className="center-vertically box-layout mt-20 sm:mt-25 md:mt-30 xl:mt-50 z-10 enter-fade">
      <p className="text-box z-10 enter-fade-up enter-delay-1">
        <b>Your password has been reset.</b>
      </p>
      <Link
        href="/login"
        className="text-text-second mt-3 hover:underline hover:scale-115 transition-all enter-fade-up enter-delay-1"
      >
        <u>
          <i>Click to log in.</i>
        </u>
      </Link>
    </div>
  );
}
