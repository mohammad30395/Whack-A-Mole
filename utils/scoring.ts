export function calculateAccuracy(hits: number, misses: number): number {
  const total = hits + misses;
  if (total === 0) {
    return 100;
  }

  return Math.max(0, Math.min(100, (hits / total) * 100));
}

export function calculateHitScore(baseMultiplier: number, combo: number, elapsedSeconds: number): number {
  const comboBonus = 1 + Math.min(combo, 25) * 0.045;
  const paceBonus = 1 + Math.min(elapsedSeconds / 60, 1) * 0.35;
  return Math.round(100 * baseMultiplier * comboBonus * paceBonus);
}
