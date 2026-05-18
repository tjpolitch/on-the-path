import { useState } from "react";
import { useGameStore } from "../../state/store";
import { descriptionOfStock, nameOfStock } from "../../engine/towns";
import type { StockEntry } from "../../engine/types";

type Tab = "inn" | "merchant" | "healer" | "notice";

export function TownPanel() {
  const player = useGameStore((s) => s.player);
  const town = useGameStore((s) => s.currentTown());
  const leaveTown = useGameStore((s) => s.leaveTown);
  const [tab, setTab] = useState<Tab>("inn");

  if (!player || !town) return null;

  return (
    <div className="panel town-panel">
      <header className="town-header">
        <div>
          <h3>{town.name}</h3>
          <p className="muted small">{town.blurb}</p>
        </div>
        <button onClick={leaveTown}>Leave Town</button>
      </header>

      <div className="town-tabs">
        <TabBtn current={tab} value="inn" onClick={setTab}>
          Inn
        </TabBtn>
        <TabBtn current={tab} value="merchant" onClick={setTab}>
          Merchant
        </TabBtn>
        <TabBtn current={tab} value="healer" onClick={setTab}>
          Healer
        </TabBtn>
        <TabBtn current={tab} value="notice" onClick={setTab}>
          Notice Board
        </TabBtn>
      </div>

      <div className="town-body">
        {tab === "inn" && <InnTab />}
        {tab === "merchant" && <MerchantTab />}
        {tab === "healer" && <HealerTab />}
        {tab === "notice" && <NoticeBoardTab />}
      </div>
    </div>
  );
}

function TabBtn({
  current,
  value,
  onClick,
  children,
}: {
  current: Tab;
  value: Tab;
  onClick: (t: Tab) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={() => onClick(value)}
      className={current === value ? "town-tab active" : "town-tab"}
    >
      {children}
    </button>
  );
}

// ─── Inn ──────────────────────────────────────────────────────────────────
function InnTab() {
  const player = useGameStore((s) => s.player);
  const town = useGameStore((s) => s.currentTown());
  const doStayInn = useGameStore((s) => s.doStayInn);
  if (!player || !town) return null;
  const canAfford = player.crowns >= town.innCostPerNight;
  return (
    <div className="tab-inn">
      <p>
        A warm bed, a bowl of stew, and the door barred against the night —
        {" "}<strong>{town.innCostPerNight} crowns</strong>.
      </p>
      <p className="muted small">
        Sleeping at the inn fully restores your HP and stamina, clears hunger,
        and rests you for the road.
      </p>
      <button className="primary" onClick={doStayInn} disabled={!canAfford}>
        Pay {town.innCostPerNight} crowns &amp; sleep (8h)
      </button>
      {!canAfford && (
        <p className="error small">
          You don't have {town.innCostPerNight} crowns. (You have {player.crowns}.)
        </p>
      )}
    </div>
  );
}

// ─── Healer ───────────────────────────────────────────────────────────────
function HealerTab() {
  const player = useGameStore((s) => s.player);
  const town = useGameStore((s) => s.currentTown());
  const doVisitHealer = useGameStore((s) => s.doVisitHealer);
  if (!player || !town) return null;
  const missing = player.hpMax - player.hp;
  const fullCost = missing * town.healerCostPerHp;
  const affordable = Math.floor(player.crowns / town.healerCostPerHp);
  const willHeal = Math.min(missing, affordable);
  const willCost = willHeal * town.healerCostPerHp;
  return (
    <div className="tab-healer">
      <p>
        A weathered physician examines you. They charge{" "}
        <strong>{town.healerCostPerHp} crowns per wound.</strong>
      </p>
      <div className="loadout-line">
        <span className="label">HP</span>
        <span className="value">
          {player.hp} / {player.hpMax}
        </span>
      </div>
      <div className="loadout-line">
        <span className="label">Cost to fully heal</span>
        <span className="value">{fullCost} crowns</span>
      </div>
      <div className="loadout-line">
        <span className="label">You can afford</span>
        <span className="value">
          {willHeal} HP for {willCost} crowns
        </span>
      </div>
      <button
        className="primary"
        onClick={doVisitHealer}
        disabled={missing <= 0 || affordable <= 0}
      >
        {missing <= 0 ? "Already at full HP" : `Heal for ${willCost} crowns`}
      </button>
    </div>
  );
}

// ─── Merchant ─────────────────────────────────────────────────────────────
function MerchantTab() {
  const player = useGameStore((s) => s.player);
  const town = useGameStore((s) => s.currentTown());
  const doBuy = useGameStore((s) => s.doBuy);
  const doSellItem = useGameStore((s) => s.doSellItem);
  if (!player || !town) return null;
  const stock = town.merchant.stock;

  return (
    <div className="tab-merchant">
      <div className="merchant-meta muted small">
        Crowns: <strong>{player.crowns}</strong> · Buy markup ×
        {town.merchant.buyMarkup} · Sell discount ×{town.merchant.sellDiscount}
      </div>

      <div className="merchant-grid">
        <section className="merchant-col">
          <h3>Shop Inventory</h3>
          {stock.length === 0 && <p className="faint small">Nothing left to sell today.</p>}
          {stock.map((entry, i) => (
            <StockRow
              key={i}
              entry={entry}
              canAfford={player.crowns >= entry.price && entry.count > 0}
              onBuy={() => doBuy(i)}
            />
          ))}
        </section>

        <section className="merchant-col">
          <h3>Your Pack ({player.inventory.length})</h3>
          {player.inventory.length === 0 && (
            <p className="faint small">You have nothing to sell.</p>
          )}
          {player.inventory.map((it, i) => {
            const sellPrice = Math.max(
              1,
              Math.round(it.value * town.merchant.sellDiscount),
            );
            return (
              <div className="sell-row" key={i} title={it.description}>
                <div className="sell-info">
                  <span className="sell-name">{it.name}</span>
                  <span className="sell-meta faint">
                    {it.weight}kg · worth {sellPrice}
                  </span>
                </div>
                <button onClick={() => doSellItem(i)}>Sell ({sellPrice})</button>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}

function StockRow({
  entry,
  canAfford,
  onBuy,
}: {
  entry: StockEntry;
  canAfford: boolean;
  onBuy: () => void;
}) {
  return (
    <div className="stock-row" title={descriptionOfStock(entry)}>
      <div className="stock-info">
        <span className="stock-name">
          {nameOfStock(entry)}
          {entry.count > 1 && <span className="muted small"> ×{entry.count}</span>}
        </span>
        <span className="stock-kind faint">{entry.kind}</span>
      </div>
      <button onClick={onBuy} disabled={!canAfford} className={canAfford ? "primary" : ""}>
        Buy ({entry.price})
      </button>
    </div>
  );
}

// ─── Notice board (stub) ──────────────────────────────────────────────────
function NoticeBoardTab() {
  return (
    <div className="tab-notice">
      <p>
        A weathered notice board stands in the square. Today, no fresh notices —
        only the curling edges of old proclamations and an advertisement for someone's
        missing cow.
      </p>
      <p className="muted small">
        (Contracts and quests will appear here in a later build.)
      </p>
    </div>
  );
}
