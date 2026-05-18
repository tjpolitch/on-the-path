// Zustand store. All mutations go through actions in here so the engine stays pure.

import { create } from "zustand";
import {
  applyTimePassageOnPlayer,
  eat as engineEat,
  forage as engineForage,
  rest as engineRest,
  travel as engineTravel,
  tickClock,
  type Direction,
} from "../engine/actions";
import { isOverEncumbered } from "../engine/character";
import {
  attemptFlee,
  enemyTurn,
  playerAttack,
  startCombat,
  type AttackStyle,
} from "../engine/combat";
import { makeRng, randomSeed } from "../engine/rng";
import {
  buyFromStock,
  maybeRestock,
  sellInventoryItem,
  stayAtInn,
  townAt,
  townById,
  visitHealer,
} from "../engine/towns";
import { describeWeather } from "../engine/weather";
import { findStartTile, generateWorld } from "../engine/world";
import { generateTempC } from "../engine/time";
import type {
  Character,
  Combat,
  GameLogEntry,
  SerializedGameState,
  Town,
  WorldClock,
  WorldMap,
} from "../engine/types";
import { saveAuto } from "./persistence";

// ─── Slice shape ──────────────────────────────────────────────────────────
type Phase = "title" | "creation" | "playing" | "dead";

export type GameStore = {
  phase: Phase;
  seed: number;
  player: Character | null;
  world: WorldMap | null;
  clock: WorldClock | null;
  pos: { x: number; y: number };
  log: GameLogEntry[];
  combat: Combat | null;
  currentTownId: string | null;
  // bookkeeping
  minutesSinceMeal: number;
  // setters
  setPhase: (p: Phase) => void;
  startNewGame: (player: Character, seed?: number) => void;
  loadFromState: (s: SerializedGameState, phase?: Phase) => void;
  abandon: () => void;
  // actions
  doTravel: (dir: Direction) => void;
  doForage: () => void;
  doRest: (hours?: number) => void;
  doEat: () => void;
  doAttack: (style: AttackStyle) => void;
  doFlee: () => void;
  dismissCombatScreen: () => void; // after victory/flee
  acceptDeath: () => void;
  // towns
  currentTown: () => Town | null;
  leaveTown: () => void;
  doStayInn: () => void;
  doVisitHealer: () => void;
  doBuy: (stockIndex: number) => void;
  doSellItem: (invIndex: number) => void;
  // misc
  pushLog: (text: string, kind?: GameLogEntry["kind"]) => void;
  serialize: () => SerializedGameState | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────
let logCounter = 1;
function entry(text: string, kind: GameLogEntry["kind"] = "narration"): GameLogEntry {
  return { id: logCounter++, ts: Date.now(), text, kind };
}

// One single mutable RNG ref so we don't have to plumb it through every action.
// Recreated on new game / load.
let rngRef: ReturnType<typeof makeRng> = makeRng(1);
function getRng() {
  return rngRef;
}
function resetRng(seed: number) {
  rngRef = makeRng(seed);
}

// Auto-save throttle (don't write on every action burst).
let autoSaveTimer: number | null = null;
function scheduleAutoSave(get: () => GameStore) {
  if (autoSaveTimer != null) {
    window.clearTimeout(autoSaveTimer);
  }
  autoSaveTimer = window.setTimeout(() => {
    const s = get().serialize();
    if (s) saveAuto(s);
    autoSaveTimer = null;
  }, 800);
}

// ─── Store ────────────────────────────────────────────────────────────────
export const useGameStore = create<GameStore>((set, get) => ({
  phase: "title",
  seed: 1,
  player: null,
  world: null,
  clock: null,
  pos: { x: 0, y: 0 },
  log: [],
  combat: null,
  currentTownId: null,
  minutesSinceMeal: 0,

  setPhase: (p) => set({ phase: p }),

  startNewGame: (player, seed) => {
    const useSeed = seed ?? randomSeed();
    resetRng(useSeed);
    const rng = getRng();
    const world = generateWorld(rng, { width: 40, height: 40, townCount: 4 });
    const pos = findStartTile(world);
    const month = 3; // start in April-ish
    const clock: WorldClock = {
      day: 1,
      minutes: 7 * 60,
      month,
      moonDay: 1,
      weather: "clear",
      tempC: generateTempC(rng, month, 7 * 60),
    };
    const intro = entry(
      `${player.name} sets out on the Path. The morning is ${describeWeather(clock)}.`,
      "narration",
    );
    const where = entry(
      world.tiles[pos.y * world.width + pos.x] === "town"
        ? "You're in a small town at the edge of the wilds."
        : "You stand at the start of the road.",
      "system",
    );
    // If we started on a town tile, mark it as currentTownId so we enter on first render.
    const startingTown = townAt(world, pos.x, pos.y);
    set({
      phase: "playing",
      seed: useSeed,
      player,
      world,
      clock,
      pos,
      log: [intro, where],
      combat: null,
      currentTownId: startingTown?.id ?? null,
      minutesSinceMeal: 0,
    });
    scheduleAutoSave(get);
  },

  loadFromState: (s, phase = "playing") => {
    resetRng(s.seed);
    set({
      phase,
      seed: s.seed,
      player: s.player,
      world: s.world,
      clock: s.clock,
      pos: s.pos,
      log: s.log,
      combat: s.combat ?? null,
      currentTownId: s.currentTownId ?? null,
      minutesSinceMeal: 0,
    });
  },

  abandon: () => {
    set({
      phase: "title",
      player: null,
      world: null,
      clock: null,
      pos: { x: 0, y: 0 },
      log: [],
      combat: null,
      currentTownId: null,
    });
  },

  pushLog: (text, kind = "narration") => {
    set({ log: [...get().log, entry(text, kind)] });
  },

  // ─── Town actions ───────────────────────────────────────────────────────
  currentTown: () => {
    const { world, currentTownId } = get();
    if (!world || !currentTownId) return null;
    return townById(world, currentTownId) ?? null;
  },

  leaveTown: () => {
    const t = get().currentTown();
    if (!t) return;
    set({ currentTownId: null });
    get().pushLog(`You leave ${t.name} behind.`, "narration");
    scheduleAutoSave(get);
  },

  doStayInn: () => {
    const { player, clock, world } = get();
    const t = get().currentTown();
    if (!player || !clock || !world || !t) return;
    const r = stayAtInn(player, t);
    if (!r.ok) {
      get().pushLog(r.message, "bad");
      return;
    }
    const rng = getRng();
    const nextClock = tickClock(rng, clock, r.hoursSlept * 60);
    set({
      player: r.player,
      clock: nextClock,
      minutesSinceMeal: 0, // inn includes a meal
      log: [...get().log, entry(r.message, "good")],
    });
    scheduleAutoSave(get);
  },

  doVisitHealer: () => {
    const { player, clock } = get();
    const t = get().currentTown();
    if (!player || !clock || !t) return;
    const r = visitHealer(player, t);
    if (!r.ok) {
      get().pushLog(r.message, "system");
      return;
    }
    const rng = getRng();
    const nextClock = tickClock(rng, clock, 30); // half hour visit
    set({
      player: r.player,
      clock: nextClock,
      log: [...get().log, entry(r.message, "good")],
    });
    scheduleAutoSave(get);
  },

  doBuy: (stockIndex) => {
    const { player, world } = get();
    const t = get().currentTown();
    if (!player || !world || !t) return;
    const r = buyFromStock(player, t, stockIndex);
    if (!r.ok) {
      get().pushLog(r.message, "system");
      return;
    }
    const nextWorld: WorldMap = {
      ...world,
      towns: world.towns.map((tt) => (tt.id === r.town.id ? r.town : tt)),
    };
    set({
      player: r.player,
      world: nextWorld,
      log: [...get().log, entry(r.message, "good")],
    });
    scheduleAutoSave(get);
  },

  doSellItem: (invIndex) => {
    const { player, world } = get();
    const t = get().currentTown();
    if (!player || !world || !t) return;
    const r = sellInventoryItem(player, t, invIndex);
    if (!r.ok) {
      get().pushLog(r.message, "system");
      return;
    }
    set({
      player: r.player,
      log: [...get().log, entry(r.message, "good")],
    });
    scheduleAutoSave(get);
  },

  doTravel: (dir) => {
    const { player, world, clock, pos, combat, currentTownId } = get();
    if (!player || !world || !clock || combat || currentTownId) return;
    const rng = getRng();
    const r = engineTravel(rng, world, pos, dir);
    if (!r.ok) {
      get().pushLog(r.narration, "bad");
      return;
    }
    const nextClock = tickClock(rng, clock, r.minutesSpent);
    const minutesSinceMeal = get().minutesSinceMeal + r.minutesSpent;
    const eff = applyTimePassageOnPlayer(player, r.minutesSpent, minutesSinceMeal);
    const newLog: GameLogEntry[] = [entry(r.narration, "narration")];
    if (eff.becameHungry) newLog.push(entry("Hunger gnaws at you.", "bad"));
    if (eff.starveDamage > 0)
      newLog.push(entry(`Starving — you lose ${eff.starveDamage} HP.`, "bad"));

    if (r.encounter) {
      const combatState = startCombat(rng, eff.player, r.encounter);
      set({
        player: eff.player,
        clock: nextClock,
        pos: r.pos,
        log: [...get().log, ...newLog, entry(combatState.log[0]!.text, "combat")],
        combat: combatState,
        minutesSinceMeal,
      });
      if (combatState.turn === "enemy") {
        runEnemyTurns(set, get);
      }
    } else {
      // Auto-enter town if we just stepped onto one.
      const arrivedTown = townAt(world, r.pos.x, r.pos.y);
      let nextWorld = world;
      let nextTownId: string | null = null;
      if (arrivedTown) {
        const restocked = maybeRestock(rng, arrivedTown, nextClock.day);
        nextWorld =
          restocked === arrivedTown
            ? world
            : {
                ...world,
                towns: world.towns.map((t) => (t.id === arrivedTown.id ? restocked : t)),
              };
        nextTownId = arrivedTown.id;
        newLog.push(entry(`You enter ${arrivedTown.name}.`, "good"));
        newLog.push(entry(arrivedTown.blurb, "narration"));
      }
      set({
        player: eff.player,
        world: nextWorld,
        clock: nextClock,
        pos: r.pos,
        log: [...get().log, ...newLog],
        minutesSinceMeal,
        currentTownId: nextTownId,
      });
    }
    if (get().player && get().player!.hp <= 0) {
      set({ phase: "dead" });
    }
    scheduleAutoSave(get);
  },

  doForage: () => {
    const { player, world, pos, clock, combat } = get();
    if (!player || !world || !clock || combat) return;
    const rng = getRng();
    const r = engineForage(rng, player, world, pos);
    const nextClock = tickClock(rng, clock, r.minutesSpent);
    const minutesSinceMeal = get().minutesSinceMeal + r.minutesSpent;
    const eff = applyTimePassageOnPlayer(r.player, r.minutesSpent, minutesSinceMeal);
    const k: GameLogEntry["kind"] = r.passed ? "good" : "system";
    const newLog = [entry(r.narration, k)];
    if (eff.becameHungry) newLog.push(entry("Hunger gnaws at you.", "bad"));
    if (eff.starveDamage > 0)
      newLog.push(entry(`Starving — you lose ${eff.starveDamage} HP.`, "bad"));
    set({
      player: eff.player,
      clock: nextClock,
      log: [...get().log, ...newLog],
      minutesSinceMeal,
    });
    if (get().player && get().player!.hp <= 0) {
      set({ phase: "dead" });
    }
    scheduleAutoSave(get);
  },

  doRest: (hours = 1) => {
    const { player, clock, combat } = get();
    if (!player || !clock || combat) return;
    const rng = getRng();
    const r = engineRest(rng, player, hours);
    const nextClock = tickClock(rng, clock, r.minutesSpent);
    const minutesSinceMeal = get().minutesSinceMeal + r.minutesSpent;
    const eff = applyTimePassageOnPlayer(r.player, r.minutesSpent, minutesSinceMeal);
    const newLog = [entry(r.narration, "narration")];
    if (eff.becameHungry) newLog.push(entry("Hunger gnaws at you.", "bad"));
    if (eff.starveDamage > 0)
      newLog.push(entry(`Starving — you lose ${eff.starveDamage} HP.`, "bad"));
    set({
      player: eff.player,
      clock: nextClock,
      log: [...get().log, ...newLog],
      minutesSinceMeal,
    });
    if (get().player && get().player!.hp <= 0) {
      set({ phase: "dead" });
    }
    scheduleAutoSave(get);
  },

  doEat: () => {
    const { player, clock, combat } = get();
    if (!player || !clock || combat) return;
    const r = engineEat(player);
    const newLog = [entry(r.narration, r.consumed ? "good" : "system")];
    const nextMinutes = 10;
    const rng = getRng();
    const nextClock = tickClock(rng, clock, nextMinutes);
    set({
      player: r.consumed ? r.player : player,
      clock: nextClock,
      minutesSinceMeal: r.consumed ? 0 : get().minutesSinceMeal,
      log: [...get().log, ...newLog],
    });
    scheduleAutoSave(get);
  },

  doAttack: (style) => {
    const { player, combat } = get();
    if (!player || !combat || combat.finished) return;
    if (combat.turn !== "player") return;
    const rng = getRng();
    const result = playerAttack(rng, player, combat, style);
    const newCombat = result.combat;
    const lastLog = newCombat.log[newCombat.log.length - 1];
    const tail: GameLogEntry[] = lastLog
      ? [entry(lastLog.text, kindFor(lastLog.kind))]
      : [];

    set({
      player: result.player,
      combat: newCombat,
      log: [...get().log, ...tail],
    });

    if (newCombat.finished) {
      // Append the win/loss tail entry too.
      const tail2 = newCombat.log[newCombat.log.length - 1];
      if (tail2 && tail2 !== lastLog) {
        get().pushLog(tail2.text, kindFor(tail2.kind));
      }
      if (newCombat.outcome === "defeat") {
        set({ phase: "dead" });
      }
      scheduleAutoSave(get);
      return;
    }
    // Enemy turn(s) follow.
    runEnemyTurns(set, get);
    scheduleAutoSave(get);
  },

  doFlee: () => {
    const { player, combat } = get();
    if (!player || !combat || combat.finished) return;
    if (combat.turn !== "player") return;
    const rng = getRng();
    const r = attemptFlee(rng, player, combat);
    const tailEntries = r.combat.log.slice(combat.log.length).map((l) => entry(l.text, kindFor(l.kind)));
    set({
      player: r.player,
      combat: r.combat,
      log: [...get().log, ...tailEntries],
    });
    if (r.combat.finished && r.combat.outcome === "defeat") {
      set({ phase: "dead" });
    }
    scheduleAutoSave(get);
  },

  dismissCombatScreen: () => {
    const c = get().combat;
    if (!c || !c.finished) return;
    set({ combat: null });
  },

  acceptDeath: () => {
    set({
      phase: "title",
      player: null,
      world: null,
      clock: null,
      pos: { x: 0, y: 0 },
      log: [],
      combat: null,
    });
  },

  serialize: () => {
    const s = get();
    if (!s.player || !s.world || !s.clock) return null;
    return {
      seed: s.seed,
      player: s.player,
      world: s.world,
      clock: s.clock,
      pos: s.pos,
      log: s.log,
      combat: s.combat ?? undefined,
      currentTownId: s.currentTownId ?? undefined,
    };
  },
}));

// Helper: map combat-log kind into game-log kind.
function kindFor(k: import("../engine/types").CombatLogEntry["kind"]): GameLogEntry["kind"] {
  switch (k) {
    case "good":
      return "good";
    case "bad":
      return "bad";
    case "system":
    case "info":
      return "combat";
    case "player":
    case "enemy":
      return "combat";
  }
}

function runEnemyTurns(
  set: (partial: Partial<GameStore>) => void,
  get: () => GameStore,
) {
  let { combat, player } = get();
  if (!player || !combat || combat.finished) return;
  if (combat.turn !== "enemy") return;

  const rng = getRng();
  while (combat && !combat.finished && combat.turn === "enemy" && player && player.hp > 0) {
    const r = enemyTurn(rng, player, combat);
    const tail = r.combat.log.slice(combat.log.length).map((l) => entry(l.text, kindFor(l.kind)));
    combat = r.combat;
    player = r.player;
    set({
      combat,
      player,
      log: [...get().log, ...tail],
    });
    if (combat.finished) break;
  }
  if (player && player.hp <= 0) {
    set({ phase: "dead" });
  }
  // Notify over-encumbrance warning every now and then.
  if (player && isOverEncumbered(player) && get().log.length % 8 === 0) {
    get().pushLog("You're over-encumbered. Movement is heavier.", "bad");
  }
}
