import type { TimeOfDay, LightLevel, MoonPhase, WorldClock } from "./types";
import { normalSample } from "./dice";
import type { Rng } from "./rng";

// ─── Constants ────────────────────────────────────────────────────────────
const MINUTES_PER_DAY = 1440;

export const TIME_OF_DAY_LABELS: Record<TimeOfDay, string> = {
  midnight: "midnight",
  smallHours: "the small hours",
  earlyMorning: "early morning",
  lateMorning: "late morning",
  midday: "midday",
  earlyAfternoon: "early afternoon",
  lateAfternoon: "late afternoon",
  evening: "evening",
};

export const MOON_LABELS: Record<MoonPhase, string> = {
  new: "new moon",
  waxingCrescent: "waxing crescent",
  firstQuarter: "first quarter",
  waxingGibbous: "waxing gibbous",
  full: "full moon",
  waningGibbous: "waning gibbous",
  lastQuarter: "last quarter",
  waningCrescent: "waning crescent",
};

// ─── Day part ─────────────────────────────────────────────────────────────
// Slices the day into ~3-hour buckets based on a sliding center-of-day at midday (720m).
export function timeOfDay(minutes: number): TimeOfDay {
  // 0..89 / 1350..1439 -> midnight
  if (minutes < 90 || minutes >= 1350) return "midnight";
  if (minutes < 270) return "smallHours";
  if (minutes < 450) return "earlyMorning";
  if (minutes < 630) return "lateMorning";
  if (minutes < 810) return "midday";
  if (minutes < 990) return "earlyAfternoon";
  if (minutes < 1170) return "lateAfternoon";
  return "evening";
}

// ─── Sun/light tables, per month ──────────────────────────────────────────
// Light at each of the 8 time-of-day buckets, per month index 0..11.
// 0 = night, 1 = twilight, 2 = day.
const LIGHT_TABLE: readonly number[][] = [
  [0, 0, 0, 1, 2, 2, 1, 0], // 0 Jan
  [0, 0, 1, 2, 2, 2, 1, 0], // 1 Feb
  [0, 0, 1, 2, 2, 2, 1, 0], // 2 Mar
  [0, 0, 1, 2, 2, 2, 2, 1], // 3 Apr
  [0, 0, 1, 2, 2, 2, 2, 1], // 4 May
  [0, 1, 2, 2, 2, 2, 2, 1], // 5 Jun
  [0, 1, 2, 2, 2, 2, 2, 1], // 6 Jul
  [0, 0, 1, 2, 2, 2, 2, 1], // 7 Aug
  [0, 0, 1, 2, 2, 2, 1, 0], // 8 Sep
  [0, 0, 1, 2, 2, 2, 1, 0], // 9 Oct
  [0, 0, 1, 2, 2, 1, 0, 0], // 10 Nov
  [0, 0, 0, 1, 2, 1, 0, 0], // 11 Dec
];

const TIME_BUCKETS: TimeOfDay[] = [
  "midnight",
  "smallHours",
  "earlyMorning",
  "lateMorning",
  "midday",
  "earlyAfternoon",
  "lateAfternoon",
  "evening",
];

export function lightLevel(month: number, minutes: number): LightLevel {
  const bucket = TIME_BUCKETS.indexOf(timeOfDay(minutes));
  const v = LIGHT_TABLE[month % 12]![bucket]!;
  return v === 0 ? "night" : v === 1 ? "twilight" : "day";
}

// ─── Temperature ─────────────────────────────────────────────────────────
// Average temp by month × time bucket, Polish-ish climate. Used as mu in a normal draw.
const TEMP_TABLE: readonly number[][] = [
  [-2, -3, -5, -1, 1, 1, 0, -1],
  [-2, -3, -5, -1, 1, 1, 2, 0],
  [1, 0, -1, 3, 4, 5, 7, 2],
  [5, 4, 3, 8, 9, 11, 12, 10],
  [13, 11, 8, 15, 16, 17, 18, 16],
  [16, 14, 13, 18, 20, 21, 22, 20],
  [18, 16, 14, 20, 22, 23, 24, 22],
  [17, 15, 13, 19, 21, 22, 23, 21],
  [12, 10, 8, 14, 16, 17, 18, 14],
  [7, 5, 4, 9, 11, 12, 13, 10],
  [2, 1, 0, 4, 5, 6, 7, 4],
  [-2, -3, -4, 0, 1, 2, 1, -1],
];

export function generateTempC(rng: Rng, month: number, minutes: number): number {
  const bucket = TIME_BUCKETS.indexOf(timeOfDay(minutes));
  const mu = TEMP_TABLE[month % 12]![bucket]!;
  return Math.round(normalSample(rng, mu, 3));
}

export function describeTemp(t: number): string {
  if (t < 0) return "freezing";
  if (t < 8) return "cold";
  if (t < 16) return "cool";
  if (t < 24) return "mild";
  if (t < 30) return "warm";
  return "hot";
}

// ─── Moon ─────────────────────────────────────────────────────────────────
export function moonPhase(moonDay: number): MoonPhase {
  // 1..28 cycle. Approximation.
  const d = ((moonDay - 1) % 28) + 1;
  if (d === 1) return "new";
  if (d <= 6) return "waxingCrescent";
  if (d <= 9) return "firstQuarter";
  if (d <= 13) return "waxingGibbous";
  if (d === 14) return "full";
  if (d <= 20) return "waningGibbous";
  if (d <= 23) return "lastQuarter";
  return "waningCrescent";
}

// ─── Advancing time ───────────────────────────────────────────────────────
// Returns a new clock. Note: month rollover at 30 days (we keep it simple).
const DAYS_PER_MONTH = 30;

export function advanceClock(clock: WorldClock, mins: number): WorldClock {
  let { day, minutes, month, moonDay, weather, tempC } = clock;
  minutes += mins;
  while (minutes >= MINUTES_PER_DAY) {
    minutes -= MINUTES_PER_DAY;
    day += 1;
    moonDay = (moonDay % 28) + 1;
    if (day % DAYS_PER_MONTH === 0) {
      month = (month + 1) % 12;
    }
  }
  return { day, minutes, month, moonDay, weather, tempC };
}

export function formatClock(clock: WorldClock): string {
  const h = Math.floor(clock.minutes / 60);
  const m = clock.minutes % 60;
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `Day ${clock.day} — ${hh}:${mm}`;
}
