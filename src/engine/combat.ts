// Combat resolution. Pure functions: take state, return state.
// Players and enemies share enough that we abstract them as "Combatant".

import { ARMOR } from "../data/armor";
import { ITEMS } from "../data/items";
import { weaponById } from "../data/weapons";
import { rollD10, rollD10Flat, rollDamage, type DiceRoll } from "./dice";
import type { Rng } from "./rng";
import type {
  Character,
  Combat,
  CombatLogEntry,
  EnemyInstance,
  EnemyTemplate,
  Item,
  SkillKey,
  StatKey,
  Weapon,
} from "./types";

// ─── Abstract combatant view ──────────────────────────────────────────────
type CombatantView = {
  name: string;
  hp: number;
  hpMax: number;
  weapon: Weapon;
  sp: number; // average effective stopping power
  body: number;
  ref: number;
  attackBonus: number; // skill + accuracy + relevant stat - encumbrance etc
  defenseBonus: number;
};

function playerWeapon(c: Character): Weapon {
  return weaponById(c.equippedWeaponId);
}

function playerSp(c: Character): number {
  // Average SP across worn pieces (rough abstraction for a single body track).
  const slots = Object.values(c.equippedArmor).filter(Boolean) as string[];
  if (slots.length === 0) return 0;
  let total = 0;
  let n = 0;
  for (const id of slots) {
    const a = ARMOR[id];
    if (a) {
      total += a.sp;
      n++;
    }
  }
  return n === 0 ? 0 : Math.round(total / n);
}

function playerSkillFor(c: Character, weapon: Weapon): {
  skill: SkillKey;
  stat: StatKey;
} {
  if (weapon.reach === "ranged") return { skill: "archery", stat: "ref" };
  if (weapon.hands === 2) return { skill: "swordsmanship", stat: "dex" };
  if (weapon.damageType === "piercing")
    return { skill: "smallBlades", stat: "dex" };
  if (weapon.damageType === "slashing")
    return { skill: "swordsmanship", stat: "dex" };
  return { skill: "brawling", stat: "body" };
}

export function playerToCombatant(c: Character): CombatantView {
  const w = playerWeapon(c);
  const { skill, stat } = playerSkillFor(c, w);
  return {
    name: c.name,
    hp: c.hp,
    hpMax: c.hpMax,
    weapon: w,
    sp: playerSp(c),
    body: c.stats.body,
    ref: c.stats.ref,
    attackBonus: c.skills[skill] + c.stats[stat] + w.accuracy,
    defenseBonus: c.skills.dodge + c.stats.ref,
  };
}

export function enemyToCombatant(e: EnemyInstance): CombatantView {
  const t = e.template;
  const w = weaponById(t.weaponId);
  // Pick the highest of brawling/swordsmanship for attack — keeps enemy data flexible.
  const skill = Math.max(
    t.skills.swordsmanship ?? 0,
    t.skills.brawling ?? 0,
    t.skills.smallBlades ?? 0,
    t.skills.archery ?? 0,
  );
  return {
    name: t.name,
    hp: e.hp,
    hpMax: t.hpMax,
    weapon: w,
    sp: t.sp,
    body: t.stats.body,
    ref: t.stats.ref,
    attackBonus: skill + t.stats.ref + w.accuracy,
    defenseBonus: (t.skills.dodge ?? 0) + t.stats.ref,
  };
}

// ─── Combat start ─────────────────────────────────────────────────────────
export function spawnEnemyInstance(t: EnemyTemplate): EnemyInstance {
  return {
    template: t,
    hp: t.hpMax,
    stamina: 30,
    staminaMax: 30,
  };
}

export function startCombat(rng: Rng, player: Character, enemy: EnemyInstance): Combat {
  // Initiative: d10 + ref + spd/2
  const pv = playerToCombatant(player);
  const ev = enemyToCombatant(enemy);
  const pInit = rollD10(rng).total + player.stats.ref + player.stats.spd / 2;
  const eInit = rollD10(rng).total + enemy.template.stats.ref + enemy.template.stats.spd / 2;
  const playerFirst = pInit >= eInit;

  const log: CombatLogEntry[] = [
    {
      kind: "system",
      text: `${ev.name} blocks your path. Combat begins.`,
    },
    {
      kind: "info",
      text: playerFirst
        ? `You move first.`
        : `${ev.name} moves first.`,
    },
  ];

  return {
    enemy,
    turn: playerFirst ? "player" : "enemy",
    round: 1,
    log,
    finished: false,
  };
}

// ─── Attack style ─────────────────────────────────────────────────────────
export type AttackStyle = "fast" | "strong" | "feint";

export type AttackOutcome = {
  text: string;
  damage: number;
  hit: boolean;
  crit: boolean;
  attackerRoll: DiceRoll;
  defenderRoll: DiceRoll;
};

function styleMods(style: AttackStyle): { atk: number; dmg: number; tag: string } {
  switch (style) {
    case "fast":
      return { atk: 1, dmg: -1, tag: "a swift strike" };
    case "strong":
      return { atk: -2, dmg: 3, tag: "a heavy strike" };
    case "feint":
      return { atk: 3, dmg: -3, tag: "a feinting strike" };
  }
}

// Hit-location chart for humanoids (1d10 flat).
const HUMANOID_LOCATIONS: { range: [number, number]; label: string; mult: number }[] = [
  { range: [1, 1], label: "head", mult: 2 },
  { range: [2, 5], label: "torso", mult: 1 },
  { range: [6, 7], label: "arm", mult: 0.8 },
  { range: [8, 10], label: "leg", mult: 0.8 },
];

function rollHitLocation(rng: Rng): { label: string; mult: number } {
  const r = rollD10Flat(rng);
  for (const row of HUMANOID_LOCATIONS) {
    if (r >= row.range[0] && r <= row.range[1]) return { label: row.label, mult: row.mult };
  }
  return { label: "torso", mult: 1 };
}

// ─── Attack resolution ────────────────────────────────────────────────────
export function resolveAttack(
  rng: Rng,
  attacker: CombatantView,
  defender: CombatantView,
  style: AttackStyle,
): AttackOutcome {
  const mods = styleMods(style);
  const atkRoll = rollD10(rng);
  const defRoll = rollD10(rng);
  const atkTotal = attacker.attackBonus + atkRoll.total + mods.atk;
  const defTotal = defender.defenseBonus + defRoll.total;
  const hit = atkTotal > defTotal;
  const crit = atkRoll.exploded && hit;

  if (!hit) {
    return {
      hit: false,
      crit: false,
      damage: 0,
      attackerRoll: atkRoll,
      defenderRoll: defRoll,
      text:
        atkRoll.fumbled
          ? `${attacker.name} fumbles ${mods.tag} and stumbles.`
          : `${attacker.name} attempts ${mods.tag} — blocked.`,
    };
  }

  const loc = rollHitLocation(rng);
  let dmg = rollDamage(rng, attacker.weapon.damage) + mods.dmg;
  // body bonus for attacker if much stronger
  if (attacker.body > defender.body) dmg += attacker.body - defender.body;
  dmg = Math.max(1, dmg);
  // armor reduces
  dmg = Math.max(0, dmg - defender.sp);
  dmg = Math.round(dmg * loc.mult);

  let text = `${attacker.name} lands ${mods.tag} to the ${loc.label} for ${dmg}.`;
  if (crit) text = `Critical! ${text}`;

  return { hit: true, crit, damage: dmg, attackerRoll: atkRoll, defenderRoll: defRoll, text };
}

// ─── Turn application ────────────────────────────────────────────────────
export type CombatTickResult = {
  combat: Combat;
  player: Character;
  // Defeat/victory hand-off:
  outcome?: "victory" | "defeat" | "flee";
  xpGained?: number;
  crownsGained?: number;
  loot?: import("./types").Item[];
};

export function playerAttack(
  rng: Rng,
  player: Character,
  combat: Combat,
  style: AttackStyle,
): CombatTickResult {
  if (combat.finished || combat.turn !== "player") return { combat, player };
  const atk = playerToCombatant(player);
  const def = enemyToCombatant(combat.enemy);
  const out = resolveAttack(rng, atk, def, style);

  const enemy: EnemyInstance = {
    ...combat.enemy,
    hp: Math.max(0, combat.enemy.hp - out.damage),
  };
  const log = [...combat.log, { kind: "player" as const, text: out.text }];

  // Stamina cost
  const staminaCost = style === "strong" ? 4 : 2;
  let p = { ...player, stamina: Math.max(0, player.stamina - staminaCost) };

  if (enemy.hp <= 0) {
    // Victory path
    const xp = enemy.template.xpReward;
    const crowns = randIn(rng, enemy.template.crownsMin, enemy.template.crownsMax);
    const loot = rollLoot(rng, enemy.template);
    p = { ...p, xp: p.xp + xp, crowns: p.crowns + crowns, inventory: [...p.inventory, ...loot] };
    return {
      combat: {
        ...combat,
        enemy,
        finished: true,
        outcome: "victory",
        log: [
          ...log,
          { kind: "good", text: `${enemy.template.name} falls. +${xp} XP, +${crowns} crowns.` },
        ],
      },
      player: p,
      outcome: "victory",
      xpGained: xp,
      crownsGained: crowns,
      loot,
    };
  }

  // Hand off to enemy
  return {
    combat: { ...combat, enemy, log, turn: "enemy" },
    player: p,
  };
}

export function enemyTurn(rng: Rng, player: Character, combat: Combat): CombatTickResult {
  if (combat.finished || combat.turn !== "enemy") return { combat, player };
  const atk = enemyToCombatant(combat.enemy);
  const def = playerToCombatant(player);
  // Enemy AI: 70% normal strike, 20% strong, 10% fast.
  const r = rng();
  const style: AttackStyle = r < 0.2 ? "strong" : r < 0.3 ? "fast" : "fast";
  const out = resolveAttack(rng, atk, def, style);
  let p = { ...player, hp: Math.max(0, player.hp - out.damage) };
  const log = [...combat.log, { kind: "enemy" as const, text: out.text }];

  if (p.hp <= 0) {
    return {
      combat: {
        ...combat,
        finished: true,
        outcome: "defeat",
        log: [
          ...log,
          { kind: "bad", text: `You collapse. The Path ends here.` },
        ],
      },
      player: p,
      outcome: "defeat",
    };
  }

  return {
    combat: { ...combat, log, turn: "player", round: combat.round + 1 },
    player: p,
  };
}

// ─── Flee ────────────────────────────────────────────────────────────────
export function attemptFlee(rng: Rng, player: Character, combat: Combat): CombatTickResult {
  // Opposed: player dodge + ref vs enemy ref + brawling.
  const pRoll = rollD10(rng);
  const eRoll = rollD10(rng);
  const pTotal = player.skills.dodge + player.stats.ref + pRoll.total;
  const eTotal =
    (combat.enemy.template.skills.dodge ?? 0) +
    combat.enemy.template.stats.ref +
    eRoll.total;
  if (pTotal >= eTotal) {
    const log = [
      ...combat.log,
      { kind: "good" as const, text: "You break contact and slip away." },
    ];
    return {
      combat: { ...combat, finished: true, outcome: "flee", log },
      player: { ...player, stamina: Math.max(0, player.stamina - 6) },
      outcome: "flee",
    };
  } else {
    // Failed flee — enemy gets a free shot.
    const log = [
      ...combat.log,
      { kind: "bad" as const, text: "You can't shake them. They press the attack!" },
    ];
    return enemyTurn(rng, player, { ...combat, log, turn: "enemy" });
  }
}

// ─── Loot ────────────────────────────────────────────────────────────────
function randIn(rng: Rng, lo: number, hi: number): number {
  if (hi <= lo) return lo;
  return Math.floor(rng() * (hi - lo + 1)) + lo;
}

function rollLoot(rng: Rng, t: EnemyTemplate): Item[] {
  const out: Item[] = [];
  for (const drop of t.loot) {
    if (rng() < drop.chance) {
      const def = ITEMS[drop.itemId];
      if (def) out.push({ ...def });
    }
  }
  return out;
}
