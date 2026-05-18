import { useGameStore } from "../../state/store";
import { describeTemp, formatClock, lightLevel, moonPhase, MOON_LABELS } from "../../engine/time";
import { describeWeather } from "../../engine/weather";
import { BIOMES, tileAt } from "../../engine/world";

export function WorldHeader() {
  const clock = useGameStore((s) => s.clock);
  const world = useGameStore((s) => s.world);
  const pos = useGameStore((s) => s.pos);
  if (!clock || !world) return null;

  const light = lightLevel(clock.month, clock.minutes);
  const moon = MOON_LABELS[moonPhase(clock.moonDay)];
  const biome = tileAt(world, pos.x, pos.y);
  const terrain = biome ? BIOMES[biome].label : "—";

  return (
    <div className="world-header">
      <span className="chip">{formatClock(clock)}</span>
      <span className="chip">{light}</span>
      <span className="chip">{describeTemp(clock.tempC)} · {clock.tempC}°C</span>
      <span className="chip">{describeWeather(clock)}</span>
      <span className="chip">{moon}</span>
      <span className="chip terrain">{terrain}</span>
      <span className="chip faint">({pos.x}, {pos.y})</span>
    </div>
  );
}
