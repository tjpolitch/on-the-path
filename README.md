# On the Path

A browser-based, Witcher-inspired RPG and adventure simulator. Rewrite of the original `script.js` prototype using React + TypeScript + Vite.

## Running locally

```bash
npm install
npm run dev
```

Open whatever URL Vite prints (typically <http://localhost:5173>).

To produce a production bundle:

```bash
npm run build
npm run preview
```

To just typecheck:

```bash
npm run typecheck
```

## What's implemented

- **Character creation** — name, six classes (Witcher, Man-at-Arms, Bard, Mage, Physician, Scoundrel), point-buy stats (3–9 each, 30-point budget), automatic class bonuses, starting loadout preview.
- **Travel & world map** — 40×40 procedural world with biome blobs (forest, plains, hills, mountains, swamp), rivers, roads, and towns. 8-directional movement + wait. Surroundings minimap.
- **Time / weather / light** — minute-precise clock, day/night based on month, temperature pulled from a normal distribution around month-specific means, weather rotation with seasonal weighting, 28-day lunar cycle.
- **Foraging** — wilderness skill checks against biome difficulty; success yields 1–3 weighted items.
- **Hunger / starvation / fatigue** — stamina drains over time, hunger sets in after 14h since last meal, starvation drains HP if you're empty and hungry.
- **Combat** — exploding d10 attacks, hit-location chart with damage multipliers, fast/strong/feint styles, armor stopping power, flee attempts, victory loot + XP + crowns.
- **Persistence** — autosave (debounced) plus three manual save slots in localStorage, JSON export/import for backups.

## What's stubbed / future work

- **Alchemy & potions** — the data hooks exist (herbs are forageable, Alchemy is a skill) but there's no brewing UI yet.
- **NPCs, towns, quests** — towns appear on the map but are flavor only. The engine is structured to plug a dialogue/quest system in later.
- **Spells** — the Spellcasting skill exists; no spell list yet.
- **Inventory management** — drop, sort, equip-from-inventory UIs are not wired (only the equipped slots and a read-only list).

## Architecture

```
src/
  engine/      Pure game logic. No React. Fully typed. Testable in isolation.
    rng.ts       Seedable PRNG + helpers
    dice.ts      Exploding d10, damage rolls, normal sample
    time.ts      Clock, day-part, light, moon, temperature tables
    weather.ts   Seasonal weather rotation
    world.ts     Biomes + procedural map generation
    character.ts Stats, skills, derived values, char creation pipeline
    combat.ts    Initiative, attack styles, hit location, loot
    actions.ts   Travel, forage, rest, eat, hunger/fatigue effects
    types.ts     All shared types
  data/        Static data tables (items, weapons, armor, enemies, classes).
  state/       Zustand store + localStorage persistence.
  ui/          React components.
    App.tsx
    screens/   TitleScreen, CharacterCreationScreen, GameScreen, DeathScreen
    panels/    CharacterSheet, Minimap, LogPanel, ActionBar, CombatPanel, Inventory, WorldHeader
  styles/      Global + screen-specific CSS.
```

### Design principles

1. **Pure engine, thin store, dumb UI.** Engine modules are pure functions of inputs → outputs. The Zustand store sequences them and applies side effects (autosave, log writes). React components only read state and call store actions.
2. **All data is referenced by id.** Weapons, armor, items, enemies, classes live in `src/data/` keyed by string id. Characters hold ids, not deep copies. This keeps save files small and lets the data tables grow without breaking saves.
3. **Seeded RNG.** The PRNG is seeded per save, so worlds (and any future deterministic re-runs) are reproducible.
4. **Save schema is versioned.** `SaveBundle.version` lets us migrate between releases.

## The legacy/ folder

The original single-file prototype is preserved under `legacy/`. It's not used by the build — kept for reference.
