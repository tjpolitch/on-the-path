import { useGameStore } from "../../state/store";
import { CharacterSheet } from "../panels/CharacterSheet";
import { Minimap } from "../panels/Minimap";
import { LogPanel } from "../panels/LogPanel";
import { Inventory } from "../panels/Inventory";
import { ActionBar } from "../panels/ActionBar";
import { CombatPanel } from "../panels/CombatPanel";
import { WorldHeader } from "../panels/WorldHeader";
import { TownPanel } from "../panels/TownPanel";

export function GameScreen() {
  const combat = useGameStore((s) => s.combat);
  const inTown = useGameStore((s) => s.currentTownId != null);
  const abandon = useGameStore((s) => s.abandon);

  // Priority: combat overrides everything else, then town, then normal travel.
  let bottomPanel: React.ReactNode;
  if (combat) bottomPanel = <CombatPanel />;
  else if (inTown) bottomPanel = <TownPanel />;
  else bottomPanel = <ActionBar />;

  return (
    <div className="game-screen">
      <header className="game-header">
        <h2>On the Path</h2>
        <WorldHeader />
        <button onClick={abandon} title="Quit to title (autosave is preserved)">
          Quit
        </button>
      </header>

      <main className="game-main">
        <aside className="left-col">
          <CharacterSheet />
          <Minimap />
        </aside>

        <section className="center-col">
          <LogPanel />
          {bottomPanel}
        </section>

        <aside className="right-col">
          <Inventory />
        </aside>
      </main>
    </div>
  );
}
