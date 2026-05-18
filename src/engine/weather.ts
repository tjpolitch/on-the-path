import type { Weather, WorldClock } from "./types";
import { type Rng, weightedPick } from "./rng";

// Weather choice is biased by month + previous weather (slight inertia).
// We don't model fronts or anything; just a believable rotation.

const SUMMER_WEIGHTS: Record<Weather, number> = {
  clear: 35,
  cloudy: 25,
  overcast: 10,
  rain: 10,
  storm: 5,
  snow: 0,
  fog: 5,
};

const WINTER_WEIGHTS: Record<Weather, number> = {
  clear: 15,
  cloudy: 20,
  overcast: 25,
  rain: 5,
  storm: 0,
  snow: 25,
  fog: 10,
};

const SHOULDER_WEIGHTS: Record<Weather, number> = {
  clear: 25,
  cloudy: 25,
  overcast: 15,
  rain: 15,
  storm: 5,
  snow: 5,
  fog: 10,
};

const WEATHERS: Weather[] = [
  "clear",
  "cloudy",
  "overcast",
  "rain",
  "storm",
  "snow",
  "fog",
];

function weightsForMonth(month: number): Record<Weather, number> {
  // 0..11: Dec/Jan/Feb = winter, Jun/Jul/Aug = summer, else shoulder.
  if (month === 11 || month === 0 || month === 1) return { ...WINTER_WEIGHTS };
  if (month >= 5 && month <= 7) return { ...SUMMER_WEIGHTS };
  return { ...SHOULDER_WEIGHTS };
}

export function rollWeather(rng: Rng, prev: Weather, month: number): Weather {
  const w = weightsForMonth(month);
  // Inertia: prior weather is 2x more likely to continue.
  w[prev] = Math.round(w[prev] * 2);
  // Drop snow in non-cold months.
  if (month >= 3 && month <= 9) w.snow = 0;
  // Constrain temps to keep storms rare.
  return weightedPick(rng, WEATHERS, WEATHERS.map((k) => w[k]));
}

export function describeWeather(c: WorldClock): string {
  switch (c.weather) {
    case "clear":
      return "clear skies";
    case "cloudy":
      return "scattered clouds";
    case "overcast":
      return "overcast";
    case "rain":
      return "steady rain";
    case "storm":
      return "thunderstorm";
    case "snow":
      return "falling snow";
    case "fog":
      return "thick fog";
  }
}
