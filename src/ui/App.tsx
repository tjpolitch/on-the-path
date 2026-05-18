import { useEffect } from "react";
import { useGameStore } from "../state/store";
import { TitleScreen } from "./screens/TitleScreen";
import { CharacterCreationScreen } from "./screens/CharacterCreationScreen";
import { GameScreen } from "./screens/GameScreen";
import { DeathScreen } from "./screens/DeathScreen";

export function App() {
  const phase = useGameStore((s) => s.phase);

  // On first mount, sniff for autosave so the title screen can offer "Continue".
  // (The actual prompt is in TitleScreen — we just want the store warmed.)
  useEffect(() => {
    /* nothing global yet */
  }, []);

  return (
    <div className="app-root">
      {phase === "title" && <TitleScreen />}
      {phase === "creation" && <CharacterCreationScreen />}
      {phase === "playing" && <GameScreen />}
      {phase === "dead" && <DeathScreen />}
    </div>
  );
}
