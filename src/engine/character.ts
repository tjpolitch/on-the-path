import { ARMOR } from "../data/armor";
import { CLASSES } from "../data/classes";
import { itemById } from "../data/items";
import type {
  CharClassKey,
  Character,
  Item,
  SkillKey,
  Skills,
  StatKey,
  Stats,
} from "./types";
import { STAT_KEYS, SKILL_KEYS } from "./types";

// ─── Stat rolling ─────────────────────────────────────────────────────────
// Witcher-style: roll 4d10 keep 3 (sort high) per stat? Too swingy.
// We use point-buy with a budget so the player can shape their build.
export const POINT_BUY_BUDGET = 30;
export const STAT_MIN = 3;
export const STAT_MAX = 9;

export function defaultStats(): Stats {
  const s = {} as Stats;
  STAT_KEYS.forEach((k) => (s[k] = STAT_MIN));
  return s;
}

export function totalStatPoints(stats: Stats): number {
  return STAT_KEYS.reduce((sum, k) => sum + (stats[k] - STAT_MIN), 0);
}

export function pointsRemaining(stats: Stats): number {
  return POINT_BUY_BUDGET - totalStatPoints(stats);
}

export function defaultSkills(): Skills {
  const s = {} as Skills;
  SKILL_KEYS.forEach((k) => (s[k] = 0));
  return s;
}

// ─── Derived ──────────────────────────────────────────────────────────────
export function deriveHpMax(stats: Stats): number {
  // Half-body + 5 * will, classic-ish.
  return 20 + stats.body * 3 + stats.wil;
}

export function deriveStaminaMax(stats: Stats): number {
  return 40 + stats.body * 4 + stats.wil * 2;
}

export function deriveEncumbrance(stats: Stats): number {
  return 10 + stats.body * 5;
}

// ─── Char creation ────────────────────────────────────────────────────────
export type CreationDraft = {
  name: string;
  classKey: CharClassKey;
  baseStats: Stats; // before class bonus
};

export function newCreationDraft(): CreationDraft {
  return {
    name: "Hendrik",
    classKey: "witcher",
    baseStats: defaultStats(),
  };
}

export function finalStats(draft: CreationDraft): Stats {
  const cls = CLASSES[draft.classKey];
  const out: Stats = { ...draft.baseStats };
  for (const k of STAT_KEYS) {
    out[k] = out[k] + (cls.statBonus[k] ?? 0);
  }
  return out;
}

export function finalSkills(draft: CreationDraft): Skills {
  const cls = CLASSES[draft.classKey];
  const out = defaultSkills();
  for (const k of SKILL_KEYS) {
    out[k] = out[k] + (cls.skillBonus[k] ?? 0);
  }
  return out;
}

export function buildCharacter(draft: CreationDraft): Character {
  const cls = CLASSES[draft.classKey];
  const stats = finalStats(draft);
  const skills = finalSkills(draft);
  const hpMax = deriveHpMax(stats);
  const staminaMax = deriveStaminaMax(stats);

  const inventory: Item[] = [];
  for (const id of cls.startingItemIds) {
    const def = itemById(id);
    if (def) inventory.push({ ...def });
  }

  return {
    id: cryptoId(),
    name: draft.name.trim() || "Unnamed",
    classKey: draft.classKey,
    stats,
    skills,
    hp: hpMax,
    hpMax,
    stamina: staminaMax,
    staminaMax,
    xp: 0,
    crowns: cls.startingCrowns,
    hungry: false,
    rested: true,
    inventory,
    equippedWeaponId: cls.startingWeaponId,
    ownedWeaponIds: cls.startingWeaponId ? [cls.startingWeaponId] : [],
    equippedArmor: armorMapFromList(cls.startingArmorIds ?? []),
    ownedArmorIds: [...(cls.startingArmorIds ?? [])],
    reputation: 0,
  };
}

function armorMapFromList(ids: string[]): Character["equippedArmor"] {
  const out: Character["equippedArmor"] = {};
  for (const id of ids) {
    const a = ARMOR[id];
    if (a) out[a.slot] = a.id;
  }
  return out;
}

function cryptoId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ─── Encumbrance ──────────────────────────────────────────────────────────
export function inventoryWeight(c: Character): number {
  let w = 0;
  for (const it of c.inventory) w += it.weight;
  return Math.round(w * 10) / 10;
}

export function isOverEncumbered(c: Character): boolean {
  return inventoryWeight(c) > deriveEncumbrance(c.stats);
}

// ─── Stamina / HP helpers ─────────────────────────────────────────────────
export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

export function spendStamina(c: Character, amount: number): Character {
  return { ...c, stamina: clamp(c.stamina - amount, 0, c.staminaMax) };
}

export function restoreStamina(c: Character, amount: number): Character {
  return { ...c, stamina: clamp(c.stamina + amount, 0, c.staminaMax) };
}

export function applyDamage(c: Character, amount: number): Character {
  return { ...c, hp: clamp(c.hp - amount, 0, c.hpMax) };
}

export function heal(c: Character, amount: number): Character {
  return { ...c, hp: clamp(c.hp + amount, 0, c.hpMax) };
}

// ─── Skill access ─────────────────────────────────────────────────────────
export function statValue(c: Character, k: StatKey): number {
  return c.stats[k];
}

export function skillValue(c: Character, k: SkillKey): number {
  return c.skills[k];
}

// ─── Item helpers ─────────────────────────────────────────────────────────
export function addItem(c: Character, item: Item): Character {
  return { ...c, inventory: [...c.inventory, item] };
}

export function removeItemAt(c: Character, idx: number): Character {
  const next = c.inventory.slice();
  next.splice(idx, 1);
  return { ...c, inventory: next };
}

export function consumeFirstEdible(c: Character): {
  character: Character;
  consumed?: Item;
} {
  const idx = c.inventory.findIndex((i) => i.edible);
  if (idx === -1) return { character: c };
  const item = c.inventory[idx]!;
  let next = removeItemAt(c, idx);
  if (item.hpRestore) next = heal(next, item.hpRestore);
  if (item.staminaRestore) next = restoreStamina(next, item.staminaRestore);
  if (item.removesHunger) next = { ...next, hungry: false };
  return { character: next, consumed: item };
}
