# Whack-a-Mole Arcade

A polished browser-based Whack-a-Mole game built with Next.js, React, Phaser, Three.js, and Tailwind CSS. The project combines a responsive arcade UI, animated 3D-style background, customizable gameplay settings, sound controls, and a local leaderboard.

## Overview

Whack-a-Mole Arcade is a single-player reflex game where players hit pop-up targets before they disappear. The game supports configurable board sizes, object themes, object colors, playground environments, and difficulty levels. Scores are calculated from hits, combo streaks, elapsed time, and difficulty multipliers.

The app is designed to run entirely in the browser. Player settings, sound preferences, and leaderboard results are stored locally with `localStorage`.

## Features

- Responsive single-screen gameplay for desktop and mobile
- Phaser-powered game board with animated targets and hit effects
- Three.js animated background that changes with the selected playground
- Player setup with name, username, board length, board width, object theme, and color
- Multiple playground themes: Forest, Desert, Snow, Space, Cyberpunk, and Volcano
- Three difficulty levels: Easy, Medium, and Hard
- 60-second timed runs with a 10-miss limit
- Cactus trap targets that end the game instantly
- Combo-based scoring and live accuracy tracking
- Pause, restart, menu, mute, and volume controls
- Keyboard shortcuts for sound toggle and returning to the main menu
- Local leaderboard with stored game history

## Tech Stack

- **Framework:** Next.js
- **UI:** React, Tailwind CSS
- **Game engine:** Phaser
- **Background visuals:** Three.js
- **Animation:** Framer Motion
- **Language:** TypeScript
- **Linting:** ESLint

## Getting Started

### Prerequisites

Install Node.js and npm before running the project.

Recommended:

- Node.js 18 or newer
- npm 9 or newer

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
```

Starts the Next.js development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Runs the production build. Use this after `npm run build`.

```bash
npm run lint
```

Runs ESLint across the project.

## How to Play

1. Start from the landing screen.
2. Enter player details and choose the board size, target theme, and target color.
3. Select a playground environment.
4. Choose a difficulty level.
5. Hit normal pop-up targets to score points.
6. Avoid cactus targets. Hitting one ends the run immediately.
7. Keep misses below 10 and score as much as possible before the 60-second timer ends.

### Controls

- **Mouse / touch:** Click or tap targets.
- **Pause:** Use the in-game Pause button.
- **Restart:** Use the in-game Restart button.
- **Sound:** Use the Sound button or press `M`.
- **Main menu:** Use the Menu button or press `Escape`.
- **Volume:** Adjust the in-game volume slider.

## Gameplay Rules

- A normal missed target adds one miss.
- 10 missed normal targets ends the game.
- A cactus target ends the game immediately when clicked.
- Consecutive hits increase the combo counter.
- Higher combos increase score per hit.
- Harder difficulties spawn targets faster, add more active targets, increase cactus pressure, and award higher score multipliers.
- Accuracy is calculated from successful hits compared with misses.

## Project Structure

```text
.
|-- app/                    # Next.js app entry, layout, and global styles
|-- components/
|   |-- background/          # Three.js animated background
|   |-- game/                # React wrapper for the Phaser game
|   |-- screens/             # Landing, setup, gameplay, rules, leaderboard, and game-over screens
|   `-- ui/                  # Shared UI components
|-- game/                    # Phaser scene and gameplay loop
|-- hooks/                   # Reusable React hooks for sound, storage, and viewport handling
|-- lib/                     # Game constants and playground definitions
|-- types/                   # Shared TypeScript types
`-- utils/                   # Scoring, formatting, randomization, storage, and validation helpers
```

## Key Files

- `app/page.tsx` controls the main screen flow and local state.
- `components/game/PhaserGame.tsx` mounts and manages the Phaser instance inside React.
- `game/WhackScene.ts` contains the main game loop, spawning, scoring, misses, and game-over behavior.
- `lib/constants.ts` defines difficulty settings, game duration, miss limit, object themes, and colors.
- `lib/playgrounds.ts` defines the available playground environments.
- `hooks/useSound.ts` manages game sounds, music, mute state, and volume.

## Data Storage

The project stores the following browser-local data:

- Player profile
- Sound settings
- Leaderboard entries

This data is saved in `localStorage`, so it stays on the same browser and device until cleared.

## Notes

- This is a private Next.js project configured in `package.json`.
- The Phaser game is dynamically imported with server-side rendering disabled because it depends on browser APIs.
- No backend service is required for gameplay or leaderboard storage.
