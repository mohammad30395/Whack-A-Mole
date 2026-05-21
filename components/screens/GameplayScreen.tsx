"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { DIFFICULTIES, GAME_DURATION_SECONDS, MAX_MISSES } from "@/lib/constants";
import { getPlayground } from "@/lib/playgrounds";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NeonButton } from "@/components/ui/NeonButton";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { StatPill } from "@/components/ui/StatPill";
import type { Difficulty, GameStats, PlayerProfile, PlaygroundId, RuntimeGameUpdate, SoundSettings } from "@/types/game";
import { formatAccuracy, formatTime } from "@/utils/format";

const PhaserGame = dynamic(() => import("@/components/game/PhaserGame").then((module) => module.PhaserGame), {
  ssr: false,
  loading: () => <div className="flex h-full w-full items-center justify-center text-sm font-black uppercase tracking-[0.18em] text-cyan-100">Loading arena</div>
});

interface GameplayScreenProps {
  player: PlayerProfile;
  difficulty: Difficulty;
  playground: PlaygroundId;
  soundSettings: SoundSettings;
  onToggleSound: () => void;
  onVolumeChange: (volume: number) => void;
  onRestartSound: (sound: "hit" | "combo" | "gameover") => void;
  onBackToMenu: () => void;
  onGameOver: (stats: GameStats) => void;
}

const emptyUpdate: RuntimeGameUpdate = {
  score: 0,
  misses: 0,
  combo: 0,
  highestCombo: 0,
  hits: 0,
  elapsedSeconds: 0,
  accuracy: 100
};

export function GameplayScreen({
  player,
  difficulty,
  playground,
  soundSettings,
  onToggleSound,
  onVolumeChange,
  onRestartSound,
  onBackToMenu,
  onGameOver
}: GameplayScreenProps) {
  const [paused, setPaused] = useState(false);
  const [restartKey, setRestartKey] = useState(0);
  const [update, setUpdate] = useState<RuntimeGameUpdate>(emptyUpdate);
  const theme = getPlayground(playground);
  const difficultyConfig = DIFFICULTIES[difficulty];
  const remaining = Math.max(0, GAME_DURATION_SECONDS - update.elapsedSeconds);
  const boardStyle = useMemo(
    () => ({
      boxShadow: `0 0 36px ${theme.glow}`,
      borderColor: `${theme.accent}66`
    }),
    [theme.accent, theme.glow]
  );

  const restart = useCallback(() => {
    setUpdate(emptyUpdate);
    setPaused(false);
    setRestartKey((key) => key + 1);
  }, []);

  return (
    <ScreenShell lockScroll className={`bg-gradient-to-br ${theme.background}`}>
      <div className="grid h-full w-full max-w-7xl grid-rows-[auto_1fr] gap-2 overflow-hidden">
        <GlassPanel className="rounded-xl p-2 sm:p-3">
          <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
            <StatPill label="Score" value={update.score} accent="text-cyan-100" />
            <StatPill label="Missed" value={`${update.misses}/${MAX_MISSES}`} accent="text-rose-100" />
            <StatPill label="Combo" value={update.combo} accent="text-lime-100" />
            <StatPill label="Timer" value={formatTime(remaining)} accent="text-yellow-100" />
            <StatPill label="Mode" value={difficultyConfig.label} accent="text-fuchsia-100" />
            <StatPill label="Hits" value={update.hits} />
            <StatPill label="Best" value={update.highestCombo} />
            <StatPill label="Accuracy" value={formatAccuracy(update.accuracy)} />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <NeonButton onClick={() => setPaused((value) => !value)} variant="secondary" className="min-h-9 px-3 py-1 text-[0.65rem]">
              {paused ? "Resume" : "Pause"}
            </NeonButton>
            <NeonButton onClick={restart} variant="secondary" className="min-h-9 px-3 py-1 text-[0.65rem]">
              Restart
            </NeonButton>
            <NeonButton onClick={onToggleSound} variant="secondary" className="min-h-9 px-3 py-1 text-[0.65rem]">
              {soundSettings.muted ? "Muted" : "Sound"}
            </NeonButton>
            <NeonButton onClick={onBackToMenu} variant="danger" className="min-h-9 px-3 py-1 text-[0.65rem]">
              Menu
            </NeonButton>
            <label className="col-span-2 flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/55 sm:ml-auto">
              Volume
              <input
                className="range-slider w-full sm:w-28"
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={soundSettings.volume}
                onChange={(event) => onVolumeChange(Number(event.target.value))}
              />
            </label>
          </div>
        </GlassPanel>
        <GlassPanel className="min-h-0 overflow-hidden rounded-xl border-2 p-1 sm:p-2" style={boardStyle}>
          <PhaserGame
            rows={player.length}
            cols={player.width}
            difficulty={difficulty}
            playground={playground}
            objectTheme={player.objectTheme}
            objectColor={player.objectColor}
            paused={paused}
            restartKey={restartKey}
            onUpdate={setUpdate}
            onGameOver={onGameOver}
            onSound={onRestartSound}
          />
        </GlassPanel>
      </div>
    </ScreenShell>
  );
}
