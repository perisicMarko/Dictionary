import Link from "next/link";

export default function NotFound() {
  return (
    <main className="box-layout text-box enter-fade-up mt-10">
      <h1 className="mb-3 text-2xl font-bold md:text-3xl">Page not found</h1>

      <p className="mb-5 text-sm md:text-base">
        The page you are looking for does not exist.
      </p>

      <Link href="/" className="primary-btn center">
        Home page
      </Link>
    </main>
  );
}
