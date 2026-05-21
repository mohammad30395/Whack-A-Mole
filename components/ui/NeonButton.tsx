"use client";

import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

interface NeonButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
}

const variants = {
  primary: "border-cyan-300/70 bg-cyan-300/15 text-cyan-50 shadow-cyan-400/25 hover:bg-cyan-300/25",
  secondary: "border-white/20 bg-white/10 text-white shadow-white/10 hover:bg-white/15",
  danger: "border-rose-300/70 bg-rose-400/15 text-rose-50 shadow-rose-400/25 hover:bg-rose-400/25"
};

export function NeonButton({ children, className = "", variant = "primary", ...props }: NeonButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: props.disabled ? 1 : 1.035 }}
      whileTap={{ scale: props.disabled ? 1 : 0.96 }}
      className={`inline-flex min-h-11 items-center justify-center rounded-lg border px-4 py-2 text-sm font-black uppercase tracking-[0.16em] shadow-lg transition disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
