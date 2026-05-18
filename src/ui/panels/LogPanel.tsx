import { useEffect, useRef } from "react";
import { useGameStore } from "../../state/store";

export function LogPanel() {
  const log = useGameStore((s) => s.log);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [log.length]);

  // We render only the last ~80 entries to keep the DOM light.
  const slice = log.slice(-80);

  return (
    <div className="panel log-panel">
      <h3>Log</h3>
      <div className="log-body scrollable" ref={ref}>
        {slice.map((e) => (
          <p key={e.id} className={`log-line log-${e.kind}`}>
            {e.text}
          </p>
        ))}
      </div>
    </div>
  );
}
