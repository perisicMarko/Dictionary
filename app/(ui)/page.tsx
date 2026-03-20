"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const borderOffset = 10;

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const rectWidth = dimensions.width - borderOffset * 2;
  const rectHeight = dimensions.height - borderOffset * 2;
  const dashLength = 2 * (rectWidth + rectHeight);

  return (
    <>
    <motion.div className="box-layout !bg-transparent mt-15 center">
      <video controls autoPlay muted className="rounded-3xl w-full">
        <source src='/promo_video.mp4' type="video/mp4"/>
      </video>
    </motion.div>
    <motion.div
      ref={containerRef}
      className="relative mt-15 center-vertically box-layout"
    >
      <motion.svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="absolute top-0 left-0 z-0 pointer-events-none"
      >
        <motion.rect
          x={borderOffset}
          y={borderOffset}
          width={rectWidth}
          height={rectHeight}
          rx="15"
          ry="15"
          stroke="#60A5FA"
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={dashLength}
          animate={{ strokeDashoffset: [dashLength, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.svg>

      <motion.h2 className="relative z-10 text-center text-text-main px-4 py-2 mb-2">
        <i>&quot;Learning takes time, so take it step by step.&quot;</i>
      </motion.h2>

      <motion.div className="relative z-10 w-full center-vertically">
        <Link
          className="flex justify-end text-box hover:scale-105 hover:underline text-[14px] mb-2 sm:text-[18px] transition-all"
          href="/about"
        >
          <u>About the app</u>
        </Link>
        <Link className="primary-btn center" href="/logIn">
          <b>Log in</b>
        </Link>
        <div className="grid grid-cols-2 w-full mt-3">
          <Link
            className="flex items-start justify-start text-text-main hover:scale-105 hover:underline text-[14px] sm:text-[18px] tranistion-all"
            href="/signUp"
          >
            <u>Sign up</u>
          </Link>
          <Link
            className="flex items-start justify-end text-text-main hover:scale-105 hover:underline text-[14px] sm:text-[18px] transition-all"
            href="/forgotPassword"
          >
            <u>Forgot password?</u>
          </Link>
        </div>
      </motion.div>
    </motion.div>
    </>
  );
}
