import type { PlaygroundTheme } from "@/types/game";

export const PLAYGROUNDS: PlaygroundTheme[] = [
  {
    id: "forest",
    label: "Forest",
    description: "Emerald haze, soft moss holes, and firefly sparks.",
    background: "from-emerald-950 via-slate-950 to-lime-950",
    hole: "#12351f",
    glow: "rgba(74, 222, 128, 0.55)",
    accent: "#4ade80",
    particle: "#bef264"
  },
  {
    id: "desert",
    label: "Desert",
    description: "Solar heat, sandy pits, and mirage shimmer.",
    background: "from-amber-950 via-stone-950 to-rose-950",
    hole: "#3a2514",
    glow: "rgba(251, 191, 36, 0.52)",
    accent: "#fbbf24",
    particle: "#fed7aa"
  },
  {
    id: "snow",
    label: "Snow",
    description: "Icy glow, frosted tunnels, and crisp blue light.",
    background: "from-sky-950 via-slate-950 to-cyan-950",
    hole: "#163244",
    glow: "rgba(125, 211, 252, 0.58)",
    accent: "#7dd3fc",
    particle: "#e0f2fe"
  },
  {
    id: "space",
    label: "Space",
    description: "Starfields, gravity wells, and violet nebula sparks.",
    background: "from-indigo-950 via-black to-fuchsia-950",
    hole: "#161233",
    glow: "rgba(192, 132, 252, 0.55)",
    accent: "#c084fc",
    particle: "#f0abfc"
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk",
    description: "Neon lanes, chrome holes, and electric city light.",
    background: "from-cyan-950 via-slate-950 to-pink-950",
    hole: "#0b2230",
    glow: "rgba(34, 211, 238, 0.6)",
    accent: "#22d3ee",
    particle: "#fb7185"
  },
  {
    id: "volcano",
    label: "Volcano",
    description: "Molten edges, obsidian craters, and ember bursts.",
    background: "from-red-950 via-zinc-950 to-orange-950",
    hole: "#32110c",
    glow: "rgba(248, 113, 113, 0.58)",
    accent: "#f87171",
    particle: "#fdba74"
  }
];

export function getPlayground(id: string): PlaygroundTheme {
  return PLAYGROUNDS.find((playground) => playground.id === id) ?? PLAYGROUNDS[0];
}
