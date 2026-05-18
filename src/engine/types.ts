// Central type definitions. Everything the engine touches has its shape declared here.

import type { DamageDice } from "./dice";

// ─── Core stats ───────────────────────────────────────────────────────────
// Witcher-inspired primary stats. We use a simplified, focused set.
export type StatKey =
  | "int" // Intelligence — reason, learning, lore
  | "ref" // Reflexes — agility, dodge, ranged
  | "dex" // Dexterity — fine motor, melee precision
  | "body" // Body — strength, toughness
  | "spd" // Speed — initiative, movement
  | "emp" // Empathy — read people, social
  | "cra" // Craft — making things, alchemy
  | "wil" // Will — resist, magic, courage
  | "luc"; // Luck — fortune (a small dice mod buffer)

export const STAT_KEYS: StatKey[] = [
  "int",
  "ref",
  "dex",
  "body",
  "spd",
  "emp",
  "cra",
  "wil",
  "luc",
];

export const STAT_LABELS: Record<StatKey, string> = {
  int: "Intelligence",
  ref: "Reflexes",
  dex: "Dexterity",
  body: "Body",
  spd: "Speed",
  emp: "Empathy",
  cra: "Craft",
  wil: "Will",
  luc: "Luck",
};

export type Stats = Record<StatKey, number>;

// ─── Skills ───────────────────────────────────────────────────────────────
// We keep a tight, useful subset rather than the full 60+ TTRPG skill list.
export type SkillKey =
  | "swordsmanship"
  | "smallBlades"
  | "brawling"
  | "archery"
  | "dodge"
  | "athletics"
  | "stealth"
  | "awareness"
  | "wilderness"
  | "alchemy"
  | "firstAid"
  | "monsterLore"
  | "persuasion"
  | "intimidation"
  | "spellcasting";

export const SKILL_KEYS: SkillKey[] = [
  "swordsmanship",
  "smallBlades",
  "brawling",
  "archery",
  "dodge",
  "athletics",
  "stealth",
  "awareness",
  "wilderness",
  "alchemy",
  "firstAid",
  "monsterLore",
  "persuasion",
  "intimidation",
  "spellcasting",
];

export const SKILL_LABELS: Record<SkillKey, string> = {
  swordsmanship: "Swordsmanship",
  smallBlades: "Small Blades",
  brawling: "Brawling",
  archery: "Archery",
  dodge: "Dodge & Escape",
  athletics: "Athletics",
  stealth: "Stealth",
  awareness: "Awareness",
  wilderness: "Wilderness Survival",
  alchemy: "Alchemy",
  firstAid: "First Aid",
  monsterLore: "Monster Lore",
  persuasion: "Persuasion",
  intimidation: "Intimidation",
  spellcasting: "Spellcasting",
};

// Which stat each skill is rolled with.
export const SKILL_STAT: Record<SkillKey, StatKey> = {
  swordsmanship: "dex",
  smallBlades: "dex",
  brawling: "body",
  archery: "ref",
  dodge: "ref",
  athletics: "body",
  stealth: "dex",
  awareness: "int",
  wilderness: "int",
  alchemy: "cra",
  firstAid: "cra",
  monsterLore: "int",
  persuasion: "emp",
  intimidation: "wil",
  spellcasting: "wil",
};

export type Skills = Record<SkillKey, number>;

// ─── Classes / professions ────────────────────────────────────────────────
export type CharClassKey =
  | "witcher"
  | "warrior"
  | "bard"
  | "mage"
  | "physician"
  | "scoundrel";

export type CharClass = {
  key: CharClassKey;
  name: string;
  blurb: string;
  statBonus: Partial<Stats>;
  skillBonus: Partial<Skills>;
  startingItemIds: string[]; // refs items.ts
  startingWeaponId?: string;
  startingArmorIds?: string[]; // refs armor.ts
  startingCrowns: number;
};

// ─── Items, weapons, armor ────────────────────────────────────────────────
export type ItemKind = "consumable" | "material" | "trinket" | "tool" | "loot";

export type Item = {
  id: string;
  name: string;
  description: string;
  weight: number; // kg
  value: number; // crowns
  kind: ItemKind;
  edible?: boolean;
  // For edible/consumable items:
  hpRestore?: number;
  staminaRestore?: number;
  removesHunger?: boolean;
  // Foraging rarity — lower = rarer.
  forageWeight?: number;
};

export type DamageType = "slashing" | "piercing" | "bludgeoning" | "elemental";

export type ArmorSlot = "head" | "torso" | "legs";

export type ArmorPiece = {
  id: string;
  name: string;
  description: string;
  slot: ArmorSlot;
  sp: number; // stopping power
  encumbrance: number;
  weight: number;
  value: number;
};

export type Weapon = {
  id: string;
  name: string;
  description: string;
  damageType: DamageType;
  damage: DamageDice;
  hands: 1 | 2;
  reach: "melee" | "ranged";
  accuracy: number; // mod to attack
  reliability: number; // currently unused; placeholder
  weight: number;
  value: number;
};

// ─── Character / combatant ────────────────────────────────────────────────
export type Character = {
  id: string;
  name: string;
  classKey: CharClassKey;
  stats: Stats;
  skills: Skills;
  hp: number;
  hpMax: number;
  stamina: number;
  staminaMax: number;
  xp: number;
  crowns: number;
  hungry: boolean;
  rested: boolean;
  inventory: Item[];
  equippedWeaponId?: string;
  ownedWeaponIds: string[]; // weapons in inventory not currently equipped + the equipped one
  equippedArmor: Partial<Record<ArmorSlot, string>>; // slot -> ArmorPiece.id
  ownedArmorIds: string[];
  reputation: number;
};

// ─── Enemies ──────────────────────────────────────────────────────────────
export type EnemyTemplate = {
  id: string;
  name: string;
  description: string;
  threat: "trivial" | "easy" | "average" | "hard" | "deadly";
  isMonster: boolean;
  stats: Stats;
  skills: Partial<Skills>;
  hpMax: number;
  sp: number; // flat armor
  weaponId: string; // reference into weapons.ts (their "weapon")
  loot: { itemId: string; chance: number }[]; // chance 0..1
  crownsMin: number;
  crownsMax: number;
  xpReward: number;
  biomes: BiomeKey[]; // where they appear
};

export type EnemyInstance = {
  template: EnemyTemplate;
  hp: number;
  stamina: number;
  staminaMax: number;
};

// ─── World ────────────────────────────────────────────────────────────────
export type BiomeKey =
  | "forest"
  | "plains"
  | "hills"
  | "mountains"
  | "swamp"
  | "river"
  | "road"
  | "town";

export type BiomeDef = {
  key: BiomeKey;
  label: string;
  glyph: string; // single-char map glyph
  color: string; // CSS color
  passable: boolean;
  travelMinutes: number; // average minutes to cross one tile
  encounterChance: number; // 0..1 per move
  forageDifficulty: number; // DC
};

export type Tile = {
  biome: BiomeKey;
  // optional named location (town, shrine, etc.) — extension hook
  poi?: string;
};

export type WorldMap = {
  width: number;
  height: number;
  tiles: BiomeKey[]; // flat row-major
  towns: Town[];
};

// ─── Towns ────────────────────────────────────────────────────────────────
export type TownSize = "hamlet" | "village" | "town";

export type StockKind = "item" | "weapon" | "armor";

export type StockEntry = {
  kind: StockKind;
  refId: string; // id into ITEMS, WEAPONS, or ARMOR catalog
  price: number; // crowns
  count: number; // how many in stock (some items are stocked as 1)
};

export type Merchant = {
  buyMarkup: number; // multiplier on item.value when player buys (e.g. 1.2)
  sellDiscount: number; // multiplier when player sells (e.g. 0.4)
  stock: StockEntry[];
  lastRestockDay: number;
};

export type Town = {
  id: string;
  name: string;
  size: TownSize;
  blurb: string;
  x: number;
  y: number;
  innCostPerNight: number; // crowns
  healerCostPerHp: number; // crowns
  merchant: Merchant;
};

// ─── Time / weather ───────────────────────────────────────────────────────
export type TimeOfDay =
  | "midnight"
  | "smallHours"
  | "earlyMorning"
  | "lateMorning"
  | "midday"
  | "earlyAfternoon"
  | "lateAfternoon"
  | "evening";

export type LightLevel = "night" | "twilight" | "day";
export type MoonPhase =
  | "new"
  | "waxingCrescent"
  | "firstQuarter"
  | "waxingGibbous"
  | "full"
  | "waningGibbous"
  | "lastQuarter"
  | "waningCrescent";

export type Weather = "clear" | "cloudy" | "overcast" | "rain" | "storm" | "snow" | "fog";

export type WorldClock = {
  day: number; // days since campaign start
  minutes: number; // 0..1440
  month: number; // 0..11 (in-world month)
  moonDay: number; // 1..28
  weather: Weather;
  tempC: number;
};

// ─── Encounter / combat ───────────────────────────────────────────────────
export type CombatLogEntry = {
  text: string;
  kind: "info" | "player" | "enemy" | "system" | "good" | "bad";
};

export type Combat = {
  enemy: EnemyInstance;
  turn: "player" | "enemy";
  round: number;
  log: CombatLogEntry[];
  finished: boolean;
  outcome?: "victory" | "defeat" | "flee";
};

// ─── Log entry ────────────────────────────────────────────────────────────
export type GameLogEntry = {
  id: number;
  ts: number; // ms timestamp (real time, for ordering)
  text: string;
  kind: "narration" | "system" | "good" | "bad" | "combat";
};

// ─── Save data ────────────────────────────────────────────────────────────
export type SaveBundle = {
  version: number;
  savedAt: number; // ms timestamp
  label: string;
  state: SerializedGameState;
};

export type SerializedGameState = {
  seed: number;
  player: Character;
  world: WorldMap;
  clock: WorldClock;
  pos: { x: number; y: number };
  log: GameLogEntry[];
  combat?: Combat | undefined;
  currentTownId?: string | undefined;
};
