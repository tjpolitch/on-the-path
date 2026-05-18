import { useGameStore } from "../../state/store";
import { BIOMES } from "../../engine/world";

const RADIUS = 7;

export function Minimap() {
  const world = useGameStore((s) => s.world);
  const pos = useGameStore((s) => s.pos);
  if (!world) return null;

  const size = RADIUS * 2 + 1;
  const cells: { x: number; y: number; biome: string | null }[] = [];
  for (let dy = -RADIUS; dy <= RADIUS; dy++) {
    for (let dx = -RADIUS; dx <= RADIUS; dx++) {
      const x = pos.x + dx;
      const y = pos.y + dy;
      if (x < 0 || y < 0 || x >= world.width || y >= world.height) {
        cells.push({ x, y, biome: null });
      } else {
        cells.push({ x, y, biome: world.tiles[y * world.width + x] ?? null });
      }
    }
  }

  return (
    <div className="panel minimap">
      <h3>Surroundings</h3>
      <div
        className="minimap-grid"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
        }}
      >
        {cells.map((c, i) => {
          const isHere = c.x === pos.x && c.y === pos.y;
          const def = c.biome ? BIOMES[c.biome as keyof typeof BIOMES] : null;
          return (
            <div
              key={i}
              className={`minimap-cell${isHere ? " here" : ""}${def?.passable === false ? " impassable" : ""}`}
              style={{
                background: def ? def.color : "transparent",
                color: getContrast(def?.color ?? "#000"),
              }}
              title={def ? `${def.label} (${c.x},${c.y})` : "—"}
            >
              {isHere ? "@" : def ? def.glyph : " "}
            </div>
          );
        })}
      </div>
      <p className="legend faint small">
        @ = you · ♣ forest · · plains · ∩ hills · ▲ mountain · ≈ swamp · ~ river · = road · ▣ town
      </p>
    </div>
  );
}

// Very rough luminance check for choosing a readable glyph color.
function getContrast(hex: string): string {
  const h = hex.replace("#", "");
  if (h.length !== 6) return "#fff";
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.55 ? "#1a1612" : "#e8dec6";
}
