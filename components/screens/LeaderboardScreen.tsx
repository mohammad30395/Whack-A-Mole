"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NeonButton } from "@/components/ui/NeonButton";
import { ScreenShell } from "@/components/ui/ScreenShell";
import type { Difficulty, LeaderboardEntry } from "@/types/game";
import { formatAccuracy, shortDate } from "@/utils/format";

interface LeaderboardScreenProps {
  entries: LeaderboardEntry[];
  onBack: () => void;
  onClear: () => void;
}

type Filter = "all" | Difficulty;

export function LeaderboardScreen({ entries, onBack, onClear }: LeaderboardScreenProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const visibleEntries = useMemo(() => {
    return entries
      .filter((entry) => filter === "all" || entry.difficulty === filter)
      .sort((a, b) => b.score - a.score || b.highestCombo - a.highestCombo)
      .slice(0, 20);
  }, [entries, filter]);

  return (
    <ScreenShell>
      <GlassPanel className="flex max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Leaderboard</p>
            <h2 className="text-3xl font-black uppercase sm:text-5xl">Top scores</h2>
          </div>
          <div className="flex gap-2">
            <NeonButton onClick={onClear} variant="danger">
              Clear
            </NeonButton>
            <NeonButton onClick={onBack} variant="secondary">
              Back
            </NeonButton>
          </div>
        </div>
        <div className="mb-3 grid grid-cols-4 gap-2">
          {(["all", "easy", "medium", "hard"] as Filter[]).map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-lg border px-2 py-2 text-xs font-black uppercase tracking-[0.14em] transition ${
                filter === item ? "border-cyan-200 bg-cyan-200/20 text-cyan-50" : "border-white/10 bg-black/20 text-white/55"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-white/10 bg-black/20">
          {visibleEntries.length === 0 ? (
            <div className="flex h-full items-center justify-center p-8 text-center text-sm font-semibold text-white/55">
              No scores yet. Play a round to claim the board.
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              {visibleEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.025 }}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-white/10 p-3 last:border-b-0 sm:grid-cols-[auto_1.4fr_.8fr_.8fr_.8fr_.8fr]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-200/30 bg-cyan-200/10 text-sm font-black text-cyan-100">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-black text-white">{entry.playerName}</div>
                    <div className="truncate text-xs font-semibold text-white/45">@{entry.username}</div>
                  </div>
                  <div className="text-right text-lg font-black text-white">{entry.score}</div>
                  <div className="hidden text-xs font-bold uppercase text-white/55 sm:block">{entry.difficulty}</div>
                  <div className="hidden text-xs font-bold text-white/55 sm:block">{formatAccuracy(entry.accuracy)}</div>
                  <div className="hidden text-xs font-bold text-white/55 sm:block">{shortDate(entry.createdAt)}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </GlassPanel>
    </ScreenShell>
  );
}
