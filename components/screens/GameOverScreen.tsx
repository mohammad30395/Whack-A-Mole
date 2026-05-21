"use client";

import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NeonButton } from "@/components/ui/NeonButton";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { StatPill } from "@/components/ui/StatPill";
import type { GameStats } from "@/types/game";
import { formatAccuracy, formatTime } from "@/utils/format";

interface GameOverScreenProps {
  stats: GameStats;
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
  onMainMenu: () => void;
  onLeaderboard: () => void;
}

export function GameOverScreen({ stats, onPlayAgain, onChangeDifficulty, onMainMenu, onLeaderboard }: GameOverScreenProps) {
  return (
    <ScreenShell>
      <GlassPanel className="w-full max-w-4xl rounded-2xl p-5 text-center sm:p-7">
        <motion.p
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-xs font-black uppercase tracking-[0.24em] text-rose-200"
        >
          Game over
        </motion.p>
        <h2 className="mt-2 text-5xl font-black uppercase text-white sm:text-7xl">{stats.score}</h2>
        <p className="mt-2 text-sm font-semibold text-white/60">Final score</p>
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <StatPill label="Highest Combo" value={stats.highestCombo} accent="text-lime-100" />
          <StatPill label="Accuracy" value={formatAccuracy(stats.accuracy)} accent="text-cyan-100" />
          <StatPill label="Total Hits" value={stats.hits} />
          <StatPill label="Missed" value={stats.misses} accent="text-rose-100" />
          <StatPill label="Difficulty" value={stats.difficulty.toUpperCase()} accent="text-fuchsia-100" />
          <StatPill label="Time" value={formatTime(stats.elapsedSeconds)} accent="text-yellow-100" />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <NeonButton onClick={onPlayAgain}>Play Again</NeonButton>
          <NeonButton onClick={onChangeDifficulty} variant="secondary">
            Difficulty
          </NeonButton>
          <NeonButton onClick={onMainMenu} variant="secondary">
            Main Menu
          </NeonButton>
          <NeonButton onClick={onLeaderboard} variant="secondary">
            Leaderboard
          </NeonButton>
        </div>
      </GlassPanel>
    </ScreenShell>
  );
}
