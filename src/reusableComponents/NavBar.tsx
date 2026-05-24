"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { logOutUser } from "@/features/auth/application/userAuth";
import { LogOut, Menu, X } from "lucide-react";

export function NavBar() {
  const path = usePathname();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuToggle, setMobileMenuToggle] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileMenuToggle) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!mobileMenuRef.current?.contains(target)) {
        setMobileMenuToggle(false);
      }
    };

    document.addEventListener("click", handleOutsideClick, true);

    return () => {
      document.removeEventListener("click", handleOutsideClick, true);
    };
  }, [mobileMenuToggle]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const controlScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", controlScroll);

    return () => window.removeEventListener("scroll", controlScroll);
  }, []);


  // todo: check if the next.js has some way of retrieving all possible url paths
  // so that this don't need to be hardcoded
  const navigationRoutes = [
    {
      path: "/notes/inputWord",
      label: "Input word",
    },
    {
      path: "/notes/recall",
      label: "Recall",
    },
    {
      path: "/notes/yourWords",
      label: "Your words",
    },
    {
      path: "/notes/history",
      label: "Learned words",
    },
  ];

  const isNavigationRoute = navigationRoutes.some((route) => route.path === path);

  const handleLogOut = async () => {
    await logOutUser();
    router.push("/");
  };

  return (
    <>
      {isVisible && isNavigationRoute && (
        <nav className="hidden fixed top-0 z-50 bg-main w-full h-12.5 sm:grid grid-cols-[auto_1fr] items-center transition-all enter-fade">
          <div className="flex justify-start items-center ml-3 md:ml-7 enter-fade-up enter-delay-1">
            <button
              type="submit"
              className="hover:scale-115 scale-105 duration-300 cursor-pointer text-text-main hover:text-text-second transition-all"
              onClick={() => handleLogOut()}
            >
              <LogOut width={20} height={20} />
            </button>
          </div>
          <div className="flex justify-end items-center xl:space-x-5 mr-2 sm:mr-5 enter-fade-up enter-delay-1">
            {navigationRoutes.map((route) => {
              return (
                <Link
                  key={route.path}
                  href={route.path}
                  className={`navigation-btn ${
                    path === route.path ? "text-text-second" : "text-text-main"
                  } py-1 px-1 sm:px-3`}
                >
                  {route.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {isNavigationRoute && isVisible && (
        <div
          ref={mobileMenuRef}
          className="fixed top-0 z-50 bg-main w-full min-h-12.5 gap-2 transition-all sm:hidden py-2 enter-fade"
        >
          <div
            className={
              "w-full flex justify-end items-center pr-3 py-2 enter-fade-up enter-delay-1 " +
              (mobileMenuToggle && " mb-2")
            }
          >
            <span
              onClick={() => setMobileMenuToggle(!mobileMenuToggle)}
              title="Menu"
            >
              {mobileMenuToggle ? (
                <X color="white" className="btn" width={25} height={25} />
              ) : (
                <Menu color="white" className="btn" height={25} width={25} />
              )}
            </span>
          </div>

          {mobileMenuToggle && (
            <>
              <hr className="border-1 border-second w-full enter-fade-up enter-delay-1" />

              <div className="w-full center-vertically items-start my-3 enter-fade">
                {navigationRoutes.map((route) => {
                  return (
                    <span
                      key={route.path}
                      className="mt-4 enter-fade-up enter-delay-1"
                      onClick={() => setMobileMenuToggle(false)}
                    >
                      <Link
                        href={route.path}
                        className={`navigation-btn ${
                          path === route.path
                            ? "text-text-second font-bold"
                            : "text-text-main"
                        } py-1 px-3`}
                      >
                        {route.label}
                      </Link>
                    </span>
                  );
                })}

                <div className="mt-7 enter-fade-up enter-delay-1">
                  <button
                    type="submit"
                    className="scale-105 transition-all duration-300 cursor-pointer text-text-main hover:text-text-second px-3"
                    onClick={() => handleLogOut()}
                  >
                    <LogOut width={20} height={20} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
