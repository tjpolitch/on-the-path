import type { BiomeKey, BiomeDef, Town, WorldMap } from "./types";
import type { Rng } from "./rng";
import { generateTown } from "./towns";

// ─── Biome data ───────────────────────────────────────────────────────────
export const BIOMES: Record<BiomeKey, BiomeDef> = {
  forest: {
    key: "forest",
    label: "Forest",
    glyph: "♣",
    color: "#3b6a3b",
    passable: true,
    travelMinutes: 75,
    encounterChance: 0.18,
    forageDifficulty: 10,
  },
  plains: {
    key: "plains",
    label: "Plains",
    glyph: "·",
    color: "#9ca456",
    passable: true,
    travelMinutes: 50,
    encounterChance: 0.1,
    forageDifficulty: 12,
  },
  hills: {
    key: "hills",
    label: "Hills",
    glyph: "∩",
    color: "#8a7848",
    passable: true,
    travelMinutes: 80,
    encounterChance: 0.12,
    forageDifficulty: 13,
  },
  mountains: {
    key: "mountains",
    label: "Mountains",
    glyph: "▲",
    color: "#6b5e50",
    passable: true,
    travelMinutes: 150,
    encounterChance: 0.08,
    forageDifficulty: 16,
  },
  swamp: {
    key: "swamp",
    label: "Swamp",
    glyph: "≈",
    color: "#4a5538",
    passable: true,
    travelMinutes: 110,
    encounterChance: 0.22,
    forageDifficulty: 14,
  },
  river: {
    key: "river",
    label: "River",
    glyph: "~",
    color: "#3a6e8a",
    passable: false, // need a crossing — for now, impassable
    travelMinutes: 0,
    encounterChance: 0,
    forageDifficulty: 99,
  },
  road: {
    key: "road",
    label: "Road",
    glyph: "=",
    color: "#b89a72",
    passable: true,
    travelMinutes: 40,
    encounterChance: 0.06,
    forageDifficulty: 99,
  },
  town: {
    key: "town",
    label: "Town",
    glyph: "▣",
    color: "#c97f3a",
    passable: true,
    travelMinutes: 30,
    encounterChance: 0,
    forageDifficulty: 99,
  },
};

// ─── Map generation ───────────────────────────────────────────────────────
// We use value-noise via a coarse grid + bilinear interp to make biome blobs,
// then layer roads/towns/rivers as a few hand-placed features.

function makeValueNoise(rng: Rng, w: number, h: number, scale: number): number[][] {
  const cw = Math.ceil(w / scale) + 1;
  const ch = Math.ceil(h / scale) + 1;
  const coarse: number[][] = [];
  for (let y = 0; y < ch; y++) {
    const row: number[] = [];
    for (let x = 0; x < cw; x++) row.push(rng());
    coarse.push(row);
  }
  const grid: number[][] = [];
  for (let y = 0; y < h; y++) {
    const row: number[] = [];
    for (let x = 0; x < w; x++) {
      const fx = x / scale;
      const fy = y / scale;
      const x0 = Math.floor(fx);
      const y0 = Math.floor(fy);
      const tx = fx - x0;
      const ty = fy - y0;
      const v00 = coarse[y0]![x0]!;
      const v10 = coarse[y0]![x0 + 1]!;
      const v01 = coarse[y0 + 1]![x0]!;
      const v11 = coarse[y0 + 1]![x0 + 1]!;
      const a = v00 * (1 - tx) + v10 * tx;
      const b = v01 * (1 - tx) + v11 * tx;
      row.push(a * (1 - ty) + b * ty);
    }
    grid.push(row);
  }
  return grid;
}

export type GenWorldOpts = {
  width?: number;
  height?: number;
  townCount?: number;
};

export function generateWorld(rng: Rng, opts: GenWorldOpts = {}): WorldMap {
  const width = opts.width ?? 40;
  const height = opts.height ?? 40;
  const townCount = opts.townCount ?? 4;

  // Two layered noise fields: elevation + moisture.
  const elev = makeValueNoise(rng, width, height, 6);
  const moist = makeValueNoise(rng, width, height, 8);

  // Octave 2 for elevation (rougher detail).
  const elev2 = makeValueNoise(rng, width, height, 3);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      elev[y]![x] = elev[y]![x]! * 0.7 + elev2[y]![x]! * 0.3;
    }
  }

  const tiles: BiomeKey[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const e = elev[y]![x]!;
      const m = moist[y]![x]!;
      let biome: BiomeKey;
      if (e > 0.78) biome = "mountains";
      else if (e > 0.62) biome = "hills";
      else if (m > 0.72) biome = "swamp";
      else if (m > 0.42) biome = "forest";
      else biome = "plains";
      tiles.push(biome);
    }
  }

  // Carve a winding river from a random north tile down to a random south tile.
  carveRiver(rng, tiles, width, height);

  // Place towns on plains/hills, far from edges, spaced out.
  const placedTowns: { x: number; y: number }[] = [];
  let attempts = 0;
  while (placedTowns.length < townCount && attempts < 500) {
    attempts++;
    const x = Math.floor(rng() * (width - 6)) + 3;
    const y = Math.floor(rng() * (height - 6)) + 3;
    const i = y * width + x;
    if (tiles[i] === "plains" || tiles[i] === "hills") {
      const tooClose = placedTowns.some((p) => Math.hypot(p.x - x, p.y - y) < 8);
      if (!tooClose) {
        tiles[i] = "town";
        placedTowns.push({ x, y });
      }
    }
  }

  // Carve roads between towns (greedy L-shaped paths). Roads override forest/plains/hills, not mountains/river.
  for (let i = 0; i < placedTowns.length - 1; i++) {
    const a = placedTowns[i]!;
    const b = placedTowns[i + 1]!;
    carveRoad(tiles, width, a, b);
  }

  // Build full Town records (names, blurbs, merchant stock) for each town tile.
  const partialMap: WorldMap = { width, height, tiles, towns: [] };
  const usedNames = new Set<string>();
  const towns: Town[] = placedTowns.map((p) =>
    generateTown(rng, partialMap, p.x, p.y, usedNames),
  );
  return { width, height, tiles, towns };
}

function carveRiver(rng: Rng, tiles: BiomeKey[], w: number, h: number) {
  let x = Math.floor(rng() * w);
  let y = 0;
  const targetX = Math.floor(rng() * w);
  while (y < h - 1) {
    const i = y * w + x;
    tiles[i] = "river";
    // gravitate toward targetX as we descend
    const dx = Math.sign(targetX - x);
    const r = rng();
    if (r < 0.55) y++;
    else if (dx !== 0 && r < 0.85) x += dx;
    else x += rng() < 0.5 ? -1 : 1;
    x = Math.max(0, Math.min(w - 1, x));
  }
}

function carveRoad(
  tiles: BiomeKey[],
  w: number,
  a: { x: number; y: number },
  b: { x: number; y: number },
) {
  let { x, y } = a;
  while (x !== b.x) {
    const i = y * w + x;
    if (
      tiles[i] !== "town" &&
      tiles[i] !== "mountains" &&
      tiles[i] !== "river"
    ) {
      tiles[i] = "road";
    }
    x += Math.sign(b.x - x);
  }
  while (y !== b.y) {
    const i = y * w + x;
    if (
      tiles[i] !== "town" &&
      tiles[i] !== "mountains" &&
      tiles[i] !== "river"
    ) {
      tiles[i] = "road";
    }
    y += Math.sign(b.y - y);
  }
}

// ─── Accessors ────────────────────────────────────────────────────────────
export function tileAt(world: WorldMap, x: number, y: number): BiomeKey | null {
  if (x < 0 || y < 0 || x >= world.width || y >= world.height) return null;
  return world.tiles[y * world.width + x] ?? null;
}

export function isPassable(world: WorldMap, x: number, y: number): boolean {
  const t = tileAt(world, x, y);
  if (!t) return false;
  return BIOMES[t].passable;
}

// Find a sensible starting tile near the first town (or, if no towns, the center).
export function findStartTile(world: WorldMap): { x: number; y: number } {
  for (let y = 0; y < world.height; y++) {
    for (let x = 0; x < world.width; x++) {
      if (tileAt(world, x, y) === "town") return { x, y };
    }
  }
  return { x: Math.floor(world.width / 2), y: Math.floor(world.height / 2) };
}
