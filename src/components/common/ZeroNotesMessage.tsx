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
      className="center mt-10 box-layout"
    >
      <motion.h2 variants={itemVariants} className="text-box">
        <b>{message}</b>
      </motion.h2>
    </motion.div>
  );
}
