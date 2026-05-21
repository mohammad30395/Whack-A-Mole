"use client";

import { useCallback, useEffect, useRef } from "react";
import type { SoundSettings } from "@/types/game";

type SoundName = "hover" | "hit" | "combo" | "gameover" | "start";
type BrowserWindowWithAudio = Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };

export function useSound(settings: SoundSettings) {
  const contextRef = useRef<AudioContext | null>(null);
  const musicRef = useRef<{ oscillator: OscillatorNode; gain: GainNode } | null>(null);

  const getContext = useCallback(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const browserWindow = window as BrowserWindowWithAudio;
    const AudioCtor = browserWindow.AudioContext || browserWindow.webkitAudioContext;
    if (!AudioCtor) {
      return null;
    }

    if (!contextRef.current) {
      contextRef.current = new AudioCtor();
    }

    return contextRef.current;
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (settings.muted) {
        return;
      }

      const context = getContext();
      if (!context) {
        return;
      }

      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const profiles: Record<SoundName, [number, number, OscillatorType]> = {
        hover: [420, 0.04, "sine"],
        hit: [740, 0.08, "triangle"],
        combo: [980, 0.13, "sawtooth"],
        gameover: [115, 0.42, "square"],
        start: [520, 0.18, "triangle"]
      };
      const [frequency, duration, type] = profiles[name];

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, now);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(50, frequency * 0.55), now + duration);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, settings.volume * 0.16), now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.02);
    },
    [getContext, settings.muted, settings.volume]
  );

  const startMusic = useCallback(() => {
    if (settings.muted || musicRef.current) {
      return;
    }

    const context = getContext();
    if (!context) {
      return;
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 86;
    gain.gain.value = settings.volume * 0.035;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    musicRef.current = { oscillator, gain };
  }, [getContext, settings.muted, settings.volume]);

  const stopMusic = useCallback(() => {
    if (!musicRef.current) {
      return;
    }

    musicRef.current.oscillator.stop();
    musicRef.current.oscillator.disconnect();
    musicRef.current.gain.disconnect();
    musicRef.current = null;
  }, []);

  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.gain.gain.value = settings.muted ? 0 : settings.volume * 0.035;
    }
  }, [settings.muted, settings.volume]);

  useEffect(() => stopMusic, [stopMusic]);

  return { play, startMusic, stopMusic };
}
