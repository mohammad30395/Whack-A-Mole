"use client";

import { motion } from "framer-motion";
import { DIFFICULTIES } from "@/lib/constants";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NeonButton } from "@/components/ui/NeonButton";
import { ScreenShell } from "@/components/ui/ScreenShell";
import type { Difficulty } from "@/types/game";

interface DifficultyScreenProps {
  onBack: () => void;
  onSelect: (difficulty: Difficulty) => void;
}

export function DifficultyScreen({ onBack, onSelect }: DifficultyScreenProps) {
  return (
    <ScreenShell>
      <GlassPanel className="w-full max-w-5xl rounded-2xl p-4 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Difficulty</p>
            <h2 className="text-3xl font-black uppercase sm:text-5xl">Pick your pace</h2>
          </div>
          <NeonButton onClick={onBack} variant="secondary">
            Back
          </NeonButton>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {Object.values(DIFFICULTIES).map((difficulty) => (
            <motion.button
              key={difficulty.id}
              whileHover={{ scale: 1.025, y: -4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelect(difficulty.id)}
              className="rounded-xl border border-white/15 bg-black/25 p-5 text-left shadow-xl shadow-black/25 transition hover:border-white/35"
            >
              <div className="mb-5 h-2 rounded-full" style={{ background: difficulty.accent }} />
              <h3 className="text-2xl font-black uppercase text-white">{difficulty.label}</h3>
              <p className="mt-3 text-sm leading-6 text-white/65">{difficulty.description}</p>
              <p className="mt-4 text-xs font-black uppercase tracking-[0.17em] text-white/50">
                x{difficulty.scoreMultiplier.toFixed(2)} score
              </p>
            </motion.button>
          ))}
        </div>
      </GlassPanel>
    </ScreenShell>
  );
}
