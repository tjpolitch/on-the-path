import { useGameStore } from "../../state/store";

export function DeathScreen() {
  const player = useGameStore((s) => s.player);
  const acceptDeath = useGameStore((s) => s.acceptDeath);
  const log = useGameStore((s) => s.log);
  const lastFew = log.slice(-6);

  return (
    <div className="death-screen">
      <div className="death-inner">
        <h1>The Path Ends</h1>
        <p>
          {player?.name ?? "Your character"} has fallen.
        </p>
        <div className="panel">
          <h3>Last moments</h3>
          {lastFew.map((l) => (
            <p key={l.id} className={`log-line log-${l.kind}`}>
              {l.text}
            </p>
          ))}
        </div>
        <button className="primary" onClick={acceptDeath}>
          Return to title
        </button>
      </div>
    </div>
  );
}
