class Armor {
  constructor(
    name,
    description,
    armorType, // head, torso, leg, shield, set
    stoppingPower,
    rarity,
    armorEnhancements,
    effect,
    encumbranceValue,
    weight,
    value
  ) {
    this.name = name;
    this.description = description;
    this.armorType = armorType;
    this.stoppingPower = stoppingPower;
    this.rarity = rarity;
    this.armorEnhancements = armorEnhancements;
    this.effect = effect;
    this.encumbranceValue = encumbranceValue;
    this.weight = weight;
    this.value = value;
  }
}

const verdenArchersHood = new Armor(
  "Verden Archer's Hood", // name
  "A lightweight hood favored by archers in the Verden region.", //description
  "head", // armorType
  3, // stoppingPower
  99, //rarity
  null, // armorEnhancements
  null, // effect
  0, // encumbranceValue
  0.5, // weight
  100 // value
);

const doubleWovenHood = new Armor(
  "Double Woven Hood", // name
  "A reinforced woven hood offering light protection.", //description
  "head", // armorType
  5, // stoppingPower
  99, //rarity
  null, // armorEnhancements
  null, // effect
  0, // encumbranceValue
  1, // weight
  175 // value
);

const gambeson = new Armor(
  "Gambeson", // name
  "A quilted garment providing basic protection against blunt and slashing attacks.", // description
  "torso", // armorType (assuming the armor covers the torso)
  3, // stoppingPower
  99, // rarity
  null, // armorEnhancements
  null, // effect
  0, // encumbranceValue
  1, // weight
  100 // value
);

const aedirnianGambeson = new Armor(
  "Aedirnian Gambeson", // name
  "A quilted garment providing basic protection against blunt and slashing attacks. The Aedirnian style offers additonal protection.", // description
  "torso", // armorType (assuming the armor covers the torso)
  5, // stoppingPower
  99, // rarity
  null, // armorEnhancements
  null, // effect
  0, // encumbranceValue
  1.5, // weight
  175 // value
);

const paddedTrousers = new Armor(
  "Padded Trousers", // name
  "Thick trousers lined with padding for additional protection.", // description
  "legs", // armorType (assuming the armor covers the legs)
  5, // stoppingPower
  99, // rarity
  null, // armorEnhancements
  null, // effect
  0, // encumbranceValue
  1, // weight
  125 // value
);

class Weapon {
  constructor(
    name,
    description,
    damageType,
    weaponAccuracy,
    rarity,
    damage,
    reliability,
    handsRequired,
    range,
    effect,
    concealment,
    enhancements,
    weight,
    value
  ) {
    this.name = name;
    this.description = description;
    this.type = damageType;
    this.weaponAccuracy = weaponAccuracy;
    this.rarity = rarity;
    this.damage = damage;
    this.reliability = reliability;
    this.handsRequired = handsRequired;
    this.range = range;
    this.effect = effect;
    this.concealment = concealment;
    this.enhancements = enhancements;
    this.weight = weight;
    this.value = value;
  }
}

// Create an instance of the Weapon class for the Dagger
const dagger = new Weapon(
  "Dagger", // name
  "Daggers come in all kinds of shapes and sizes but they're always small enough to hide. Everyone carries one, from knights to peasants.", // description
  "slashing/piercing", // damageType
  0, // weaponAccuracy
  99, // rarity
  [1, 6, 2], // damage
  10, // reliability
  1, // handsRequired
  "N/A", // range
  [], // effect
  "small", // concealment
  0, // enhancements
  0.5, // weight
  50 // value
);

// Create an instance of the Weapon class for the Iron Long Sword
const ironLongSword = new Weapon(
  "Iron Long Sword", // name
  "A standard long sword made of iron, suitable for slashing and thrusting attacks.", // description
  "slashing/piercing", // damageType
  0, // weaponAccuracy
  99, // rarity
  [2, 6, 2], // damage
  10, // reliability
  2, // handsRequired
  "N/A", // range
  [], // effect
  "large", // concealment
  0, // enhancements
  1.5, // weight
  160 // value
);

class Character {
  constructor(
    player,
    name,
    intellect,
    empathy,
    reflexes,
    craft,
    dexterity,
    will,
    body,
    luck,
    speed,
    vigor,
    run,
    stun,
    leap,
    hp,
    stamina,
    encumbrance,
    recovery,
    punch,
    kick,
    awareness,
    business,
    deduction,
    education,
    language,
    monsterLore,
    social,
    streetWise,
    tactics,
    teaching,
    wildernessSurvival,
    brawling,
    dodgeEscape,
    melee,
    riding,
    sailing,
    smallBlades,
    staffSpear,
    swordsmanship,
    physique,
    endurance,
    charisma,
    deceit,
    fineArts,
    gambling,
    groomingStyle,
    humanPerception,
    leadership,
    persuasion,
    performance,
    seduction,
    alchemy,
    crafting,
    disguise,
    firstAid,
    forgery,
    pickLock,
    trapCrafting,
    courage,
    hexWeaving,
    intimidation,
    spellCasting,
    resistMagic,
    resistCoercion,
    ritualCrafting,
    languages,
    inventory,
    equippedWeapon,
    equippedArmor,
    armor,
    crowns,
    reputation,
    characterClass,
    xp,
    aSkills,
    bSkills,
    cSkills,
    rested,
    hungry
  ) {
    this.player = player;
    this.name = name;
    this.intellect = intellect;
    this.empathy = empathy;
    this.reflexes = reflexes;
    this.craft = craft;
    this.dexterity = dexterity;
    this.will = will;
    this.body = body;
    this.luck = luck;
    this.speed = speed;
    this.vigor = vigor;
    this.run = run;
    this.stun = stun;
    this.leap = leap;
    this.hp = hp;
    this.stamina = stamina;
    this.encumbrance = encumbrance;
    this.recovery = recovery;
    this.punch = punch;
    this.kick = kick;
    this.awareness = awareness;
    this.business = business;
    this.deduction = deduction;
    this.education = education;
    this.language = language;
    this.monsterLore = monsterLore;
    this.social = social;
    this.streetWise = streetWise;
    this.tactics = tactics;
    this.teaching = teaching;
    this.wildernessSurvival = wildernessSurvival;
    this.brawling = brawling;
    this.dodgeEscape = dodgeEscape;
    this.melee = melee;
    this.riding = riding;
    this.sailing = sailing;
    this.smallBlades = smallBlades;
    this.staffSpear = staffSpear;
    this.swordsmanship = swordsmanship;
    this.physique = physique;
    this.endurance = endurance;
    this.charisma = charisma;
    this.deceit = deceit;
    this.fineArts = fineArts;
    this.gambling = gambling;
    this.groomingStyle = groomingStyle;
    this.humanPerception = humanPerception;
    this.leadership = leadership;
    this.persuasion = persuasion;
    this.performance = performance;
    this.seduction = seduction;
    this.alchemy = alchemy;
    this.crafting = crafting;
    this.disguise = disguise;
    this.firstAid = firstAid;
    this.forgery = forgery;
    this.pickLock = pickLock;
    this.trapCrafting = trapCrafting;
    this.courage = courage;
    this.hexWeaving = hexWeaving;
    this.intimidation = intimidation;
    this.spellCasting = spellCasting;
    this.resistMagic = resistMagic;
    this.resistCoercion = resistCoercion;
    this.ritualCrafting = ritualCrafting;
    this.languages = languages;
    this.inventory = inventory;
    this.equippedWeapon = equippedWeapon;
    this.equippedArmor = equippedArmor;
    this.armor = armor;
    this.crowns = crowns;
    this.reputation = reputation;
    this.characterClass = characterClass;
    this.xp = xp;
    this.aSkills = aSkills;
    this.bSkills = bSkills;
    this.cSkills = cSkills;
    this.rested = rested;
    this.hungry = hungry;
  }
}

class Enemy {
  constructor(
    name,
    enemyType,
    threat,
    bounty,
    intellect,
    reflexes,
    dexterity,
    body,
    speed,
    empathy,
    crafting,
    will,
    luck,
    stun,
    run,
    leap,
    stamina,
    encumbrance,
    recovery,
    hp,
    vigor,
    height,
    weight,
    environment,
    organization,
    vulnerabilities,
    abilities,
    athletics,
    awareness,
    brawling,
    courage,
    crossbow,
    dodgeEscape,
    endurance,
    resistCoercion,
    resistMagic,
    smallBlades,
    stealth,
    swordsmanship,
    wildernessSurvival,
    inventory,
    equippedWeapon,
    equippedArmor,
    armor,
    crowns
  ) {
    this.name = name;
    this.enemyType = enemyType;
    this.threat = threat;
    this.bounty = bounty;
    this.intellect = intellect;
    this.reflexes = reflexes;
    this.dexterity = dexterity;
    this.body = body;
    this.speed = speed;
    this.empathy = empathy;
    this.crafting = crafting;
    this.will = will;
    this.luck = luck;
    this.stun = stun;
    this.run = run;
    this.leap = leap;
    this.stamina = stamina;
    this.encumbrance = encumbrance;
    this.recovery = recovery;
    this.hp = hp;
    this.vigor = vigor;
    this.height = height;
    this.weight = weight;
    this.environment = environment;
    this.organization = organization;
    this.vulnerabilities = vulnerabilities;
    this.abilities = abilities;
    this.athletics = athletics;
    this.awareness = awareness;
    this.brawling = brawling;
    this.courage = courage;
    this.crossbow = crossbow;
    this.dodgeEscape = dodgeEscape;
    this.endurance = endurance;
    this.resistCoercion = resistCoercion;
    this.resistMagic = resistMagic;
    this.smallBlades = smallBlades;
    this.stealth = stealth;
    this.swordsmanship = swordsmanship;
    this.wildernessSurvival = wildernessSurvival;
    this.inventory = inventory;
    this.equippedWeapon = equippedWeapon;
    this.equippedArmor = equippedArmor;
    this.armor = armor;
    this.crowns = crowns;
  }
}

let bandit = new Enemy(
  "Bandit",
  "humanoid",
  [("easy", "simple")],
  10, // bounty
  3, // intellect
  6, // reflexes
  5, //dexterity
  5, // body
  4, // speed
  3, // empathy
  4, // crafting
  4, // will
  0, // luck
  4, // stun
  12, // run
  2, // leap
  20, // stamina
  50, // encumbrance
  4, // recovery
  20, // hp
  0, // vigor
  "average", // height
  "average", // weight
  ["near roads", "near settlements"], // environment
  [3, 15], // organization
  ["Hanged Man's Venom"], // vulnerabilities
  [], // abilities
  4, // athletics
  6, // awareness
  6, // brawling
  7, // courage
  4, // crossbow
  4, // dodgeEscape
  5, // endurance
  5, // resistCoercion
  4, // resistMagic
  5, // smallBlades
  3, //stealth
  6, // swordsmanship
  5, // wildernessSurvival
  [
    {
      name: "Stale Bread",
      description: "A chunk of bread that was baked a day or two ago.",
      weight: 0.5,
      rarity: 98,
      value: 12,
      edible: true,
    },
    {
      name: "Bundle of Furs",
      description: "A collection of various furs and pelts.",
      weight: 4.5,
      rarity: 98,
      value: 35,
      edible: false,
    },
  ], // inventory
  [], // equippedWeapon
  [], // equippedArmor
  0, //armor
  10 //crowns
);

const player = new Character(
  true,
  "Hendrik",
  5, // intellect
  7, // empathy
  6, // reflexes
  8, // craft
  7, // dexterity
  6, // will
  8, // body
  5, // luck
  7, // speed
  2, // vigor
  9, // run
  6, // stun
  7, // leap
  50, // hp
  100, // stamina
  80, // encumbrance
  10, // recovery
  5, // punch
  6, // kick
  8, // awareness
  7, // business
  6, // deduction
  6, // education
  7, // language
  6, // monsterLore
  7, // social
  6, // streetWise
  7, // tactics
  8, // teaching
  6, // wildernessSurvival
  7, // brawling
  8, // dodgeEscape
  7, // melee
  5, // riding
  4, // sailing
  7, // smallBlades
  7, // staffSpear
  8, // swordsmanship
  8, // physique
  7, // endurance
  6, // charisma
  7, // deceit
  6, // fineArts
  5, // gambling
  7, // groomingStyle
  8, // humanPerception
  7, // leadership
  8, // persuasion
  7, // performance
  7, // seduction
  5, // alchemy
  6, // crafting
  5, // disguise
  7, // firstAid
  6, // forgery
  7, // pickLock
  6, // trapCrafting
  8, // courage
  5, // hexWeaving
  7, // intimidation
  6, // spellCasting
  8, // resistMagic
  7, // resistCoercion
  6, // ritualCrafting
  ["common", "elder", "dwarven"], // languages
  [], // inventory
  [], // equippedWeapon
  [], // equippedArmor
  0, // armor
  100, // crowns
  50, // reputation
  "witcher", // characterClass
  0, //xp
  [], // aSkills
  [], // bSkills
  [], // cSkills
  true,
  false
);

const restMessages = [
  "You rest for a few hours and regain some stamina.",
  "You take a moment to catch your breath and feel reinvigorated.",
  "As you rest, you feel your energy returning.",
  "Taking a break, you feel a renewed sense of vitality.",
  "Resting proves beneficial as you recover some stamina.",
  "A brief respite leaves you feeling refreshed and ready to continue.",
  "You relax for a while, allowing your stamina to replenish.",
  "Resting helps you shake off some of your fatigue.",
  "You take it easy for a bit and notice your stamina improving.",
  "Pausing to rest, you feel a surge of energy returning.",
];

//Add weapons to the player and bandit enemy as a quick fix
player.inventory.push(ironLongSword);
player.inventory.push(verdenArchersHood);
player.inventory.push(gambeson);
player.inventory.push(paddedTrousers);
bandit.inventory.push(paddedTrousers);
bandit.inventory.push(dagger);
bandit.inventory.push(aedirnianGambeson);
equipArmor(bandit);
equipWeapon(player);
equipWeapon(bandit);
equipArmor(player);

let date = new Date("1247-05-01T00:00:00");
let month = date.getMonth();
let day = date.getDate();
let time = 0;
let dayPart = 0;
let todayMoon = 0;
let moonDay = 1;
let temp = 15;
let weather = 0;
let currentTerrain = 0;
let xCoordinate = 2;
let yCoordinate = 2;
let roll = 0;
let passed = true;
let timeSpent = 0;
let foragingSkill = 5;
let foragingDC = 10;
let foundItems = [];
let addedTime = 0;
let staminaDrain = 1;
let nightDifficulty = 3;
let inventoryWeight = 0;
let timeSinceEating = 0;
let participants = [];
let damage = 0;
let hitLocation = [];

const attackButton = document.querySelector("#attackButton");
const restButton = document.querySelector("#restButton");
const forageButton = document.querySelector("#forageButton");
const eatButton = document.querySelector("#eatButton");
const inventoryButton = document.querySelector("#inventoryButton");
const fightButton = document.querySelector("#fightButton");
const negotiateButton = document.querySelector("#negotiateButton");
const fleeButton = document.querySelector("#fleeButton");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const hpText = document.querySelector("#hpText");
const staminaText = document.querySelector("#staminaText");
const inventoryWeightText = document.querySelector("#inventoryWeightText");
const encumbranceStatText = document.querySelector("#encumbranceStatText");

const tempText = document.querySelector("#temp");
const timeText = document.querySelector("#time");
const moonText = document.querySelector("#moon");
const lightText = document.querySelector("#light");
const terrainText = document.querySelector("#terrain");

const northButton = document.querySelector("#northButton");
const southButton = document.querySelector("#southButton");
const eastButton = document.querySelector("#eastButton");
const westButton = document.querySelector("#westButton");
const southEastButton = document.querySelector("#southEastButton");
const southWestButton = document.querySelector("#southWestButton");
const northEastButton = document.querySelector("#northEastButton");
const northWestButton = document.querySelector("#northWestButton");
const stayButton = document.querySelector("#stayButton");

const items = [
  {
    name: "Edible Berries",
    description: "A cluster of ripe, juicy berries suitable for consumption.",
    weight: 0.1,
    rarity: 95,
    value: 5,
    edible: true,
  },
  {
    name: "Medicinal Herbs",
    description:
      "A collection of herbs known for their healing properties when brewed into teas or poultices.",
    weight: 0.2,
    rarity: 98,
    value: 15,
    edible: false,
  },
  {
    name: "Mushrooms",
    description:
      "Various types of mushrooms, some edible, some poisonous. Requires proper identification.",
    weight: 0.2,
    rarity: 95,
    value: 8,
    edible: true,
  },
  {
    name: "Wild Game",
    description:
      "Freshly caught small game such as rabbits or squirrels, suitable for cooking.",
    weight: 1,
    rarity: 98,
    value: 50,
    edible: false,
  },
  {
    name: "Fresh Water Source",
    description:
      "A pristine stream or natural spring providing clean drinking water.",
    weight: 0,
    rarity: 98,
    value: 20,
    edible: true,
  },
  {
    name: "Edible Roots",
    description:
      "Various roots and tubers that can be dug up and cooked for sustenance.",
    weight: 0.3,
    rarity: 98,
    value: 10,
    edible: true,
  },
  {
    name: "Nuts",
    description:
      "Assorted nuts from trees, a good source of protein and energy.",
    weight: 0.2,
    rarity: 98,
    value: 7,
    edible: true,
  },
  {
    name: "Edible Fungi",
    description: "Different varieties of fungi suitable for consumption.",
    weight: 0.3,
    rarity: 98,
    value: 12,
    edible: true,
  },
];

const lightList = ["night", "sunrise", "day", "sunset"];
//sunset and sunrise for each month; 0 = night, 1 = sunrise; 2 = day, 3 = sunset: might actually replace this with a spreadsheet of sunrise/sunset times https://www.timeanddate.com/sun/poland/warsaw?month=1&year=2023
const lightModifiers = {
  0: [0, 0, 0, 1, 2, 3, 0, 0],
  1: [0, 0, 1, 2, 2, 2, 3, 0],
  2: [0, 0, 1, 2, 2, 2, 3, 0],
  3: [0, 0, 1, 2, 2, 2, 2, 3],
  4: [0, 0, 1, 2, 2, 2, 2, 3],
  5: [0, 1, 2, 2, 2, 2, 2, 3],
  6: [0, 1, 2, 2, 2, 2, 2, 3],
  7: [0, 0, 1, 2, 2, 2, 2, 3],
  8: [0, 0, 1, 2, 2, 2, 3, 0],
  9: [0, 0, 1, 2, 2, 2, 3, 0],
  10: [0, 0, 1, 2, 2, 3, 0, 0],
  11: [0, 0, 0, 1, 2, 3, 0, 0],
};

const tempModifiers = {
  0: [-2, -3, -5, -1, 1, 1, 0, -1],
  1: [-2, -3, -5, -1, 1, 1, 2, 0],
  2: [1, 0, -1, 3, 4, 5, 7, 2],
  3: [5, 4, 3, 8, 9, 11, 12, 14],
  4: [13, 11, 8, 15, 16, 17, 18, 20],
  5: [13, 11, 16, 17, 18, 19, 20, 22],
  6: [16, 13, 16, 18, 20, 21, 23, 24],
  7: [17, 15, 13, 17, 20, 21, 23, 24],
  8: [11, 9, 8, 13, 15, 17, 19, 13],
  9: [6, 5, 4, 8, 9, 11, 13, 10],
  10: [2, 1, 0, 3, 4, 5, 6, 2],
  11: [-2, -3, -4, 0, 1, 2, 0, -1],
};

const humanDamageLocation = [
  "Head",
  "Torso",
  "Torso",
  "Torso",
  "Torso",
  "Right Arm",
  "Left Arm",
  "Right Leg",
  "Right Leg",
  "Left Leg",
  "Left Leg",
];

const tempList = ["freezing", "cold", "cool", "mild", "warm", "hot"];
const precList = [
  "snowing",
  "sleet",
  "raining",
  "drizzling",
  "foggy",
  "overcast",
  "cloudy",
  "clear",
];
const timeList = [
  "midnight",
  "the small hours",
  "early morning",
  "late morning",
  "midday",
  "early afternoon",
  "late afternoon",
  "evening",
];

const moonList = [
  "full moon",
  "waning gibbous",
  "last quarter",
  "waning crescent",
  "new moon",
  "waxing crescent",
  "first quarter",
  "waxing gibbous",
];

// const testMap = [
//   [3, 1, 0, 0, 0],
//   [3, 1, 1, 0, 0],
//   [3, 1, 1, 0, 0],
//   [3, 1, 2, 2, 2],
//   [3, 1, 2, 2, 2],
// ];

const terrainTypes = ["forest", "plains", "hills", "mountains", "swamp"];

const terrainProbabilities = [0.3, 0.3, 0.2, 0.1, 0.1];

setUIInTravel();

//copied from chatgpt
function getRandomTerrain() {
  const rand = Math.random();
  let cumulativeProbability = 0;
  for (let i = 0; i < terrainProbabilities.length; i++) {
    cumulativeProbability += terrainProbabilities[i];
    if (rand < cumulativeProbability) {
      return i;
    }
  }
  return terrainProbabilities.length - 1; // In case of rounding errors
}

// Generate a random 400x400 map
function generateMap() {
  const map = [];
  for (let i = 0; i < 400; i++) {
    const row = [];
    for (let j = 0; j < 400; j++) {
      row.push(getRandomTerrain());
    }
    map.push(row);
  }
  return map;
}

// Convert the values in the map to terrain types
function mapToTerrain(map) {
  return map.map((row) => row.map((val) => terrainTypes[val]));
}

// Generate the map
const testMap = generateMap();

// Convert the map to terrain types
const testMapWithTerrain = mapToTerrain(testMap);

const mapWidth = testMap.length;
const mapHeight = testMap.length;

//--------------------------------------------------------------------------------------------

function forwardTime(minutesIncrimented = 60) {
  time = time + minutesIncrimented;
  timeSinceEating += minutesIncrimented;
  if (time > 1440) {
    time = time - 1440;
    day = day + 1;
    date.setDate(date.getDate() + 1);
    forwardMoonDay();
    player.rested = false;
    console.log("rested: " + player.rested);
  }

  for (let i = minutesIncrimented; i > 0; i -= 10) {
    spendStamina(player, 0.2);
  }

  if (timeSinceEating > 720) {
    player.hungry = true;
  }

  if (player.hungry == true && player.stamina <= 0) {
    for (let i = minutesIncrimented; i > 0; i -= 60) {
      player.hp -= 5;
    }
  }

  // console.log(date);
  // console.log(time);
  return time;
}

function convertTimeToDayPart(t) {
  let x = dayPart;

  if (t >= 90 && t < 269) {
    dayPart = 1;
  } else if (t >= 270 && t < 449) {
    dayPart = 2;
  } else if (t >= 450 && t < 629) {
    dayPart = 3;
  } else if (t >= 630 && t < 809) {
    dayPart = 4;
  } else if (t >= 810 && t < 989) {
    dayPart = 5;
  } else if (t >= 990 && t < 1169) {
    dayPart = 6;
  } else if (t >= 1170 && t < 1349) {
    dayPart = 7;
  } else {
    dayPart = 0;
  }

  if (dayPart != x) {
    generateTemp(month, dayPart);
  }
  return dayPart;
}

function tellTime(t) {
  forwardTime(t);
  convertTimeToDayPart(time);
  console.log("daypart: " + dayPart);
  tellTemp();
  tellMoon();
  tellLight(month, dayPart);
  tellStats(player);
  timeText.innerText = timeList[dayPart];
}

function forwardMoonDay() {
  if (moonDay <= 28) {
    moonDay++;
  } else {
    moonDay = 1;
  }
  console.log("moonDay: " + moonDay);
}

function tellMoon() {
  if (moonDay === 1) {
    todayMoon = 0;
  } else if (moonDay >= 2 && moonDay <= 6) {
    todayMoon = 1;
  } else if (moonDay === 8) {
    todayMoon = 1;
  } else if (moonDay >= 9 && moonDay <= 14) {
    todayMoon = 2;
  } else if (moonDay === 15) {
    todayMoon = 3;
  } else if (moonDay >= 16 && moonDay <= 21) {
    todayMoon = 4;
  } else if (moonDay === 22) {
    todayMoon = 5;
  } else if (moonDay >= 23 && moonDay <= 28) {
    todayMoon = 6;
  }
  moonText.innerText = moonList[todayMoon];
}

function tellLight(month, dayPart) {
  let lightLevel = lightModifiers[month][dayPart];
  lightText.innerText = lightList[lightLevel];
}

function tellTemp() {
  if (temp < 1) {
    weather = tempList[0];
  }
  if (temp >= 1 && temp < 8) {
    weather = tempList[1];
  }
  if (temp >= 8 && temp < 16) {
    weather = tempList[2];
  }
  if (temp >= 16 && temp < 24) {
    weather = tempList[3];
  }
  if (temp >= 24) {
    weather = tempList[4];
  }
  tempText.innerText = weather;
  console.log("temp: " + temp);
}

function generateTemp(month, dayPart) {
  let sigma = 5;
  let mu = tempModifiers[month][dayPart];

  temp = jStat.normal.sample(mu, sigma);
  temp = Math.round(temp);

  return temp;
}

function travel() {
  let sigma = 15;
  let mu = 60;

  addedTime = jStat.normal.sample(mu, sigma);
  addedTime = Math.round(addedTime);

  console.log("added time: " + addedTime);
  setTerrain();
  spendStamina(player, 1);
  rollEncounter();
  return addedTime;
}

function setTerrain() {
  currentTerrain = testMap[xCoordinate][yCoordinate];
  terrainText.innerText = terrainTypes[currentTerrain];
}

function terrainBounds() {
  text.innerText = "You have reached impassable terrain.";
}

// Function to simulate foraging in the immediate area - a fail means that an hour goes forward and a success means that one item is found and the time goes forward less than an hour
function forage() {
  let found = false;
  skillCheckDC(foragingSkill, foragingDC);

  // todo: include a loop so that if no item is found below chance, the loop repeats

  if (passed === true) {
    do {
      items.forEach((item) => {
        const chance = Math.random() * 100; // Generate a random number between 0 and 100
        //console.log("chance: " + chance);
        if (chance >= item.rarity) {
          foundItems.push(item);
          found = true;
          return;
        }
      });
    } while (!found);
    timeSpent = Math.floor(Math.random() * 60);
    displayFoundItems();
  } else {
    text.innerText = `You spent an hour foragaing but couldn't find anything.`;
    timeSpent = 60;
  }
  spendStamina(player, 1);
  tellTime(timeSpent);
  setEncumbrance();
}

forageButton.addEventListener("click", function () {
  forage();
  console.log("found items: " + foundItems[0]);
  console.log(JSON.stringify(foundItems));

  if (foundItems.length > 0) {
    player.inventory.push(...foundItems);
    displayFoundItems();
  }
  player.inventory.sort();
  foundItems = [];
  console.log("inventory is: " + player.inventory[0]);
  setEncumbrance();
});

// Function to display found items
function displayFoundItems() {
  let foundText = "You found the following items while foraging:";
  foundItems.forEach((item) => {
    foundText += ` ${item.name},`;
  });
  foundText = foundText.slice(0, -1); // Remove the last comma
  text.innerText = foundText;
}

// later on I can add parameters for player/character/monster + skill e.g. skillCheck(player, foraging)
function skillCheckDC(skill, dc) {
  rollD10();
  let result = skill + roll;
  if (result >= dc) {
    passed = true;
  } else {
    passed = false;
  }
  console.log(passed);
  return passed;
}

function skillCheckOpposed(playerSkill, playerStat, enemySkill, enemyStat) {
  rollD10();
  let playerResult = playerSkill + playerStat + roll;
  rollD10();
  let enemyResult = enemySkill + enemyStat + roll;

  while (playerResult == enemyResult) {
    rollD10();
    playerResult = playerSkill + playerStat + roll;
    rollD10();
    enemyResult = enemySkill + enemyStat + roll;
  }

  if (playerResult > enemyResult) {
    passed = true;
  } else {
    passed = false;
  }
}

function rollD10() {
  roll = Math.floor(Math.random() * 10) + 1;
  console.log(roll);
  return roll;
}

function rollD6() {
  roll = Math.floor(Math.random() * 6) + 1;
  console.log(roll);
  return roll;
}

function calculateTimeSpent() {
  timeSpent = Math.floor(Math.random() * 60) + 1;
}

function tellStats(x) {
  xpText.innerText = x.xp;
  hpText.innerText = x.hp;
  staminaText.innerText = x.stamina;
}

function spendStamina(x, y) {
  x.stamina = x.stamina - (Math.floor(Math.random() * y) + 1);
}

function eat(x) {
  let eatenItem;
  //will rejig this later to eat specific items
  for (let i = 0; i < x.length; i++) {
    if (x[i].edible == true) {
      eatenItem = x[i].name;
      console.log(eatenItem);
      x.splice(i, 1);
      break;
    }
  }

  if (eatenItem) {
    setEncumbrance();
    player.stamina += 30;
    player.hungry = false;
    text.innerText = `You eat ${eatenItem} and start to feel better.`;
    forwardTime(9);
    timeSinceEating = 0;
  } else {
    text.innerText = `You don't have anything edible to eat.`;
  }
}

function weighInventory() {
  inventoryWeight = 0;
  for (let i = 0; i < player.inventory.length; i++) {
    inventoryWeight += player.inventory[i].weight;
  }
  inventoryWeightText.innerText = inventoryWeight.toFixed(1);
}

function setEncumbrance() {
  weighInventory();
  encumbranceStatText.innerText = player.encumbrance;

  if (inventoryWeight > player.encumbrance) {
    text.innerText = "You are over encumbered.";
  }
}

function createEncounter() {
  //need to include  generation of an enemy here

  setUIInEncounter();
}

function rollEncounter() {
  rollD10();
  if (roll == 1) {
    createEncounter();
  }
}

function setUIInEncounter() {
  text.innerText +=
    "\nAs you wander through the forest, you encounter a bandit blocking your path.";
  fightButton.style.display = "inline";
  negotiateButton.style.display = "inline";
  fleeButton.style.display = "inline";
  restButton.style.display = "none";
  forageButton.style.display = "none";
  eatButton.style.display = "none";
  attackButton.style.display = "none";

  northButton.style.display = "none";
  southButton.style.display = "none";
  eastButton.style.display = "none";
  westButton.style.display = "none";
  southEastButton.style.display = "none";
  southWestButton.style.display = "none";
  northEastButton.style.display = "none";
  northWestButton.style.display = "none";
  stayButton.style.display = "none";
}

function setUIInTravel() {
  restButton.style.display = "inline";
  forageButton.style.display = "inline";
  eatButton.style.display = "inline";
  fightButton.style.display = "none";
  negotiateButton.style.display = "none";
  fleeButton.style.display = "none";
  attackButton.style.display = "none";

  northButton.style.display = "inline";
  southButton.style.display = "inline";
  eastButton.style.display = "inline";
  westButton.style.display = "inline";
  southEastButton.style.display = "inline";
  southWestButton.style.display = "inline";
  northEastButton.style.display = "inline";
  northWestButton.style.display = "inline";
  stayButton.style.display = "inline";
}

function setUIInCombat() {
  attackButton.style.display = "inline";
  fightButton.style.display = "none";
  text.innerText = "You stand your ground and prepare to fight.";
}

function startCombat(enemy) {
  setUIInCombat();
  let playerInitiative = rollD10() + player.reflexes;
  let enemyInitiative = rollD10() + enemy.reflexes;

  while (enemyInitiative == playerInitiative) {
    playerInitiative = rollD10() + player.reflexes;
    enemyInitiative = rollD10() + enemy.reflexes;
  }

  if (enemyInitiative > playerInitiative) {
    participants = [enemy, player];
  } else if (playerInitiative > enemyInitiative) {
    participants = [player, enemy];
  }

  console.log(participants);

  while (player.hp > 0 && enemy.hp > 0) {
    if (participants[0] == player) {
      fastMeleeAttack(participants[0], participants[1]);
      participants = participants.reverse();
    } else if (participants[0] != player) {
      meleeAttack(participants[0], participants[1]);
      participants = participants.reverse();
    }
  }

  if (player.hp <= 0) {
    text.innerText += `\n You have been defeated by the ${enemy.name}! Game over.`;
    //todo: create a function for a new game
  } else if (enemy.hp <= 0) {
    text.innerText += `\n You have defeated the ${enemy.name}.`;
    player.crowns += enemy.crowns;
    loot(enemy);
    resetBandit();
    setUIInTravel();
  }
}

function loot(enemy) {
  player.inventory.push(...enemy.inventory);
}

function selectEnemyAction() {}

function fastMeleeAttack(attacker, defender) {
  meleeAttack(attacker, defender);
  meleeAttack(attacker, defender);
}

function meleeAttack(attacker, defender) {
  rollD10();
  let attackResult = attacker.swordsmanship + attacker.reflexes + roll;
  console.log(`Attacker rolls ${attackResult}`);
  rollD10();
  let defendResult = defender.dodgeEscape + defender.reflexes + roll; //defenders are automatically dodging for now
  console.log(`Defender rolls ${defendResult}`);

  if (attackResult > defendResult) {
    let bodyDamage = 0;
    //let damage = rollD6() + rollD6() + 2 - defender.armor;

    damage = calculateWeaponDamage(attacker) - defender.armor;
    damage = Math.max(0, damage);
    if (attacker.body > defender.body) {
      bodyDamage = attacker.body - defender.body;
      damage = damage + bodyDamage;
    }
    defender.armor -= 1;

    if (defender.enemyType == "humanoid") {
      let hitLocationRoll = rollD10();
      hitLocation = humanDamageLocation[hitLocationRoll];

      if (hitLocation == "Head") {
        damage = damage * 3;
      } else if (
        hitLocation == "Right Arm" ||
        "Left Arm" ||
        "Right Leg" ||
        "Left Leg"
      ) {
        damage = Math.floor(damage / 2);
      }
    }
    defender.hp -= damage;
    text.innerText += `\n${attacker.name} hits ${defender.name} in the ${hitLocation} for ${damage} damage!`;
  } else {
    text.innerText += `\n${attacker.name} attacks ${defender.name} but misses!`;
  }
  hpText.innerText = player.hp;
  hitLocation = [];
}

function resetBandit() {
  bandit.hp = 20;
}

function equipWeapon(character) {
  // Iterate through the character's inventory
  for (let i = 0; i < character.inventory.length; i++) {
    const item = character.inventory[i];
    // Check if the item is a weapon
    if (item instanceof Weapon) {
      // Equip the weapon and exit the loop
      character.equippedWeapon = item;
      //text.innerText = `Equipped ${item.name}.`; this messaging can be included later
      return;
    }
  }
  // If no weapon is found, display a message
  text.innerText = "No weapon found in inventory.";
}

function calculateWeaponDamage(character) {
  damage = 0;
  let damageArray = character.equippedWeapon.damage;
  for (let i = 0; i < damageArray[0]; i++) {
    damage += rollD6();
  }
  damage += damageArray[2];
  console.log("damage is " + damage);
  return damage;
}

function equipArmor(character) {
  // equip all items of armor - needs to be adjusted later
  for (let i = 0; i < character.inventory.length; i++) {
    const item = character.inventory[i];
    if (item instanceof Armor) {
      character.equippedArmor.push(item);
      //text.innerText = `Equipped ${item.name}.`; this messaging can be included later
    }
  }
  // calculate equipped armor
  for (let i = 0; i < character.equippedArmor.length; i++) {
    character.armor += character.equippedArmor[i].stoppingPower;
  }
  return character.armor;
}

function landscapeMessage() {
  const landscapeMessages = [
    "\nYou walk through a dense forest, the ancient trees towering above you like silent sentinels.",
    "\nThe winding path leads you through a rugged mountain pass, the jagged peaks obscured by swirling mists.",
    "\nA vast plain stretches out before you, the tall grass rustling in the breeze as you make your way across the open expanse.",
    "\nYou follow a meandering river through a tranquil valley, the sound of rushing water soothing your weary soul.",
    "\nThe road takes you through a desolate moorland, the bleak landscape stretching out in all directions under the grey sky.",
    "\nA winding trail leads you through a mystical grove, where ethereal wisps dance among the ancient trees.",
    "\nYou traverse a rocky coastline, the crashing waves sending salty spray into the air as you navigate the treacherous cliffs.",
    "\nThe path winds through a sun-dappled forest, the chirping of birds and buzzing of insects filling the air with life.",
    "\nYou stumble upon the ruins of an ancient fortress, its crumbling walls standing as a testament to the passage of time.",
    "\nA sprawling meadow unfolds before you, dotted with vibrant wildflowers and buzzing with the hum of bees.",
    "\nYou come across a hidden waterfall, its cascading waters shimmering in the sunlight as they tumble into a crystal-clear pool below.",
    "\nA mysterious fog rolls in from the marshes, cloaking the landscape in an eerie silence as you tread cautiously through the mist.",
    "\nYou journey through a serene woodland, the trees whispering ancient secrets as you pass by.",
    "\nA towering mountain looms in the distance, its snow-capped peak disappearing into the clouds above.",
    "\nYou stumble upon a forgotten graveyard, its weather-worn headstones standing as solemn markers of lives long past.",
    "\nThe path leads you through a bustling marketplace, the scent of spices and the sounds of haggling merchants filling the air with energy.",
    "\nYou come across a quaint village nestled in the hills, its thatched-roof cottages exuding a rustic charm.",
    "\nA shimmering oasis appears on the horizon, its sparkling waters a welcome respite from the harsh desert sands.",
    "\nYou journey through a dense swamp, the murky waters teeming with hidden dangers lurking just below the surface.",
    "\nA majestic castle looms on the horizon, its towering spires reaching towards the heavens as you approach the imposing fortress.",
    "\nYou stumble upon a hidden cave entrance, its dark depths beckoning you to explore the mysteries that lie within.",
    "\nThe path leads you through a tranquil glade, where shafts of sunlight filter through the canopy above, casting dappled shadows on the forest floor.",
    "\nYou come across a sprawling vineyard, its neatly-tended rows of grapevines stretching as far as the eye can see.",
    "\nA mysterious stone circle stands before you, its weathered stones bearing ancient runes that hint at forgotten rituals and arcane powers.",
    "\nYou journey through a windswept plain, the tall grass bending in the breeze as you make your way across the open expanse.",
    "\nA towering waterfall cascades down the side of a sheer cliff, its thundering roar echoing through the canyon below.",
    "\nYou stumble upon a hidden glen, its lush greenery providing a welcome respite from the harsh wilderness beyond.",
    "\nThe path leads you through a dense thicket, where tangled underbrush and twisted vines make progress slow and arduous.",
    "\nYou come across a sunken shipwreck, its rotting timbers a haunting reminder of the dangers that lurk beneath the waves.",
    "\nA crumbling stone bridge spans a chasm before you, its ancient arches standing as a testament to the engineering prowess of long-forgotten civilizations.",
    "\nYou journey through a windswept desert, the shifting sands forming intricate patterns beneath your feet as you trek across the barren landscape.",
    "\nA towering statue looms on the horizon, its weathered features carved with a sense of solemn majesty that speaks to the passage of ages.",
    "\nYou stumble upon a hidden glade, its tranquil beauty belying the dangers that lurk in the shadows of the surrounding forest.",
    "\nThe path leads you through a mist-shrouded marsh, where twisted trees and tangled roots form a labyrinthine maze that seems to shift and change with every step.",
    "\nYou come across a crumbling castle ruin, its ivy-covered walls standing as a silent testament to the once-great kingdom that now lies in ruin.",
    "\nA mysterious standing stone marks the center of a forgotten clearing, its weathered surface adorned with intricate carvings that hint at a lost civilization.",
    "\nYou journey through a moonlit forest, where the whispering of the wind through the trees and the hooting of owls create an atmosphere of eerie tranquility.",
    "\nA towering mountain range stretches out before you, its snow-capped peaks disappearing into the clouds as you contemplate the journey ahead.",
    "\nYou stumble upon a hidden cave entrance, its yawning maw beckoning you to explore the dark depths that lie beyond.",
    "\nThe path leads you through a dense jungle, where towering trees and lush foliage form a verdant canopy overhead.",
    "\nYou come across a secluded waterfall, its crystal-clear waters cascading down from a moss-covered cliff into a tranquil pool below.",
    "\nA mysterious stone circle stands before you, its weathered stones bearing ancient runes that hint at forgotten rituals and arcane powers.",
    "\nYou journey through a windswept plain, the tall grass bending in the breeze as you make your way across the open expanse.",
    "\nA towering waterfall cascades down the side of a sheer cliff, its thundering roar echoing through the canyon below.",
    "\nYou stumble upon a hidden glen, its lush greenery providing a welcome respite from the harsh wilderness beyond.",
    "\nThe path leads you through a dense thicket, where tangled underbrush and twisted vines make progress slow and arduous.",
    "\nYou come across a sunken shipwreck, its rotting timbers a haunting reminder of the dangers that lurk beneath the waves.",
    "\nA crumbling stone bridge spans a chasm before you, its ancient arches standing as a testament to the engineering prowess of long-forgotten civilizations.",
    "\nYou journey through a windswept desert, the shifting sands forming intricate patterns beneath your feet as you trek across the barren landscape.",
    "\nA towering statue looms on the horizon, its weathered features carved with a sense of solemn majesty that speaks to the passage of ages.",
    "\nYou stumble upon a hidden glade, its tranquil beauty belying the dangers that lurk in the shadows of the surrounding forest.",
    "\nThe path leads you through a mist-shrouded marsh, where twisted trees and tangled roots form a labyrinthine maze that seems to shift and change with every step.",
    "\nYou come across a crumbling castle ruin, its ivy-covered walls standing as a silent testament to the once-great kingdom that now lies in ruin.",
  ];

  const randomIndex = Math.floor(Math.random() * landscapeMessages.length);
  const message = landscapeMessages[randomIndex];
  text.innerText += message;
}

//EVENT LISTENERS-----------------------------------------------------------------

fightButton.addEventListener("click", function () {
  startCombat(bandit);
});

fleeButton.addEventListener("click", function () {
  skillCheckOpposed(
    player.dodgeEscape,
    player.reflexes,
    bandit.dodgeEscape,
    bandit.reflexes
  );
  if (passed == true) {
    text.innerText = "You flee the fight and run into the forest.";
    setUIInTravel();
  } else {
    text.innerText = "You try to flee but the enemy catches up to you.";
  }
});

restButton.addEventListener("click", function () {
  tellTime(240);
  player.stamina += 40;
  staminaText.innerText = player.stamina;
  player.rested = true;

  const randomIndex = Math.floor(Math.random() * restMessages.length);
  const message = restMessages[randomIndex];

  text.innerText = message;
});

northButton.addEventListener("click", function () {
  if (yCoordinate > 0) {
    yCoordinate--;
    travel();
    tellTime(addedTime);
    tellTemp();
    text.innerText = `You travel to the north.`;
    landscapeMessage();
    rollEncounter();
  } else {
    terrainBounds();
  }
});

southButton.addEventListener("click", function () {
  if (yCoordinate < mapHeight - 1) {
    yCoordinate++;
    travel();
    tellTime(addedTime);
    tellTemp();
    text.innerText = `You travel to the south.`;
    landscapeMessage();
    rollEncounter();
  } else {
    terrainBounds();
  }
});

eastButton.addEventListener("click", function () {
  if (xCoordinate < mapWidth - 1) {
    xCoordinate++;
    travel();
    tellTime(addedTime);
    tellTemp();
    text.innerText = `You travel to the east.`;
    landscapeMessage();
    rollEncounter();
  } else {
    terrainBounds();
  }
});

westButton.addEventListener("click", function () {
  if (xCoordinate > 0) {
    xCoordinate--;
    travel();
    tellTime(addedTime);
    tellTemp();
    text.innerText = `You travel to the west.`;
    landscapeMessage();
    rollEncounter();
  } else {
    terrainBounds();
  }
});

southWestButton.addEventListener("click", function () {
  if (yCoordinate < mapHeight - 1 && xCoordinate > 0) {
    yCoordinate++;
    xCoordinate--;
    travel();
    tellTime(addedTime);
    tellTemp();
    text.innerText = `You travel to the south-west.`;
    landscapeMessage();
    rollEncounter();
  } else {
    terrainBounds();
  }
});

southEastButton.addEventListener("click", function () {
  if (yCoordinate < mapHeight - 1 && xCoordinate < mapWidth - 1) {
    yCoordinate++;
    xCoordinate++;
    travel();
    tellTime(addedTime);
    tellTemp();
    text.innerText = `You travel to the south-east.`;
    landscapeMessage();
    rollEncounter();
  } else {
    terrainBounds();
  }
});

northWestButton.addEventListener("click", function () {
  if (yCoordinate > 0 && xCoordinate > 0) {
    yCoordinate--;
    xCoordinate--;
    travel();
    tellTime(addedTime);
    tellTemp();
    text.innerText = `You travel to the north-west.`;
    landscapeMessage();
    rollEncounter();
  } else {
    terrainBounds();
  }
});

northEastButton.addEventListener("click", function () {
  if (yCoordinate > 0 && xCoordinate < mapWidth - 1) {
    yCoordinate--;
    xCoordinate++;
    travel();
    tellTime(addedTime);
    tellTemp();
    text.innerText = `You travel to the north-east.`;
    rollEncounter();
  } else {
    terrainBounds();
  }
});

negotiateButton.addEventListener("click", function () {});

inventoryButton.addEventListener("click", function () {
  player.inventory.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  let inventoryText = "Your inventory contains: ";
  player.inventory.forEach((item) => {
    inventoryText += ` ${item.name},`;
  });
  inventoryText = inventoryText.slice(0, -1);
  text.innerText = inventoryText;
});

eatButton.addEventListener("click", function () {
  if (player.inventory.length > 0) {
    eat(player.inventory);
  }
  staminaText.innerText = player.stamina;
});
