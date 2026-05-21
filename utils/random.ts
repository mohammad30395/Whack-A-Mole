export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function sampleUnique<T>(items: T[], count: number, recent: T[] = []): T[] {
  const recentSet = new Set(recent);
  const preferred = items.filter((item) => !recentSet.has(item));
  const pool = preferred.length >= count ? preferred : items;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
