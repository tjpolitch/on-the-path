import { useGameStore } from "../../state/store";
import { CLASSES } from "../../data/classes";
import {
  deriveEncumbrance,
  inventoryWeight,
} from "../../engine/character";
import { SKILL_KEYS, SKILL_LABELS, STAT_KEYS, STAT_LABELS } from "../../engine/types";
import { useState } from "react";

export function CharacterSheet() {
  const player = useGameStore((s) => s.player);
  const [showSkills, setShowSkills] = useState(false);
  if (!player) return null;

  const klass = CLASSES[player.classKey];
  const enc = deriveEncumbrance(player.stats);
  const wt = inventoryWeight(player);

  return (
    <div className="panel character-sheet">
      <h3>{player.name}</h3>
      <p className="muted small">{klass.name} · {player.crowns} crowns</p>

      <Bar label="HP" cur={player.hp} max={player.hpMax} kind="hp" />
      <Bar label="Stamina" cur={player.stamina} max={player.staminaMax} kind="stamina" />
      <div className="stat-line">
        <span className="label">XP</span>
        <span className="value">{player.xp}</span>
      </div>
      <div className="stat-line">
        <span className="label">Encumbrance</span>
        <span className={wt > enc ? "value danger" : "value"}>
          {wt} / {enc}
        </span>
      </div>
      <div className="stat-line">
        <span className="label">Status</span>
        <span className="value">
          {player.hungry ? "Hungry " : ""}
          {!player.rested ? "Weary " : ""}
          {!player.hungry && player.rested ? "Steady" : ""}
        </span>
      </div>

      <h3 style={{ marginTop: 10 }}>Stats</h3>
      <div className="stat-grid-2col">
        {STAT_KEYS.map((k) => (
          <div className="stat-line" key={k}>
            <span className="label">{STAT_LABELS[k]}</span>
            <span className="value">{player.stats[k]}</span>
          </div>
        ))}
      </div>

      <button className="link-button" onClick={() => setShowSkills((v) => !v)}>
        {showSkills ? "Hide skills" : "Show skills"}
      </button>
      {showSkills && (
        <div className="stat-grid-2col">
          {SKILL_KEYS.map((k) => (
            <div className="stat-line" key={k}>
              <span className="label">{SKILL_LABELS[k]}</span>
              <span className="value">{player.skills[k]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Bar({ label, cur, max, kind }: { label: string; cur: number; max: number; kind: "hp" | "stamina" }) {
  const pct = Math.max(0, Math.min(100, (cur / Math.max(1, max)) * 100));
  return (
    <div style={{ marginBottom: 6 }}>
      <div className="stat-line">
        <span className="label">{label}</span>
        <span className="value">
          {cur} / {max}
        </span>
      </div>
      <div className={`bar ${kind}`}>
        <div className="fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
