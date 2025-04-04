"use client";
import React from "react";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animationVariants";

export default function ZeroNotesMessage({ message }: { message: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="center bg-slate-800 w-3/4 sm:w-[600px] mt-60 rounded-4xl  p-2"
    >
      <motion.h2 variants={itemVariants} className="text-center text-white">
        <b>{message}</b>
      </motion.h2>
    </motion.div>
  );
}
