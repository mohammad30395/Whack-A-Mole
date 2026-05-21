import type { HTMLAttributes, ReactNode } from "react";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function GlassPanel({ children, className = "", ...props }: GlassPanelProps) {
  return (
    <div
      className={`border border-white/15 bg-white/[0.075] shadow-2xl shadow-black/35 backdrop-blur-2xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
