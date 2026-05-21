"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface ScreenShellProps {
  children: ReactNode;
  className?: string;
}

export function ScreenShell({ children, className = "" }: ScreenShellProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -18, scale: 0.985 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={`relative z-10 flex h-dvh w-screen items-center justify-center overflow-hidden px-3 py-3 sm:px-5 ${className}`}
    >
      {children}
    </motion.main>
  );
}
