import type { SaveBundle, SerializedGameState } from "../engine/types";

const STORAGE_VERSION = 1;
const AUTO_SAVE_KEY = "otp:autosave";
const SLOT_KEYS = ["otp:slot1", "otp:slot2", "otp:slot3"];
export const NUM_SLOTS = SLOT_KEYS.length;

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, val: string) {
  try {
    localStorage.setItem(key, val);
  } catch {
    // Quota or disabled storage. Silently noop.
  }
}
function safeRemove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function makeBundle(state: SerializedGameState, label: string): SaveBundle {
  return { version: STORAGE_VERSION, savedAt: Date.now(), label, state };
}

export function saveAuto(state: SerializedGameState) {
  const b = makeBundle(state, "Autosave");
  safeSet(AUTO_SAVE_KEY, JSON.stringify(b));
}

export function loadAuto(): SaveBundle | null {
  const raw = safeGet(AUTO_SAVE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SaveBundle;
    if (parsed.version !== STORAGE_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveSlot(slot: number, state: SerializedGameState, label: string) {
  const k = SLOT_KEYS[slot];
  if (!k) return;
  const b = makeBundle(state, label);
  safeSet(k, JSON.stringify(b));
}

export function loadSlot(slot: number): SaveBundle | null {
  const k = SLOT_KEYS[slot];
  if (!k) return null;
  const raw = safeGet(k);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SaveBundle;
    if (parsed.version !== STORAGE_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearSlot(slot: number) {
  const k = SLOT_KEYS[slot];
  if (!k) return;
  safeRemove(k);
}

export function clearAuto() {
  safeRemove(AUTO_SAVE_KEY);
}

export function listSlots(): (SaveBundle | null)[] {
  return SLOT_KEYS.map((_, i) => loadSlot(i));
}

// JSON export/import for backup.
export function bundleToJson(bundle: SaveBundle): string {
  return JSON.stringify(bundle, null, 2);
}

export function jsonToBundle(json: string): SaveBundle | null {
  try {
    const parsed = JSON.parse(json) as SaveBundle;
    if (typeof parsed.version !== "number" || !parsed.state) return null;
    return parsed;
  } catch {
    return null;
  }
}
