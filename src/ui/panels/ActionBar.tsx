import { useGameStore } from "../../state/store";
import { tileAt, BIOMES } from "../../engine/world";
import type { Direction } from "../../engine/actions";

export function ActionBar() {
  const doTravel = useGameStore((s) => s.doTravel);
  const doForage = useGameStore((s) => s.doForage);
  const doRest = useGameStore((s) => s.doRest);
  const doEat = useGameStore((s) => s.doEat);
  const world = useGameStore((s) => s.world);
  const pos = useGameStore((s) => s.pos);

  if (!world) return null;
  const here = tileAt(world, pos.x, pos.y);
  const canForage = here ? BIOMES[here].forageDifficulty < 99 : false;

  const dirGrid: (Direction | null)[][] = [
    ["NW", "N", "NE"],
    ["W", "O", "E"],
    ["SW", "S", "SE"],
  ];

  return (
    <div className="panel action-bar">
      <div className="dir-pad">
        {dirGrid.flat().map((d, i) => (
          <button
            key={i}
            onClick={() => d && doTravel(d as Direction)}
            disabled={!d}
            className={d === "O" ? "stay" : "dir"}
            title={
              d === "O" ? "Wait an hour" : d ? `Move ${d}` : ""
            }
          >
            {d === "O" ? "·" : d}
          </button>
        ))}
      </div>
      <div className="action-buttons">
        <button onClick={() => doRest(1)} title="Rest one hour">
          Rest 1h
        </button>
        <button onClick={() => doRest(8)} title="Sleep for the night">
          Sleep 8h
        </button>
        <button onClick={doForage} disabled={!canForage} title="Search the area for food">
          Forage
        </button>
        <button onClick={doEat} title="Eat the first edible item in your inventory">
          Eat
        </button>
      </div>
    </div>
  );
}
