// Town generation + services. Procedural names, curated merchant stock,
// inn/healer/sell logic. Pure functions only.

import { ARMOR } from "../data/armor";
import { ITEMS } from "../data/items";
import { WEAPONS } from "../data/weapons";
import { heal } from "./character";
import { pick, weightedPick, type Rng } from "./rng";
import { tileAt } from "./world";
import type {
  Character,
  Item,
  Merchant,
  StockEntry,
  Town,
  TownSize,
  WorldMap,
} from "./types";

// ─── Name generator ───────────────────────────────────────────────────────
// Word bank evokes the Northern Kingdoms — Slavic / Germanic / Welsh roots.
const NAME_PREFIXES = [
  "Brok", "Vel", "Bren", "Carr", "Drak", "El", "Far", "Gor",
  "Hav", "Jorn", "Karr", "Lor", "Mor", "Nor", "Oss", "Pell",
  "Quel", "Ros", "Sul", "Tar", "Var", "Wend", "Yar", "Zell",
];
const NAME_SUFFIXES = [
  "garde", "hold", "wick", "berg", "stadt", "moor", "ford", "mund",
  "varn", "thorp", "shire", "vik", "burn", "hollow", "grad", "haven",
  "stein", "cairn", "rest", "marsh", "brook",
];
const NAME_STANDALONE = [
  "Vergen", "Brokvar", "Oxenfurt", "Vizima", "Maribor", "Murivel",
  "Loc Muinne", "Kaer Morhen", "Wolven Mire", "Crone's Rest",
  "Drowner's Cross", "Hammerfall", "Old Mill", "Wether's End",
];
const NAME_PREPOSITIONALS = [
  "by the Lake", "on the Hill", "by the Brook", "near the Wood",
  "of the Mire", "at the Crossing", "under the Crag",
];

function generateTownName(rng: Rng, used: Set<string>): string {
  for (let attempt = 0; attempt < 20; attempt++) {
    const r = rng();
    let name: string;
    if (r < 0.25) {
      // standalone
      name = pick(rng, NAME_STANDALONE);
    } else if (r < 0.85) {
      // prefix + suffix
      name = `${pick(rng, NAME_PREFIXES)}${pick(rng, NAME_SUFFIXES)}`;
    } else {
      // prefix + suffix + prepositional
      name = `${pick(rng, NAME_PREFIXES)}${pick(rng, NAME_SUFFIXES)} ${pick(
        rng,
        NAME_PREPOSITIONALS,
      )}`;
    }
    if (!used.has(name)) {
      used.add(name);
      return name;
    }
  }
  // Fallback: just slap a number on it.
  const base = `Outpost ${used.size + 1}`;
  used.add(base);
  return base;
}

// Flavor sentence keyed on surrounding biome character.
function generateBlurb(rng: Rng, size: TownSize, neighborhood: Record<string, number>): string {
  const top = Object.entries(neighborhood).sort((a, b) => b[1] - a[1])[0]?.[0];
  const sizeWord =
    size === "hamlet" ? "a few-dozen-soul hamlet" : size === "village" ? "a small village" : "a sturdy market town";
  const setting =
    top === "forest"
      ? "set against the dark eaves of the wood"
      : top === "mountains"
      ? "huddled below the high cold passes"
      : top === "swamp"
      ? "perched on what dry ground the marshes allow"
      : top === "hills"
      ? "spilled down the slope of a long ridge"
      : top === "river"
      ? "straddling the river's slow brown bend"
      : top === "road"
      ? "strung along the trade road"
      : "open to the sky on a long plain";
  const character = pick(rng, [
    "smoke drifting from a dozen chimneys",
    "the smell of horse and woodsmoke",
    "a chapel bell sounding over the rooftops",
    "drying laundry strung between low timber houses",
    "the bray of livestock somewhere out of sight",
    "shutters closed against the day's heat",
    "a watchman at the gate, eyeing strangers",
  ]);
  return `${capitalize(sizeWord)} ${setting}, ${character}.`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── Merchant stock ───────────────────────────────────────────────────────
// Curated subset per town: 4–7 supply items, 1–2 weapons, 1–2 armor pieces.
const SUPPLY_ITEM_POOL: { id: string; weight: number }[] = [
  { id: "ration", weight: 30 },
  { id: "staleBread", weight: 20 },
  { id: "torch", weight: 25 },
  { id: "whetstone", weight: 12 },
  { id: "medicinalHerbs", weight: 18 },
  { id: "berries", weight: 10 },
  { id: "nuts", weight: 10 },
  { id: "mushrooms", weight: 8 },
];

// Limit weapons/armor available in towns to "common" gear — no witcher gear in shops.
const WEAPON_POOL_BY_SIZE: Record<TownSize, string[]> = {
  hamlet: ["dagger", "quarterstaff", "shortBow"],
  village: ["dagger", "shortSword", "quarterstaff", "shortBow"],
  town: ["dagger", "shortSword", "longSword", "quarterstaff", "shortBow", "rustyAxe"],
};

const ARMOR_POOL_BY_SIZE: Record<TownSize, string[]> = {
  hamlet: ["travelersHood", "travelersBreeches"],
  village: ["travelersHood", "paddedCap", "gambeson", "travelersBreeches", "paddedTrousers"],
  town: [
    "travelersHood", "paddedCap", "ironHelm",
    "gambeson", "leatherCuirass", "brigandine",
    "travelersBreeches", "paddedTrousers", "leatherGreaves",
  ],
};

function pickStockItems(rng: Rng, size: TownSize): StockEntry[] {
  const supplyCount = size === "hamlet" ? 4 : size === "village" ? 5 : 7;
  const picked = new Set<string>();
  const out: StockEntry[] = [];
  while (out.length < supplyCount && picked.size < SUPPLY_ITEM_POOL.length) {
    const choice = weightedPick(
      rng,
      SUPPLY_ITEM_POOL,
      SUPPLY_ITEM_POOL.map((p) => p.weight),
    );
    if (picked.has(choice.id)) continue;
    picked.add(choice.id);
    const def = ITEMS[choice.id];
    if (!def) continue;
    const count =
      size === "town" ? 4 + Math.floor(rng() * 4) :
      size === "village" ? 2 + Math.floor(rng() * 3) :
      1 + Math.floor(rng() * 2);
    out.push({
      kind: "item",
      refId: choice.id,
      price: Math.max(1, Math.round(def.value * 1.2)),
      count,
    });
  }
  return out;
}

function pickStockWeapons(rng: Rng, size: TownSize): StockEntry[] {
  const pool = WEAPON_POOL_BY_SIZE[size];
  const wantCount = size === "town" ? 2 : 1;
  const picked = new Set<string>();
  const out: StockEntry[] = [];
  while (out.length < wantCount && picked.size < pool.length) {
    const id = pick(rng, pool);
    if (picked.has(id)) continue;
    picked.add(id);
    const def = WEAPONS[id];
    if (!def) continue;
    out.push({
      kind: "weapon",
      refId: id,
      price: Math.max(1, Math.round(def.value * 1.2)),
      count: 1,
    });
  }
  return out;
}

function pickStockArmor(rng: Rng, size: TownSize): StockEntry[] {
  const pool = ARMOR_POOL_BY_SIZE[size];
  const wantCount = size === "town" ? 2 : 1;
  const picked = new Set<string>();
  const out: StockEntry[] = [];
  while (out.length < wantCount && picked.size < pool.length) {
    const id = pick(rng, pool);
    if (picked.has(id)) continue;
    picked.add(id);
    const def = ARMOR[id];
    if (!def) continue;
    out.push({
      kind: "armor",
      refId: id,
      price: Math.max(1, Math.round(def.value * 1.2)),
      count: 1,
    });
  }
  return out;
}

export function rollMerchantStock(rng: Rng, size: TownSize, day: number): Merchant {
  return {
    buyMarkup: 1.2,
    sellDiscount: 0.4,
    stock: [
      ...pickStockItems(rng, size),
      ...pickStockWeapons(rng, size),
      ...pickStockArmor(rng, size),
    ],
    lastRestockDay: day,
  };
}

export const RESTOCK_DAYS = 7;

export function maybeRestock(rng: Rng, town: Town, day: number): Town {
  if (day - town.merchant.lastRestockDay < RESTOCK_DAYS) return town;
  return {
    ...town,
    merchant: rollMerchantStock(rng, town.size, day),
  };
}

// ─── Town factory ─────────────────────────────────────────────────────────
function pickSize(rng: Rng): TownSize {
  const r = rng();
  if (r < 0.35) return "hamlet";
  if (r < 0.8) return "village";
  return "town";
}

function neighborhoodBiomes(world: WorldMap, x: number, y: number): Record<string, number> {
  const tally: Record<string, number> = {};
  for (let dy = -3; dy <= 3; dy++) {
    for (let dx = -3; dx <= 3; dx++) {
      const t = tileAt(world, x + dx, y + dy);
      if (!t || t === "town") continue;
      tally[t] = (tally[t] ?? 0) + 1;
    }
  }
  return tally;
}

function nextTownId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `town_${crypto.randomUUID()}`;
  }
  return `town_${Math.random().toString(36).slice(2, 10)}`;
}

export function generateTown(rng: Rng, world: WorldMap, x: number, y: number, usedNames: Set<string>): Town {
  const size = pickSize(rng);
  const name = generateTownName(rng, usedNames);
  const blurb = generateBlurb(rng, size, neighborhoodBiomes(world, x, y));
  const innCost = size === "town" ? 18 : size === "village" ? 10 : 5;
  const healerCost = size === "town" ? 2 : size === "village" ? 3 : 4;
  return {
    id: nextTownId(),
    name,
    size,
    blurb,
    x,
    y,
    innCostPerNight: innCost,
    healerCostPerHp: healerCost,
    merchant: rollMerchantStock(rng, size, 1),
  };
}

// ─── Lookups ──────────────────────────────────────────────────────────────
export function townAt(world: WorldMap, x: number, y: number): Town | undefined {
  return world.towns.find((t) => t.x === x && t.y === y);
}

export function townById(world: WorldMap, id: string): Town | undefined {
  return world.towns.find((t) => t.id === id);
}

// ─── Services: pure functions ─────────────────────────────────────────────
export type StayInnResult = {
  player: Character;
  paid: number;
  hoursSlept: number;
  ok: boolean;
  message: string;
};

export function stayAtInn(player: Character, town: Town): StayInnResult {
  if (player.crowns < town.innCostPerNight) {
    return {
      player,
      paid: 0,
      hoursSlept: 0,
      ok: false,
      message: `You can't afford a bed at the inn (${town.innCostPerNight} crowns).`,
    };
  }
  const restored: Character = {
    ...player,
    crowns: player.crowns - town.innCostPerNight,
    hp: player.hpMax,
    stamina: player.staminaMax,
    hungry: false,
    rested: true,
  };
  return {
    player: restored,
    paid: town.innCostPerNight,
    hoursSlept: 8,
    ok: true,
    message: `You take a hot meal and a bed. Sleep is dreamless.`,
  };
}

export type HealerResult = {
  player: Character;
  paid: number;
  hpHealed: number;
  ok: boolean;
  message: string;
};

export function visitHealer(player: Character, town: Town): HealerResult {
  const needed = player.hpMax - player.hp;
  if (needed <= 0) {
    return {
      player,
      paid: 0,
      hpHealed: 0,
      ok: false,
      message: "The healer looks you over and shrugs. You're fine.",
    };
  }
  const maxAffordable = Math.floor(player.crowns / town.healerCostPerHp);
  if (maxAffordable <= 0) {
    return {
      player,
      paid: 0,
      hpHealed: 0,
      ok: false,
      message: `The healer's price is ${town.healerCostPerHp} crowns per wound. You can't afford it.`,
    };
  }
  const healed = Math.min(needed, maxAffordable);
  const cost = healed * town.healerCostPerHp;
  return {
    player: { ...heal(player, healed), crowns: player.crowns - cost },
    paid: cost,
    hpHealed: healed,
    ok: true,
    message: `The healer mends your wounds. Paid ${cost} crowns.`,
  };
}

// ─── Buying ───────────────────────────────────────────────────────────────
export type BuyResult = {
  player: Character;
  town: Town;
  ok: boolean;
  message: string;
};

export function buyFromStock(player: Character, town: Town, stockIndex: number): BuyResult {
  const entry = town.merchant.stock[stockIndex];
  if (!entry) {
    return { player, town, ok: false, message: "That item is no longer available." };
  }
  if (entry.count <= 0) {
    return { player, town, ok: false, message: "Out of stock." };
  }
  if (player.crowns < entry.price) {
    return { player, town, ok: false, message: "You can't afford that." };
  }

  // Resolve into a real engine object.
  let newPlayer: Character = { ...player, crowns: player.crowns - entry.price };
  if (entry.kind === "item") {
    const def = ITEMS[entry.refId];
    if (!def) return { player, town, ok: false, message: "Missing item definition." };
    newPlayer = { ...newPlayer, inventory: [...newPlayer.inventory, { ...def }] };
  } else if (entry.kind === "weapon") {
    if (newPlayer.ownedWeaponIds.includes(entry.refId)) {
      // refund + bail — don't let players stockpile duplicates of weapons.
      return { player, town, ok: false, message: "You already own one of those." };
    }
    newPlayer = {
      ...newPlayer,
      ownedWeaponIds: [...newPlayer.ownedWeaponIds, entry.refId],
      equippedWeaponId: entry.refId, // auto-equip for now
    };
  } else if (entry.kind === "armor") {
    const def = ARMOR[entry.refId];
    if (!def) return { player, town, ok: false, message: "Missing armor definition." };
    newPlayer = {
      ...newPlayer,
      ownedArmorIds: newPlayer.ownedArmorIds.includes(entry.refId)
        ? newPlayer.ownedArmorIds
        : [...newPlayer.ownedArmorIds, entry.refId],
      equippedArmor: { ...newPlayer.equippedArmor, [def.slot]: def.id }, // auto-equip in slot
    };
  }

  // Decrement stock.
  const newStock = town.merchant.stock.slice();
  newStock[stockIndex] = { ...entry, count: entry.count - 1 };
  const newTown: Town = { ...town, merchant: { ...town.merchant, stock: newStock } };
  return {
    player: newPlayer,
    town: newTown,
    ok: true,
    message: `Bought ${nameOfStock(entry)} for ${entry.price} crowns.`,
  };
}

// ─── Selling (items only for now; weapons/armor selling needs an unequip flow) ──
export type SellResult = {
  player: Character;
  town: Town;
  ok: boolean;
  message: string;
};

export function sellInventoryItem(player: Character, town: Town, invIndex: number): SellResult {
  const item = player.inventory[invIndex];
  if (!item) return { player, town, ok: false, message: "No such item." };
  const price = Math.max(1, Math.round(item.value * town.merchant.sellDiscount));
  const nextInv = player.inventory.slice();
  nextInv.splice(invIndex, 1);
  const newPlayer: Character = {
    ...player,
    inventory: nextInv,
    crowns: player.crowns + price,
  };
  return {
    player: newPlayer,
    town,
    ok: true,
    message: `Sold ${item.name} for ${price} crowns.`,
  };
}

// ─── Display helpers ──────────────────────────────────────────────────────
export function nameOfStock(entry: StockEntry): string {
  if (entry.kind === "item") return ITEMS[entry.refId]?.name ?? entry.refId;
  if (entry.kind === "weapon") return WEAPONS[entry.refId]?.name ?? entry.refId;
  return ARMOR[entry.refId]?.name ?? entry.refId;
}

export function descriptionOfStock(entry: StockEntry): string {
  if (entry.kind === "item") return ITEMS[entry.refId]?.description ?? "";
  if (entry.kind === "weapon") return WEAPONS[entry.refId]?.description ?? "";
  return ARMOR[entry.refId]?.description ?? "";
}

