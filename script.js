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
    threat,
    bounty,
    armor,
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
    inventory
  ) {
    this.name = name;
    this.threat = threat;
    this.bounty = bounty;
    this.armor = armor;
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
  }
}

let bandit = new Enemy(
  "Bandit",
  ["easy", "simple"],
  10, // bounty
  5, // armor
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
  ["Dagger", "Bandages", "Lockpicks"] // inventory
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
  [], // inventory (empty for now)
  10, //armor
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

const conditions = [];

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

const items = [
  {
    name: "Edible Berries",
    description: "A cluster of ripe, juicy berries suitable for consumption.",
    weight: 0.1,
    rarity: 95,
    value: 5,
  },
  {
    name: "Medicinal Herbs",
    description:
      "A collection of herbs known for their healing properties when brewed into teas or poultices.",
    weight: 0.2,
    rarity: 98,
    value: 15,
  },
  {
    name: "Mushrooms",
    description:
      "Various types of mushrooms, some edible, some poisonous. Requires proper identification.",
    weight: 0.2,
    rarity: 95,
    value: 8,
  },
  {
    name: "Wild Game",
    description:
      "Freshly caught small game such as rabbits or squirrels, suitable for cooking.",
    weight: 1,
    rarity: 98,
    value: 50,
  },
  {
    name: "Fresh Water Source",
    description:
      "A pristine stream or natural spring providing clean drinking water.",
    weight: 0,
    rarity: 98,
    value: 20,
  },
  {
    name: "Edible Roots",
    description:
      "Various roots and tubers that can be dug up and cooked for sustenance.",
    weight: 0.3,
    rarity: 98,
    value: 10,
  },
  {
    name: "Nuts",
    description:
      "Assorted nuts from trees, a good source of protein and energy.",
    weight: 0.2,
    rarity: 98,
    value: 7,
  },
  {
    name: "Edible Fungi",
    description: "Different varieties of fungi suitable for consumption.",
    weight: 0.3,
    rarity: 98,
    value: 12,
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

restButton.addEventListener("click", function () {
  tellTime(240);
  player.stamina += 40;
  staminaText.innerText = player.stamina;
  player.rested = true;
  console.log("rested: " + player.rested);
});

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

northButton.addEventListener("click", function () {
  if (yCoordinate > 0) {
    yCoordinate--;
    travel();
    tellTime(addedTime);
    tellTemp();
    text.innerText = `You travel to the north.`;
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
  } else {
    terrainBounds();
  }
});

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

function tellStats(x) {
  xpText.innerText = x.xp;
  hpText.innerText = x.hp;
  staminaText.innerText = x.stamina;
}

function spendStamina(x, y) {
  x.stamina = x.stamina - (Math.floor(Math.random() * y) + 1);
}

function eat(x) {
  // will rejig this later to include a specific item
  let eatenItem = player.inventory[0].name;
  console.log(player.inventory[0]);
  x.shift();
  setEncumbrance();
  player.stamina += 30;
  player.hungry = false;
  text.innerText = `You eat ${eatenItem} and start to feel better.`;
  forwardTime(9);
  timeSinceEating = 0;
}

eatButton.addEventListener("click", function () {
  if (player.inventory.length > 0) {
    eat(player.inventory);
  }
  staminaText.innerText = player.stamina;
});

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
}

function setUIInTravel() {
  restButton.style.display = "inline";
  forageButton.style.display = "inline";
  eatButton.style.display = "inline";
  fightButton.style.display = "none";
  negotiateButton.style.display = "none";
  fleeButton.style.display = "none";
  attackButton.style.display = "none";
}

function setUIInCombat() {
  attackButton.style.display = "inline";
  fightButton.style.display = "none";
  text.innerText = "You stand your ground and prepare to fight.";
}

fightButton.addEventListener("click", function () {
  startCombat();
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

negotiateButton.addEventListener("click", function () {});

function startCombat() {
  setUIInCombat();
  let playerInitiative = rollD10() + player.reflexes;
  let enemyInitiative = rollD10() + bandit.reflexes;

  while (enemyInitiative == playerInitiative) {
    playerInitiative = rollD10() + player.reflexes;
    enemyInitiative = rollD10() + bandit.reflexes;
  }

  if (enemyInitiative > playerInitiative) {
    participants = [bandit, player];
  } else if (playerInitiative > enemyInitiative) {
    participants = [player, bandit];
  }

  console.log(participants);

  while (player.hp > 0 && bandit.hp > 0) {
    meleeAttack(participants[0], participants[1]);
    participants = participants.reverse();
  }

  if (player.hp <= 0) {
    text.innerText += `\n You have been defeated by the bandit! Game over.`;
    //todo: create a function for a new game
  } else if (bandit.hp <= 0) {
    text.innerText += `\n You have defeated the bandit.`;
    resetBandit();
    setUIInTravel();
  }
}

function enemyTurn() {
  let target = player; //a function to choose a member of a players party can be added later
  let action = selectEnemyAction;
}

function selectEnemyAction() {}

function meleeAttack(attacker, defender) {
  rollD10();
  let attackResult = attacker.swordsmanship + attacker.reflexes + roll;
  console.log(`Attacker rolls ${attackResult}`);
  rollD10();
  let defendResult = defender.dodgeEscape + defender.reflexes + roll; //defenders are automatically dodging for now
  console.log(`Defender rolls ${defendResult}`);

  if (attackResult > defendResult) {
    let bodyDamage = 0;
    let damage = rollD6() + rollD6() + 2 - defender.armor;
    damage = Math.max(0, damage);
    if (attacker.body > defender.body) {
      bodyDamage = attacker.body - defender.body;
      damage = damage + bodyDamage;
    }
    defender.armor -= 1;
    defender.hp -= damage;
    text.innerText += `\n${attacker.name} attacks ${defender.name} for ${damage} damage!`;
  } else {
    text.innerText += `\n${attacker.name} attacks ${defender.name} but misses!`;
  }
  hpText.innerText = player.hp;
}

function resetBandit() {
  bandit.hp = 20;
}
