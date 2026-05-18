// Seedable Mulberry32 PRNG. Lets us replay/save runs deterministically if we want.

export type Rng = () => number;

export function makeRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}

export function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)]!;
}

export function range(rng: Rng, min: number, max: number): number {
  // inclusive both
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function weightedPick<T>(
  rng: Rng,
  items: readonly T[],
  weights: readonly number[],
): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return items[i]!;
  }
  return items[items.length - 1]!;
}

export function chance(rng: Rng, percent: number): boolean {
  return rng() * 100 < percent;
}
