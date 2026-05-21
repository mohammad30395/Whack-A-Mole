export type Screen =
  | "landing"
  | "setup"
  | "playground"
  | "difficulty"
  | "gameplay"
  | "gameover"
  | "rules"
  | "leaderboard";

export type Difficulty = "easy" | "medium" | "hard";
export type ObjectTheme = "animals" | "fruits" | "monsters" | "robots" | "random";
export type ObjectColor = "red" | "blue" | "green" | "yellow" | "purple" | "random";
export type PlaygroundId = "forest" | "desert" | "snow" | "space" | "cyberpunk" | "volcano";

export interface PlayerProfile {
  fullName: string;
  username: string;
  length: number;
  width: number;
  objectTheme: ObjectTheme;
  objectColor: ObjectColor;
}

export interface DifficultyConfig {
  id: Difficulty;
  label: string;
  description: string;
  maxActive: [number, number];
  spawnInterval: number;
  visibleDuration: number;
  cactusChance: number;
  scoreMultiplier: number;
  accent: string;
}

export interface PlaygroundTheme {
  id: PlaygroundId;
  label: string;
  description: string;
  background: string;
  hole: string;
  glow: string;
  accent: string;
  particle: string;
}

export interface GameStats {
  score: number;
  hits: number;
  misses: number;
  combo: number;
  highestCombo: number;
  elapsedSeconds: number;
  accuracy: number;
  difficulty: Difficulty;
  playground: PlaygroundId;
  gameOverReason: "misses" | "cactus" | "manual";
}

export interface LeaderboardEntry extends GameStats {
  id: string;
  playerName: string;
  username: string;
  createdAt: string;
}

export interface SoundSettings {
  muted: boolean;
  volume: number;
}

export interface RuntimeGameUpdate {
  score: number;
  misses: number;
  combo: number;
  highestCombo: number;
  hits: number;
  elapsedSeconds: number;
  accuracy: number;
}
