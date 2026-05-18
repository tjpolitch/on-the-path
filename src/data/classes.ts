import type { CharClass, CharClassKey } from "../engine/types";

export const CLASSES: Record<CharClassKey, CharClass> = {
  witcher: {
    key: "witcher",
    name: "Witcher",
    blurb:
      "A monster-slayer marked by mutagens — fast, hardy, an outcast. Trained for the Path.",
    statBonus: { ref: 2, dex: 2, body: 1, wil: 1 },
    skillBonus: {
      swordsmanship: 3,
      dodge: 2,
      monsterLore: 3,
      alchemy: 2,
      awareness: 2,
    },
    startingItemIds: ["medicinalHerbs", "ration", "whetstone"],
    startingWeaponId: "witcherSteel",
    startingArmorIds: ["paddedCap", "leatherCuirass", "paddedTrousers"],
    startingCrowns: 50,
  },
  warrior: {
    key: "warrior",
    name: "Man-at-Arms",
    blurb:
      "A trained soldier. You hit harder, you hold the line, you're built for steel and shouting.",
    statBonus: { body: 3, ref: 1, wil: 1 },
    skillBonus: {
      swordsmanship: 2,
      brawling: 2,
      athletics: 2,
      intimidation: 1,
    },
    startingItemIds: ["ration", "ration"],
    startingWeaponId: "longSword",
    startingArmorIds: ["ironHelm", "gambeson", "paddedTrousers"],
    startingCrowns: 30,
  },
  bard: {
    key: "bard",
    name: "Bard",
    blurb: "Lute, lies, and a knack for being the smartest person in a tavern.",
    statBonus: { emp: 3, int: 1, dex: 1, luc: 1 },
    skillBonus: {
      persuasion: 3,
      smallBlades: 1,
      awareness: 2,
      stealth: 1,
    },
    startingItemIds: ["ration", "berries"],
    startingWeaponId: "dagger",
    startingArmorIds: ["travelersHood", "travelersBreeches"],
    startingCrowns: 80,
  },
  mage: {
    key: "mage",
    name: "Mage",
    blurb:
      "A practitioner of the Art. Your spellcasting is real and dangerous (in a later build, anyway).",
    statBonus: { int: 3, wil: 2, emp: 1 },
    skillBonus: {
      spellcasting: 3,
      monsterLore: 2,
      alchemy: 2,
      awareness: 1,
    },
    startingItemIds: ["medicinalHerbs", "ration"],
    startingWeaponId: "quarterstaff",
    startingArmorIds: ["travelersHood", "travelersBreeches"],
    startingCrowns: 60,
  },
  physician: {
    key: "physician",
    name: "Physician",
    blurb: "A healer of bones, wounds, and other people's bad decisions.",
    statBonus: { int: 2, cra: 2, emp: 2 },
    skillBonus: {
      firstAid: 3,
      alchemy: 2,
      awareness: 1,
      persuasion: 1,
    },
    startingItemIds: ["medicinalHerbs", "medicinalHerbs", "ration"],
    startingWeaponId: "dagger",
    startingArmorIds: ["travelersHood", "travelersBreeches"],
    startingCrowns: 70,
  },
  scoundrel: {
    key: "scoundrel",
    name: "Scoundrel",
    blurb: "A thief, a cutpurse, a survivor of every kind of bad neighborhood.",
    statBonus: { dex: 2, ref: 2, luc: 2 },
    skillBonus: {
      smallBlades: 2,
      stealth: 3,
      dodge: 2,
      awareness: 1,
    },
    startingItemIds: ["staleBread", "staleBread"],
    startingWeaponId: "shortSword",
    startingArmorIds: ["travelersHood", "gambeson", "travelersBreeches"],
    startingCrowns: 25,
  },
};

export const CLASS_LIST: CharClass[] = Object.values(CLASSES);
