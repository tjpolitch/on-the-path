import { useGameStore } from "../../state/store";

export function CombatPanel() {
  const combat = useGameStore((s) => s.combat);
  const player = useGameStore((s) => s.player);
  const doAttack = useGameStore((s) => s.doAttack);
  const doFlee = useGameStore((s) => s.doFlee);
  const dismiss = useGameStore((s) => s.dismissCombatScreen);

  if (!combat || !player) return null;
  const e = combat.enemy;
  const t = e.template;
  const hpPct = (e.hp / t.hpMax) * 100;
  const finished = combat.finished;
  const myTurn = combat.turn === "player" && !finished;

  return (
    <div className="panel combat-panel">
      <h3>Combat — Round {combat.round}</h3>

      <div className="combat-enemy">
        <div className="combat-name">
          <strong>{t.name}</strong>
          <span className="muted small"> · {t.threat}</span>
        </div>
        <p className="muted small">{t.description}</p>
        <div className="bar hp">
          <div className="fill" style={{ width: `${Math.max(0, hpPct)}%` }} />
        </div>
        <span className="small">
          {e.hp} / {t.hpMax}
        </span>
      </div>

      {!finished && (
        <>
          <p className="turn-indicator">
            {myTurn ? "Your turn." : "Enemy is acting…"}
          </p>
          <div className="combat-buttons">
            <button onClick={() => doAttack("fast")} disabled={!myTurn} title="+1 to hit, −1 damage. Cheap.">
              Fast Strike
            </button>
            <button onClick={() => doAttack("strong")} disabled={!myTurn} title="−2 to hit, +3 damage. Expensive.">
              Strong Strike
            </button>
            <button onClick={() => doAttack("feint")} disabled={!myTurn} title="+3 to hit, −3 damage. Tricky.">
              Feint
            </button>
            <button onClick={doFlee} disabled={!myTurn} className="danger">
              Flee
            </button>
          </div>
        </>
      )}

      {finished && (
        <div className="combat-finished">
          <p className="muted">
            {combat.outcome === "victory" && "Combat ends in your favor."}
            {combat.outcome === "flee" && "You escape."}
            {combat.outcome === "defeat" && "You have fallen."}
          </p>
          <button className="primary" onClick={dismiss}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
