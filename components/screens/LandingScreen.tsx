"use client";

import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NeonButton } from "@/components/ui/NeonButton";
import { ScreenShell } from "@/components/ui/ScreenShell";
import type { SoundSettings } from "@/types/game";

interface LandingScreenProps {
  settings: SoundSettings;
  onStart: () => void;
  onRules: () => void;
  onLeaderboard: () => void;
  onToggleSound: () => void;
}

export function LandingScreen({ settings, onStart, onRules, onLeaderboard, onToggleSound }: LandingScreenProps) {
  return (
    <ScreenShell>
      <GlassPanel className="w-full max-w-4xl rounded-2xl px-5 py-6 text-center sm:px-10 sm:py-9">
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 13 }}
          className="mx-auto mb-5 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-100"
        >
          local arcade challenge
        </motion.div>
        <motion.h1
          animate={{ textShadow: ["0 0 18px #22d3ee", "0 0 28px #fb7185", "0 0 18px #22d3ee"] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-balance text-5xl font-black uppercase leading-[0.92] tracking-normal text-white sm:text-7xl lg:text-8xl"
        >
          Whack-a-Mole
        </motion.h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-6 text-white/70 sm:text-base">
          A neon, glassy, single-screen reflex game with Phaser action and a live Three.js arcade backdrop.
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <NeonButton onClick={onStart} className="sm:min-w-48">
            Start Game
          </NeonButton>
          <NeonButton onClick={onRules} variant="secondary" className="sm:min-w-36">
            Rules
          </NeonButton>
          <NeonButton onClick={onLeaderboard} variant="secondary" className="sm:min-w-48">
            Leaderboard
          </NeonButton>
          <NeonButton onClick={onToggleSound} variant="secondary" className="sm:min-w-36">
            {settings.muted ? "Sound Off" : "Sound On"}
          </NeonButton>
        </div>
      </GlassPanel>
    </ScreenShell>
  );
}
