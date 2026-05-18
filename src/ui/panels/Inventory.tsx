import { useGameStore } from "../../state/store";
import { ARMOR } from "../../data/armor";
import { WEAPONS } from "../../data/weapons";

export function Inventory() {
  const player = useGameStore((s) => s.player);
  if (!player) return null;

  const weapon = player.equippedWeaponId ? WEAPONS[player.equippedWeaponId] : undefined;
  const armorPieces = Object.entries(player.equippedArmor)
    .map(([slot, id]) => ({ slot, def: id ? ARMOR[id] : undefined }))
    .filter((x) => x.def);

  return (
    <div className="panel inventory">
      <h3>Equipped</h3>
      <div className="equipped">
        <div className="stat-line">
          <span className="label">Weapon</span>
          <span className="value">{weapon?.name ?? "Unarmed"}</span>
        </div>
        {armorPieces.map((a) => (
          <div className="stat-line" key={a.slot}>
            <span className="label">{a.slot}</span>
            <span className="value">{a.def?.name}</span>
          </div>
        ))}
      </div>

      <h3>Inventory ({player.inventory.length})</h3>
      <div className="inv-list scrollable">
        {player.inventory.length === 0 && (
          <p className="faint small">Your pack is empty.</p>
        )}
        {player.inventory.map((it, i) => (
          <div className="inv-item" key={i} title={it.description}>
            <span className="inv-name">{it.name}</span>
            <span className="inv-weight faint">
              {it.weight}kg
              {it.edible ? " · edible" : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
