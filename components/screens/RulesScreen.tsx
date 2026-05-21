"use client";

import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NeonButton } from "@/components/ui/NeonButton";
import { ScreenShell } from "@/components/ui/ScreenShell";

interface RulesScreenProps {
  onBack: () => void;
  onStart: () => void;
}

const ruleGroups = [
  {
    title: "Core Rules",
    items: [
      "Hit normal pop-up targets to gain score.",
      "Every missed normal target adds one miss.",
      "10 missed normal targets ends the run.",
      "Hit a cactus and the game ends instantly."
    ]
  },
  {
    title: "Scoring",
    items: [
      "Consecutive hits build your combo.",
      "Higher combo increases score per hit.",
      "Difficulty changes spawn speed and score multiplier.",
      "Accuracy is based on hits compared with misses."
    ]
  },
  {
    title: "Mobile Controls",
    items: [
      "Tap targets as soon as they appear.",
      "Use the HUD buttons to pause, restart, mute, or leave.",
      "Use the volume slider with touch drag.",
      "Keep the phone in portrait or landscape; the board scales to fit."
    ]
  },
  {
    title: "PC Controls",
    items: [
      "Click targets with the mouse or trackpad.",
      "Press M to toggle sound.",
      "Press Escape to return to the main menu.",
      "Use HUD buttons for pause, restart, volume, and menu."
    ]
  }
];

export function RulesScreen({ onBack, onStart }: RulesScreenProps) {
  return (
    <ScreenShell>
      <GlassPanel className="flex w-full max-w-6xl flex-col rounded-2xl p-4 sm:p-5 md:max-h-full md:overflow-hidden">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">How to play</p>
            <h2 className="text-3xl font-black uppercase sm:text-5xl">Game rules</h2>
          </div>
          <div className="flex gap-2">
            <NeonButton onClick={onStart}>Start</NeonButton>
            <NeonButton onClick={onBack} variant="secondary">
              Back
            </NeonButton>
          </div>
        </div>
        <div className="grid min-h-0 flex-1 gap-3 md:grid-cols-2 md:overflow-hidden">
          {ruleGroups.map((group, index) => (
            <motion.section
              key={group.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="overflow-hidden rounded-xl border border-white/12 bg-black/24 p-4 shadow-xl shadow-black/20"
            >
              <h3 className="mb-3 text-lg font-black uppercase text-white">{group.title}</h3>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm font-semibold leading-5 text-white/68">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-200 shadow-[0_0_12px_rgba(103,232,249,.8)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          ))}
        </div>
      </GlassPanel>
    </ScreenShell>
  );
}
