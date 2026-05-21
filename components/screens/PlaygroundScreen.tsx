"use client";

import { motion } from "framer-motion";
import { PLAYGROUNDS } from "@/lib/playgrounds";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NeonButton } from "@/components/ui/NeonButton";
import { ScreenShell } from "@/components/ui/ScreenShell";
import type { PlaygroundId } from "@/types/game";

interface PlaygroundScreenProps {
  selected: PlaygroundId;
  onBack: () => void;
  onSelect: (id: PlaygroundId) => void;
}

export function PlaygroundScreen({ selected, onBack, onSelect }: PlaygroundScreenProps) {
  return (
    <ScreenShell>
      <GlassPanel className="flex max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Playground</p>
            <h2 className="text-2xl font-black uppercase sm:text-4xl">Choose the arena</h2>
          </div>
          <NeonButton onClick={onBack} variant="secondary">
            Back
          </NeonButton>
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-3 overflow-hidden lg:grid-cols-3">
          {PLAYGROUNDS.map((playground) => (
            <motion.button
              key={playground.id}
              whileHover={{ scale: 1.025, y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(playground.id)}
              className={`relative min-h-28 overflow-hidden rounded-xl border p-4 text-left transition bg-gradient-to-br ${playground.background} ${
                selected === playground.id ? "border-white shadow-lg" : "border-white/15"
              }`}
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl" style={{ background: playground.glow }} />
              <div className="relative">
                <h3 className="text-lg font-black uppercase text-white">{playground.label}</h3>
                <p className="mt-2 line-clamp-3 text-xs font-medium leading-5 text-white/68">{playground.description}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </GlassPanel>
    </ScreenShell>
  );
}
