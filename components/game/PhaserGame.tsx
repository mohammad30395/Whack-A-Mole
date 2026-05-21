"use client";

import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { WhackScene } from "@/game/WhackScene";
import type { Difficulty, GameStats, ObjectColor, ObjectTheme, PlaygroundId, RuntimeGameUpdate } from "@/types/game";

interface PhaserGameProps {
  rows: number;
  cols: number;
  difficulty: Difficulty;
  playground: PlaygroundId;
  objectTheme: ObjectTheme;
  objectColor: ObjectColor;
  paused: boolean;
  restartKey: number;
  onUpdate: (update: RuntimeGameUpdate) => void;
  onGameOver: (stats: GameStats) => void;
  onSound: (sound: "hit" | "combo" | "gameover") => void;
}

export function PhaserGame({
  rows,
  cols,
  difficulty,
  playground,
  objectTheme,
  objectColor,
  paused,
  restartKey,
  onUpdate,
  onGameOver,
  onSound
}: PhaserGameProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    const scene = new WhackScene({
      rows,
      cols,
      difficulty,
      playground,
      objectTheme,
      objectColor,
      onUpdate,
      onGameOver,
      onSound
    });

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      parent: host,
      transparent: true,
      width: host.clientWidth,
      height: host.clientHeight,
      scene,
      scale: {
        mode: Phaser.Scale.RESIZE,
        parent: host,
        width: "100%",
        height: "100%"
      },
      input: {
        activePointers: 3
      },
      render: {
        antialias: true,
        pixelArt: false
      }
    });

    const resizeObserver = new ResizeObserver(() => {
      if (gameRef.current && host.clientWidth > 0 && host.clientHeight > 0) {
        gameRef.current.scale.resize(host.clientWidth, host.clientHeight);
      }
    });
    resizeObserver.observe(host);

    return () => {
      resizeObserver.disconnect();
      gameRef.current?.destroy(true);
      gameRef.current = null;
      host.replaceChildren();
    };
  }, [cols, difficulty, objectColor, objectTheme, onGameOver, onSound, onUpdate, playground, restartKey, rows]);

  useEffect(() => {
    const scene = gameRef.current?.scene.getScene("WhackScene");
    if (!scene) {
      return;
    }

    if (paused) {
      scene.scene.pause();
    } else {
      scene.scene.resume();
    }
  }, [paused]);

  return <div ref={hostRef} className="h-full w-full overflow-hidden rounded-xl" />;
}
