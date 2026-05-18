// Witcher-inspired exploding d10.
// - On a roll of 10, you re-roll and add the next die (no second explosion in our variant — keeps things bounded).
// - On a roll of 1, you re-roll and SUBTRACT the next die (a "fumble" cascade).
// - All other results return as-is.
//
// We expose normalSample for jStat-replaced gaussian utility.

import type { Rng } from "./rng";

export type DiceRoll = {
  total: number;
  rolls: number[];
  exploded: boolean;
  fumbled: boolean;
};

export function rollD10(rng: Rng): DiceRoll {
  const first = Math.floor(rng() * 10) + 1;
  const rolls = [first];
  if (first === 10) {
    const bonus = Math.floor(rng() * 10) + 1;
    rolls.push(bonus);
    return { total: first + bonus, rolls, exploded: true, fumbled: false };
  }
  if (first === 1) {
    const penalty = Math.floor(rng() * 10) + 1;
    rolls.push(penalty);
    return { total: first - penalty, rolls, exploded: false, fumbled: true };
  }
  return { total: first, rolls, exploded: false, fumbled: false };
}

export function rollD10Flat(rng: Rng): number {
  // For things like hit-location tables where exploding makes no sense.
  return Math.floor(rng() * 10) + 1;
}

export function rollD6(rng: Rng): number {
  return Math.floor(rng() * 6) + 1;
}

// Roll a damage expression like 2d6+2 -> { count: 2, sides: 6, bonus: 2 }
export type DamageDice = { count: number; sides: number; bonus: number };

export function rollDamage(rng: Rng, dice: DamageDice): number {
  let total = dice.bonus;
  for (let i = 0; i < dice.count; i++) {
    total += Math.floor(rng() * dice.sides) + 1;
  }
  return total;
}

// Box-Muller for a normal distribution (replaces jStat).
export function normalSample(rng: Rng, mu: number, sigma: number): number {
  const u1 = Math.max(rng(), 1e-9);
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mu + z * sigma;
}
