import { useMemo, useState } from "react";
import { CLASSES, CLASS_LIST } from "../../data/classes";
import {
  buildCharacter,
  finalStats,
  newCreationDraft,
  pointsRemaining,
  POINT_BUY_BUDGET,
  STAT_MAX,
  STAT_MIN,
} from "../../engine/character";
import { STAT_KEYS, STAT_LABELS } from "../../engine/types";
import type { StatKey } from "../../engine/types";
import { useGameStore } from "../../state/store";

export function CharacterCreationScreen() {
  const [draft, setDraft] = useState(newCreationDraft);
  const startNewGame = useGameStore((s) => s.startNewGame);
  const setPhase = useGameStore((s) => s.setPhase);

  const remaining = pointsRemaining(draft.baseStats);
  const klass = CLASSES[draft.classKey];

  const computed = useMemo(() => finalStats(draft), [draft]);

  function adjust(k: StatKey, delta: number) {
    const cur = draft.baseStats[k];
    const next = cur + delta;
    if (next < STAT_MIN || next > STAT_MAX) return;
    if (delta > 0 && remaining <= 0) return;
    setDraft({ ...draft, baseStats: { ...draft.baseStats, [k]: next } });
  }

  function onBegin() {
    if (draft.name.trim().length === 0) return;
    const player = buildCharacter(draft);
    startNewGame(player);
  }

  return (
    <div className="creation-screen">
      <div className="creation-inner">
        <header>
          <h1>Forge a Character</h1>
          <p className="muted">
            Pick a calling, distribute {POINT_BUY_BUDGET} points among your stats, and
            name yourself. The Path awaits.
          </p>
        </header>

        <div className="creation-grid">
          <section className="panel">
            <h3>Name</h3>
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              maxLength={32}
              placeholder="Your character's name"
            />

            <h3 style={{ marginTop: 16 }}>Class</h3>
            <div className="class-list">
              {CLASS_LIST.map((c) => (
                <button
                  key={c.key}
                  className={c.key === draft.classKey ? "class-card active" : "class-card"}
                  onClick={() => setDraft({ ...draft, classKey: c.key })}
                >
                  <strong>{c.name}</strong>
                  <p className="muted">{c.blurb}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="creation-stats-header">
              <h3>Stats</h3>
              <span className={remaining === 0 ? "muted" : "value"}>
                {remaining} / {POINT_BUY_BUDGET} points remaining
              </span>
            </div>
            <p className="faint">
              Base values can go {STAT_MIN}–{STAT_MAX}. Your {klass.name} starts with class bonuses
              applied on top.
            </p>
            <div className="stat-grid">
              {STAT_KEYS.map((k) => {
                const base = draft.baseStats[k];
                const bonus = klass.statBonus[k] ?? 0;
                const total = computed[k];
                return (
                  <div key={k} className="stat-row">
                    <div className="stat-name">{STAT_LABELS[k]}</div>
                    <div className="stat-buttons">
                      <button onClick={() => adjust(k, -1)} disabled={base <= STAT_MIN}>
                        −
                      </button>
                      <span className="stat-value">{base}</span>
                      <button
                        onClick={() => adjust(k, 1)}
                        disabled={base >= STAT_MAX || remaining <= 0}
                      >
                        +
                      </button>
                    </div>
                    <div className="stat-bonus faint">
                      {bonus > 0 ? `+${bonus} bonus → ${total}` : `→ ${total}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="panel preview">
            <h3>Starting Loadout</h3>
            <div className="loadout-line">
              <span className="label">Weapon</span>
              <span className="value">{labelWeapon(klass.startingWeaponId)}</span>
            </div>
            <div className="loadout-line">
              <span className="label">Armor</span>
              <span className="value">
                {(klass.startingArmorIds ?? []).map(labelArmor).join(", ") || "None"}
              </span>
            </div>
            <div className="loadout-line">
              <span className="label">Items</span>
              <span className="value">{klass.startingItemIds.map(labelItem).join(", ")}</span>
            </div>
            <div className="loadout-line">
              <span className="label">Crowns</span>
              <span className="value">{klass.startingCrowns}</span>
            </div>
          </section>
        </div>

        <footer className="creation-footer">
          <button onClick={() => setPhase("title")}>Back</button>
          <button
            className="primary"
            onClick={onBegin}
            disabled={draft.name.trim().length === 0}
          >
            Begin
          </button>
        </footer>
      </div>
    </div>
  );
}

// Tiny labelers — keep the import surface clean.
import { WEAPONS } from "../../data/weapons";
import { ARMOR } from "../../data/armor";
import { ITEMS } from "../../data/items";

function labelWeapon(id?: string): string {
  if (!id) return "Unarmed";
  return WEAPONS[id]?.name ?? id;
}
function labelArmor(id: string): string {
  return ARMOR[id]?.name ?? id;
}
function labelItem(id: string): string {
  return ITEMS[id]?.name ?? id;
}
