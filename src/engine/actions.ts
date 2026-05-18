// High-level player actions (travel, forage, rest, eat). Each takes the relevant
// pieces of state plus an RNG and returns the new pieces. UI/store stitches them together.

import { ENEMIES, enemiesForBiome } from "../data/enemies";
import { FORAGE_POOL, ITEMS } from "../data/items";
import {
  consumeFirstEdible,
  heal,
  restoreStamina,
  spendStamina,
} from "./character";
import { rollD10 } from "./dice";
import { chance, type Rng, weightedPick } from "./rng";
import { advanceClock, generateTempC, lightLevel } from "./time";
import { rollWeather } from "./weather";
import {
  BIOMES,
  isPassable,
  tileAt,
} from "./world";
import type {
  Character,
  EnemyInstance,
  Item,
  SkillKey,
  StatKey,
  WorldClock,
  WorldMap,
} from "./types";
import { spawnEnemyInstance } from "./combat";

// ─── Skill check ─────────────────────────────────────────────────────────
// Standard difficulty class roll: 1d10! + skill + stat vs DC.
export function skillCheck(
  rng: Rng,
  c: Character,
  skill: SkillKey,
  stat: StatKey,
  dc: number,
): { passed: boolean; margin: number } {
  const r = rollD10(rng);
  const total = c.skills[skill] + c.stats[stat] + r.total;
  return { passed: total >= dc, margin: total - dc };
}

// ─── Time/clock advancement with weather ─────────────────────────────────
export function tickClock(
  rng: Rng,
  clock: WorldClock,
  minutes: number,
): WorldClock {
  const prevDay = clock.day;
  const next = advanceClock(clock, minutes);
  // Re-roll weather every ~6h, or always at day change.
  const crossedDay = next.day !== prevDay;
  const crossedBlock = Math.floor(clock.minutes / 360) !== Math.floor(next.minutes / 360);
  if (crossedDay || crossedBlock) {
    next.weather = rollWeather(rng, clock.weather, next.month);
  }
  next.tempC = generateTempC(rng, next.month, next.minutes);
  return next;
}

// ─── Hunger / fatigue ─────────────────────────────────────────────────────
// We apply hunger and starvation effects when time passes.
const MINUTES_TO_HUNGRY = 14 * 60; // 14 hours since last meal -> hungry
const MINUTES_BETWEEN_STARVE_TICKS = 4 * 60;

export type TimeAdvanceEffects = {
  player: Character;
  becameHungry: boolean;
  starveDamage: number;
};

export function applyTimePassageOnPlayer(
  player: Character,
  minutesPassed: number,
  minutesSinceMeal: number,
): TimeAdvanceEffects {
  let p = player;
  let becameHungry = false;
  let starve = 0;
  // Become hungry if we just crossed the threshold.
  if (!p.hungry && minutesSinceMeal >= MINUTES_TO_HUNGRY) {
    p = { ...p, hungry: true };
    becameHungry = true;
  }
  // Starve if hungry & exhausted & lots of time passes.
  if (p.hungry && p.stamina <= 5) {
    const ticks = Math.floor(minutesPassed / MINUTES_BETWEEN_STARVE_TICKS);
    if (ticks > 0) {
      starve = ticks * 3;
      p = { ...p, hp: Math.max(0, p.hp - starve) };
    }
  }
  // Slow stamina drain just for being alive on the road.
  const drain = Math.floor(minutesPassed / 30);
  if (drain > 0) p = spendStamina(p, drain);
  return { player: p, becameHungry, starveDamage: starve };
}

// ─── Travel ───────────────────────────────────────────────────────────────
export type Direction = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW" | "O";

const DIR_DELTAS: Record<Direction, { dx: number; dy: number }> = {
  N: { dx: 0, dy: -1 },
  NE: { dx: 1, dy: -1 },
  E: { dx: 1, dy: 0 },
  SE: { dx: 1, dy: 1 },
  S: { dx: 0, dy: 1 },
  SW: { dx: -1, dy: 1 },
  W: { dx: -1, dy: 0 },
  NW: { dx: -1, dy: -1 },
  O: { dx: 0, dy: 0 },
};

export type TravelResult = {
  ok: boolean;
  pos: { x: number; y: number };
  minutesSpent: number;
  encounter?: EnemyInstance;
  blockedReason?: string;
  narration: string;
};

export function travel(
  rng: Rng,
  world: WorldMap,
  pos: { x: number; y: number },
  dir: Direction,
): TravelResult {
  if (dir === "O") {
    // "stay" — pass an hour, mild stamina drain.
    return {
      ok: true,
      pos,
      minutesSpent: 60,
      narration: "You linger an hour to take stock of your surroundings.",
    };
  }
  const d = DIR_DELTAS[dir];
  const tx = pos.x + d.dx;
  const ty = pos.y + d.dy;
  const target = tileAt(world, tx, ty);
  if (target == null) {
    return {
      ok: false,
      pos,
      minutesSpent: 0,
      blockedReason: "edge",
      narration: "The land falls away — the road ends here.",
    };
  }
  if (!isPassable(world, tx, ty)) {
    return {
      ok: false,
      pos,
      minutesSpent: 0,
      blockedReason: "impassable",
      narration: `${BIOMES[target].label} bars your path.`,
    };
  }
  // Time spent is the avg for the new tile, jittered.
  const base = BIOMES[target].travelMinutes;
  const minutes = Math.max(10, Math.round(base * (0.8 + rng() * 0.5)));

  // Roll for encounter on the new tile.
  let encounter: EnemyInstance | undefined;
  if (chance(rng, BIOMES[target].encounterChance * 100)) {
    const pool = enemiesForBiome(target);
    if (pool.length > 0) {
      const tmpl = weightedPick(
        rng,
        pool,
        pool.map((e) => threatWeight(e.threat)),
      );
      encounter = spawnEnemyInstance(tmpl);
    }
  }

  const narration =
    target === "town"
      ? "You enter a town. Smoke from chimneys; voices in the street."
      : target === "road"
      ? "You make good time along the road."
      : `You move into ${BIOMES[target].label.toLowerCase()}.`;

  return {
    ok: true,
    pos: { x: tx, y: ty },
    minutesSpent: minutes,
    encounter: encounter ?? undefined,
    narration,
  };
}

function threatWeight(t: import("./types").EnemyTemplate["threat"]): number {
  switch (t) {
    case "trivial":
      return 5;
    case "easy":
      return 4;
    case "average":
      return 3;
    case "hard":
      return 1;
    case "deadly":
      return 0.5;
  }
}

// ─── Forage ───────────────────────────────────────────────────────────────
export type ForageResult = {
  player: Character;
  minutesSpent: number;
  found: Item[];
  passed: boolean;
  narration: string;
};

export function forage(
  rng: Rng,
  player: Character,
  world: WorldMap,
  pos: { x: number; y: number },
): ForageResult {
  const t = tileAt(world, pos.x, pos.y);
  const dc = t ? BIOMES[t].forageDifficulty : 99;
  if (!t || dc >= 99) {
    return {
      player,
      minutesSpent: 30,
      found: [],
      passed: false,
      narration: "There's nothing here worth foraging.",
    };
  }
  const result = skillCheck(rng, player, "wilderness", "int", dc);
  if (!result.passed) {
    return {
      player: spendStamina(player, 2),
      minutesSpent: 60,
      found: [],
      passed: false,
      narration: "An hour's search and nothing useful turns up.",
    };
  }
  // Successful: 1–3 items, weighted by forageWeight.
  const itemPool = FORAGE_POOL.map((id) => ITEMS[id]!).filter(Boolean);
  const itemsFound: Item[] = [];
  const count = 1 + Math.floor(rng() * 2) + (result.margin > 5 ? 1 : 0);
  for (let i = 0; i < count; i++) {
    const def = weightedPick(
      rng,
      itemPool,
      itemPool.map((it) => it.forageWeight ?? 5),
    );
    itemsFound.push({ ...def });
  }
  const minutes = 30 + Math.floor(rng() * 50);
  return {
    player: {
      ...spendStamina(player, 2),
      inventory: [...player.inventory, ...itemsFound],
    },
    minutesSpent: minutes,
    found: itemsFound,
    passed: true,
    narration: `You find ${itemsFound.map((i) => i.name).join(", ")}.`,
  };
}

// ─── Rest ─────────────────────────────────────────────────────────────────
export type RestResult = {
  player: Character;
  minutesSpent: number;
  narration: string;
};

export function rest(
  rng: Rng,
  player: Character,
  hours: number = 1,
): RestResult {
  // Each hour: +~25% stamina, +1 HP if not hungry.
  const minutes = hours * 60;
  let p = restoreStamina(player, Math.round(player.staminaMax * 0.25 * hours));
  if (!player.hungry) {
    p = heal(p, 1 * hours);
  }
  // Mark rested only after a long rest.
  if (hours >= 6) p = { ...p, rested: true };
  return {
    player: p,
    minutesSpent: minutes,
    narration:
      hours >= 6
        ? "You set up camp and sleep. Dawn finds you rested."
        : `You take a break and catch your breath for ${hours} hour${hours > 1 ? "s" : ""}.`,
  };
}

// ─── Eat ──────────────────────────────────────────────────────────────────
export function eat(player: Character): {
  player: Character;
  consumed?: Item;
  narration: string;
} {
  const out = consumeFirstEdible(player);
  if (!out.consumed) {
    return { player: out.character, narration: "You have nothing edible." };
  }
  return {
    player: out.character,
    consumed: out.consumed,
    narration: `You eat the ${out.consumed.name.toLowerCase()}.`,
  };
}

// Ref export for use elsewhere if needed.
export { ENEMIES };
