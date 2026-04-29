"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { logOut } from "@/features/auth/application/schoolAuth";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default function NavBar() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const path = usePathname();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const controlScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100)
        setIsVisible(false);
      else setIsVisible(true);

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", controlScroll);

    return () => window.removeEventListener("scroll", controlScroll);
  }, []);

  const handleLogOut = async () => {
    await logOut();
    router.push("/school");
  };

  return (
    <nav
      className={`fixed top-0 z-20 bg-main w-full h-[50px] grid grid-cols-[auto_1fr] items-center transition-transform transition-opacity duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="flex justify-start items-center ml-3 md:ml-7">
        <button
          type="button"
          onClick={handleLogOut}
          className="hover:scale-115 scale-105 transition-all cursor-pointer text-text-main hover:text-text-second"
          aria-label="Log out"
        >
          <LogOut width={20} height={20} />
        </button>
      </div>
      <div className="flex justify-end xl:space-x-5 mr-2 sm:mr-5">
        <Link
          href="/school/platform/generateKey"
          className={`nav-link ${
            path === "/school/platform/generateKey" ? "text-text-second" : "text-text-main"
          } py-1 px-1 sm:px-3 navigationBtn`}
        >
          Generate key
        </Link>
        <Link
          href="/school/platform/students"
          className={`nav-link ${
            path === "/school/platform/students" ? "text-text-second" : "text-text-main"
          } py-1 px-1 sm:px-3 navigationBtn`}
        >
          Students
        </Link>
        <Link
          href="/school/platform/subscriptions"
          className={`nav-link ${
            path === "/school/platform/subscriptions" ? "text-text-second" : "text-text-main"
          } py-1 px-1 sm:px-3 navigationBtn`}
        >
          Subscriptions
        </Link>
      </div>
    </nav>
  );
}
