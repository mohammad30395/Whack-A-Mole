import type { DifficultyConfig, ObjectColor, ObjectTheme } from "@/types/game";

export const STORAGE_KEYS = {
  leaderboard: "wam_arcade_leaderboard_v1",
  settings: "wam_arcade_settings_v1",
  player: "wam_arcade_player_v1"
} as const;

export const MAX_MISSES = 10;
export const GAME_DURATION_SECONDS = 60;

export const OBJECT_THEMES: { value: ObjectTheme; label: string }[] = [
  { value: "animals", label: "Animals" },
  { value: "fruits", label: "Fruits" },
  { value: "monsters", label: "Monsters" },
  { value: "robots", label: "Robots" },
  { value: "random", label: "Random Objects" }
];

export const OBJECT_COLORS: { value: ObjectColor; label: string }[] = [
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "yellow", label: "Yellow" },
  { value: "purple", label: "Purple" },
  { value: "random", label: "Random" }
];

export const DIFFICULTIES: Record<string, DifficultyConfig> = {
  easy: {
    id: "easy",
    label: "Easy",
    description: "Relaxed timing, forgiving reactions, and light cactus pressure.",
    maxActive: [1, 2],
    spawnInterval: 920,
    visibleDuration: 1450,
    cactusChance: 0.08,
    scoreMultiplier: 1,
    accent: "#22d3ee"
  },
  medium: {
    id: "medium",
    label: "Medium",
    description: "Balanced speed with occasional multi-target bursts.",
    maxActive: [2, 3],
    spawnInterval: 700,
    visibleDuration: 1080,
    cactusChance: 0.15,
    scoreMultiplier: 1.45,
    accent: "#a3e635"
  },
  hard: {
    id: "hard",
    label: "Hard",
    description: "Fast waves, sharp reaction windows, and punishing cactus traps.",
    maxActive: [3, 5],
    spawnInterval: 470,
    visibleDuration: 760,
    cactusChance: 0.24,
    scoreMultiplier: 2.1,
    accent: "#fb7185"
  }
};
