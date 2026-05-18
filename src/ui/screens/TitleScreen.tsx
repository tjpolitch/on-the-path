import { useState } from "react";
import { useGameStore } from "../../state/store";
import {
  bundleToJson,
  jsonToBundle,
  listSlots,
  loadAuto,
  loadSlot,
  saveSlot,
  NUM_SLOTS,
  clearSlot,
} from "../../state/persistence";
import type { SaveBundle } from "../../engine/types";

export function TitleScreen() {
  const setPhase = useGameStore((s) => s.setPhase);
  const loadFromState = useGameStore((s) => s.loadFromState);
  const serialize = useGameStore((s) => s.serialize);
  const [showLoad, setShowLoad] = useState(false);
  const [slots, setSlots] = useState<(SaveBundle | null)[]>(() => listSlots());
  const [importErr, setImportErr] = useState<string | null>(null);

  const auto = loadAuto();

  function onContinue() {
    if (!auto) return;
    loadFromState(auto.state, "playing");
  }

  function onLoadSlot(i: number) {
    const b = loadSlot(i);
    if (!b) return;
    loadFromState(b.state, "playing");
  }

  function onSaveToSlot(i: number) {
    const s = serialize();
    if (!s) return;
    const label = prompt("Name this save:", `Save ${i + 1}`) ?? `Save ${i + 1}`;
    saveSlot(i, s, label);
    setSlots(listSlots());
  }

  function onClearSlot(i: number) {
    if (!confirm(`Delete save in slot ${i + 1}?`)) return;
    clearSlot(i);
    setSlots(listSlots());
  }

  function onExport(b: SaveBundle) {
    const blob = new Blob([bundleToJson(b)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `on-the-path-save-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    setImportErr(null);
    const f = e.target.files?.[0];
    if (!f) return;
    f.text()
      .then((txt) => {
        const b = jsonToBundle(txt);
        if (!b) {
          setImportErr("Not a valid save file.");
          return;
        }
        loadFromState(b.state, "playing");
      })
      .catch(() => setImportErr("Failed to read file."));
  }

  return (
    <div className="title-screen">
      <div className="title-inner">
        <h1>On the Path</h1>
        <p className="muted">A Witcher-inspired RPG &amp; adventure simulator</p>

        <div className="title-menu">
          <button className="primary" onClick={() => setPhase("creation")}>
            New Game
          </button>
          {auto && (
            <button onClick={onContinue}>
              Continue <span className="faint">— {formatTime(auto.savedAt)}</span>
            </button>
          )}
          <button onClick={() => setShowLoad((v) => !v)}>
            {showLoad ? "Hide Saves" : "Load / Manage Saves"}
          </button>
        </div>

        {showLoad && (
          <div className="save-panel">
            <h3>Save Slots</h3>
            {Array.from({ length: NUM_SLOTS }, (_, i) => {
              const b = slots[i];
              return (
                <div key={i} className="save-slot">
                  <div className="save-info">
                    <strong>Slot {i + 1}</strong>{" "}
                    {b ? (
                      <span className="muted">
                        — {b.label} ({formatTime(b.savedAt)})
                      </span>
                    ) : (
                      <span className="faint">— empty</span>
                    )}
                  </div>
                  <div className="save-actions">
                    {b && <button onClick={() => onLoadSlot(i)}>Load</button>}
                    {b && <button onClick={() => onExport(b)}>Export</button>}
                    <button onClick={() => onSaveToSlot(i)} disabled={!serialize()}>
                      Save here
                    </button>
                    {b && (
                      <button className="danger" onClick={() => onClearSlot(i)}>
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            <h3>Import JSON</h3>
            <input type="file" accept="application/json" onChange={onImport} />
            {importErr && <p className="error">{importErr}</p>}
          </div>
        )}

        <p className="faint signature">
          Built with the systems of the Witcher TTRPG in mind, freely adapted.
        </p>
      </div>
    </div>
  );
}

function formatTime(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleString();
}
