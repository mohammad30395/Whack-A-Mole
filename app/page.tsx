"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ThreeBackground } from "@/components/background/ThreeBackground";
import { DifficultyScreen } from "@/components/screens/DifficultyScreen";
import { GameOverScreen } from "@/components/screens/GameOverScreen";
import { GameplayScreen } from "@/components/screens/GameplayScreen";
import { LandingScreen } from "@/components/screens/LandingScreen";
import { LeaderboardScreen } from "@/components/screens/LeaderboardScreen";
import { PlaygroundScreen } from "@/components/screens/PlaygroundScreen";
import { RulesScreen } from "@/components/screens/RulesScreen";
import { SetupScreen } from "@/components/screens/SetupScreen";
import { STORAGE_KEYS } from "@/lib/constants";
import type { Difficulty, GameStats, LeaderboardEntry, PlayerProfile, PlaygroundId, Screen, SoundSettings } from "@/types/game";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSound } from "@/hooks/useSound";

const defaultPlayer: PlayerProfile = {
  fullName: "",
  username: "",
  length: 3,
  width: 4,
  objectTheme: "animals",
  objectColor: "random"
};

const defaultSettings: SoundSettings = {
  muted: false,
  volume: 0.6
};

export default function Home() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [player, setPlayer] = useLocalStorage<PlayerProfile>(STORAGE_KEYS.player, defaultPlayer);
  const [settings, setSettings] = useLocalStorage<SoundSettings>(STORAGE_KEYS.settings, defaultSettings);
  const [leaderboard, setLeaderboard] = useLocalStorage<LeaderboardEntry[]>(STORAGE_KEYS.leaderboard, []);
  const [playground, setPlayground] = useState<PlaygroundId>("cyberpunk");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [lastStats, setLastStats] = useState<GameStats | null>(null);
  const sound = useSound(settings);

  const selectedBackground = useMemo(() => {
    if (screen === "playground" || screen === "gameplay" || screen === "gameover") {
      return playground;
    }

    return "cyberpunk";
  }, [playground, screen]);

  const toggleSound = useCallback(() => {
    setSettings((current) => ({ ...current, muted: !current.muted }));
  }, [setSettings]);

  const updateVolume = useCallback(
    (volume: number) => {
      setSettings((current) => ({ ...current, volume }));
    },
    [setSettings]
  );

  const startGameplay = useCallback(
    (nextDifficulty: Difficulty) => {
      setDifficulty(nextDifficulty);
      sound.play("start");
      sound.startMusic();
      setScreen("gameplay");
    },
    [sound]
  );

  const handleGameOver = useCallback(
    (stats: GameStats) => {
      sound.stopMusic();
      sound.play("gameover");
      setLastStats(stats);
      setLeaderboard((current) => [
        {
          ...stats,
          id: crypto.randomUUID(),
          playerName: player.fullName.trim(),
          username: player.username.trim(),
          createdAt: new Date().toISOString()
        },
        ...current
      ]);
      setScreen("gameover");
    },
    [player.fullName, player.username, setLeaderboard, sound]
  );

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "m" || event.key === "M") {
        toggleSound();
      }

      if (event.key === "Escape" && screen !== "landing") {
        sound.stopMusic();
        setScreen("landing");
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [screen, sound, toggleSound]);

  useEffect(() => {
    if (settings.muted) {
      sound.stopMusic();
    }
  }, [settings.muted, sound]);

  const content = (() => {
    switch (screen) {
      case "landing":
        return (
          <LandingScreen
            key="landing"
            settings={settings}
            onStart={() => setScreen("setup")}
            onRules={() => setScreen("rules")}
            onLeaderboard={() => setScreen("leaderboard")}
            onToggleSound={toggleSound}
          />
        );
      case "rules":
        return <RulesScreen key="rules" onBack={() => setScreen("landing")} onStart={() => setScreen("setup")} />;
      case "setup":
        return (
          <SetupScreen
            key="setup"
            initialProfile={player}
            onBack={() => setScreen("landing")}
            onSubmit={(profile) => {
              setPlayer(profile);
              setScreen("playground");
            }}
          />
        );
      case "playground":
        return (
          <PlaygroundScreen
            key="playground"
            selected={playground}
            onBack={() => setScreen("setup")}
            onSelect={(id) => {
              setPlayground(id);
              setScreen("difficulty");
            }}
          />
        );
      case "difficulty":
        return <DifficultyScreen key="difficulty" onBack={() => setScreen("playground")} onSelect={startGameplay} />;
      case "gameplay":
        return (
          <GameplayScreen
            key="gameplay"
            player={player}
            difficulty={difficulty}
            playground={playground}
            soundSettings={settings}
            onToggleSound={toggleSound}
            onVolumeChange={updateVolume}
            onRestartSound={sound.play}
            onBackToMenu={() => {
              sound.stopMusic();
              setScreen("landing");
            }}
            onGameOver={handleGameOver}
          />
        );
      case "gameover":
        return lastStats ? (
          <GameOverScreen
            key="gameover"
            stats={lastStats}
            onPlayAgain={() => startGameplay(difficulty)}
            onChangeDifficulty={() => setScreen("difficulty")}
            onMainMenu={() => setScreen("landing")}
            onLeaderboard={() => setScreen("leaderboard")}
          />
        ) : null;
      case "leaderboard":
        return (
          <LeaderboardScreen
            key="leaderboard"
            entries={leaderboard}
            onBack={() => setScreen("landing")}
            onClear={() => setLeaderboard([])}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <>
      <ThreeBackground playground={selectedBackground} />
      <AnimatePresence mode="wait">{content}</AnimatePresence>
    </>
  );
}
