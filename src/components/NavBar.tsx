"use client";
import { useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { TokenContext } from "@/components/TokenContextProvider";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { logOutUser } from "@/features/auth/application/userAuth";
import { LogOut, Menu, X } from "lucide-react";

export function NavBar({shouldCollapse, resetCollapseFromParent} : {shouldCollapse : boolean, resetCollapseFromParent: (a : boolean) => void}) {
  const path = usePathname();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true); // on scroll, should navbar appear or not
  const tokenContext = useContext(TokenContext);
  const [mobileMenuToggle, setMobileMenuToggle] = useState(false);

  useEffect(() => {
    if(shouldCollapse && mobileMenuToggle){
      setMobileMenuToggle(false);
      resetCollapseFromParent(false);
    }else if(shouldCollapse && !mobileMenuToggle)
      resetCollapseFromParent(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileMenuToggle, shouldCollapse])

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

  const navigationRoutes = [
    {
      path: "/dictionary/inputWord",
      label: "Input word",
    },
    {
      path: "/dictionary/recall",
      label: "Recall",
    },
    {
      path: "/dictionary/yourWords",
      label: "Your words",
    },
    {
      path: "/dictionary/history",
      label: "Learned words",
    },
  ];

  const isNavigationRoute = navigationRoutes.map((e) => e.path).includes(path);

  const handleLogOut = async () => {
    tokenContext?.setAccessToken("");
    await logOutUser();
    router.push("/");
  };

  return (
    <>
      {/*Desktop nav menu */}
      {isVisible && isNavigationRoute && (
        <motion.nav
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="hidden fixed top-0 z-50 bg-main w-full h-[50px] sm:grid grid-cols-[auto_1fr] items-center transition-all"
        >
          <div className="flex justify-start items-center ml-3 md:ml-7">
            <button
              type="submit"
              className="hover:scale-115 scale-105 duration-300 cursor-pointer text-text-main hover:text-text-second transition-all"
              onClick={() => handleLogOut()}
            >
              <LogOut width={20} height={20} />
            </button>
          </div>
          <div className="flex justify-end items-center xl:space-x-5 mr-2 sm:mr-5">
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
        </motion.nav>
      )}

      {/* Mobile nav menu*/}
      {isNavigationRoute && isVisible && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="fixed top-0 z-50 bg-main w-full min-h-[50px] gap-2 transition-all sm:hidden py-2"
        >
          <motion.div
            initial="hidden"
            animate="show"
            variants={itemVariants}
            className={"w-full flex justify-end items-center pr-3 py-2 " + (mobileMenuToggle && " mb-2")}
          >
            <motion.span
              initial="hidden"
              animate="show"
              variants={itemVariants}
              onClick={() => setMobileMenuToggle(!mobileMenuToggle)}
              title="Menu"
            >
              {mobileMenuToggle ? (
                <X color="white" className="btn" width={25} height={25} />
              ) : (
                <Menu color="white" className="btn" height={25} width={25} />
              )}
            </motion.span>
          </motion.div>

          {mobileMenuToggle && (
            <>
              <motion.hr
                initial="hidden"
                animate="show"
                variants={itemVariants}
                className="border-1 border-second w-full"
              />

              <motion.div
                initial="hidden"
                animate="show"
                variants={containerVariants}
                className="w-full center-vertically items-start my-3"
              >
                {navigationRoutes.map((route) => {
                  return (
                    <motion.span
                      key={route.path}
                      initial="hidden"
                      animate="show"
                      variants={itemVariants}
                      className="mt-4"
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
                    </motion.span>
                  );
                })}

                <div className="mt-7">
                  <button
                    type="submit"
                    className="scale-105 transition-all duration-300 cursor-pointer text-text-main hover:text-text-second px-3"
                    onClick={() => handleLogOut()}
                  >
                    <LogOut width={20} height={20} />
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </>
  );
}
