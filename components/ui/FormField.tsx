"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

interface BaseProps {
  label: string;
  error?: string;
  children?: ReactNode;
}

export function FieldShell({ label, error, children }: BaseProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.16em] text-white/60">{label}</span>
      {children}
      <AnimatePresence>
        {error ? (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1 block text-xs font-semibold text-rose-200"
          >
            {error}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </label>
  );
}

export function TextInput({ label, error, className = "", ...props }: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell label={label} error={error}>
      <input
        className={`h-11 w-full rounded-lg border border-white/15 bg-black/25 px-3 text-sm text-white shadow-inner shadow-black/30 transition placeholder:text-white/35 focus:border-cyan-300 ${className}`}
        {...props}
      />
    </FieldShell>
  );
}

export function SelectInput({
  label,
  error,
  children,
  className = "",
  ...props
}: BaseProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <FieldShell label={label} error={error}>
      <select
        className={`h-11 w-full rounded-lg border border-white/15 bg-black/55 px-3 text-sm text-white shadow-inner shadow-black/30 transition focus:border-cyan-300 ${className}`}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  );
}
