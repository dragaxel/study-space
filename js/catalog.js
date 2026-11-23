// Everything that can be bought lives here. Add a new entry to extend the shop —
// no other code changes needed (mini games also need a function in games.js).

const CATALOG = {
  // Themes override the CSS variables defined in style.css.
  themes: [
    { id: "default", name: "Sage",     price: 0,   vars: { "--bg": "#f6f5f2", "--surface": "#ffffff", "--text": "#222222", "--muted": "#888888", "--border": "#dddddd", "--accent": "#3a7d6b", "--accent-text": "#ffffff" } },
    { id: "night",   name: "Night",    price: 60,  vars: { "--bg": "#16181d", "--surface": "#1f2229", "--text": "#e6e6e6", "--muted": "#8a8f98", "--border": "#30343d", "--accent": "#7aa2f7", "--accent-text": "#16181d" } },
    { id: "peach",   name: "Peach",    price: 60,  vars: { "--bg": "#fff6f0", "--surface": "#ffffff", "--text": "#3b2a22", "--muted": "#a08878", "--border": "#f0dccd", "--accent": "#e07a5f", "--accent-text": "#ffffff" } },
    { id: "paper",   name: "Paper",    price: 100, vars: { "--bg": "#ffffff", "--surface": "#ffffff", "--text": "#000000", "--muted": "#777777", "--border": "#000000", "--accent": "#000000", "--accent-text": "#ffffff" } },
  ],

  // Backdrops for the Space stage: a wall colour and a floor colour,
  // or add `image: "assets/backdrops/your-room.png"` to use a picture (wall is the fallback colour).
  backdrops: [
    { id: "plain",  name: "Cozy Room",  price: 0,   wall: "#efe9df", floor: "#d9cbb5" },
    { id: "mint",   name: "Mint Study", price: 40,  wall: "#d8efe4", floor: "#b9a58a" },
    { id: "night",  name: "Night Loft", price: 60,  wall: "#2b2f4a", floor: "#4a3f35" },
    { id: "garden", name: "Garden",     price: 80,  wall: "#cfe6f7", floor: "#9cc98a" },
  ],

  // Decorations are stickers you drag onto the Space stage. Buy as many copies as you like.
  // Art: `icon` (emoji) is required as a fallback; add `sprite` to use a PNG instead.
  // See assets/README.md for the full list of art options.
  decorations: [
    { id: "desk",   name: "Study Desk", icon: "🪑", price: 50, sprite: "assets/decorations/desk.png", pixelated: true, size: 1.6 },
    { id: "curly-plant", name: "Curly Plant", icon: "🌿", price: 20, sprite: "assets/decorations/curly-plant.png", size: 1.3 },
    { id: "green-couch", name: "Green Couch", icon: "🛋️", price: 20, sprite: "assets/decorations/green-couch.png", size: 1.8 },
    { id: "plant",  name: "Plant",  icon: "🪴", price: 10 },
    { id: "lamp",   name: "Lamp",   icon: "💡", price: 15 },
    { id: "books",  name: "Books",  icon: "📚", price: 15 },
    { id: "chair",  name: "Chair",  icon: "🪑", price: 20 },
    { id: "clock",  name: "Clock",  icon: "🕰️", price: 25 },
    { id: "frame",  name: "Picture", icon: "🖼️", price: 30 },
    { id: "coffee", name: "Coffee", icon: "☕", price: 5 },
    { id: "candle", name: "Candle", icon: "🕯️", price: 10 },
    { id: "teddy",  name: "Teddy",  icon: "🧸", price: 20 },
    { id: "headphones", name: "Headphones", icon: "🎧", price: 25 },
    { id: "computer", name: "Computer", icon: "🖥️", price: 40 },
    { id: "window", name: "Window", icon: "🪟", price: 40 },
    { id: "bed",    name: "Bed",    icon: "🛏️", price: 60 },
    { id: "cat",    name: "Cat",    icon: "🐈", price: 80 },
  ],

  // Mini games. `play` must match a key in GAMES (games.js).
  games: [
    { id: "clicker", name: "Target Tap",   icon: "🎯", price: 40, play: "clicker" },
    { id: "memory",  name: "Memory Match", icon: "🧠", price: 75, play: "memory" },
  ],
};

// ---------- Wish (gacha) ----------
// Study buddies you can wish for. rarity: 3 = common, 4 = rare, 5 = legendary.
// Same art options as decorations: `icon` emoji, optional `sprite` PNG (see assets/README.md).
const BUDDIES = [
  { id: "frog",    name: "Pip the Frog",       icon: "🐸", rarity: 3 },
  { id: "turtle",  name: "Shelly the Turtle",  icon: "🐢", rarity: 3 },
  { id: "hamster", name: "Nibbles the Hamster", icon: "🐹", rarity: 3 },
  { id: "chick",   name: "Peep the Chick",     icon: "🐥", rarity: 3 },
  { id: "snail",   name: "Slowpoke the Snail", icon: "🐌", rarity: 3 },
  { id: "owl",     name: "Professor Hoot",     icon: "🦉", rarity: 4 },
  { id: "blob",    name: "Gloop the Slime",    icon: "🟢", rarity: 4, sprite: "assets/buddies/blob.png", pixelated: true },
  { id: "fox",     name: "Ember the Fox",      icon: "🦊", rarity: 4 },
  { id: "dizzy",   name: "Dizzy",              icon: "😵‍💫", rarity: 4, sprite: "assets/buddies/dizzy.png", size: 1.3 },
  { id: "imp",     name: "Imp",                icon: "😈", rarity: 4, sprite: "assets/buddies/imp.png", size: 1.3 },
  { id: "panda",   name: "Bao the Panda",      icon: "🐼", rarity: 4 },
  { id: "tin",       name: "Tin",       icon: "☕", rarity: 4, sprite: "assets/buddies/tin.png", size: 1.3 },
  { id: "hug",       name: "Hug",       icon: "🤗", rarity: 4, sprite: "assets/buddies/hug.png", size: 1.3 },
  { id: "alan",      name: "Alan",      icon: "👽", rarity: 4, sprite: "assets/buddies/alan.png", size: 1.3 },
  { id: "catherine", name: "Catherine", icon: "🐱", rarity: 4, sprite: "assets/buddies/catherine.png", size: 1.3 },
  { id: "dragon",  name: "Inkwing the Dragon", icon: "🐉", rarity: 5 },
  { id: "unicorn", name: "Starlight",          icon: "🦄", rarity: 5 },
  { id: "phoenix", name: "Cinder",             icon: "🐦‍🔥", rarity: 5 },
  { id: "angry_teto", name: "Angry Teto",    icon: "😠", rarity: 5, sprite: "assets/buddies/angry_teto.png", size: 1.3 },
];

// Banners. Each one features a buddy that gets the rate-up for its rarity.
// Add a banner here to make it appear on the Wish page.
const BANNERS = [
  { id: "teto",  name: "Red Pen Fury",  featured: "angry_teto", blurb: "Angry Teto has graded your essay. You will be revising." },
  { id: "ink",   name: "Midnight Ink",  featured: "dragon",  blurb: "Inkwing never misses a deadline." },
  { id: "star",  name: "Starlit Study", featured: "unicorn", blurb: "Starlight makes every all-nighter sparkle." },
];

const WISH = {
  costPerWish: 1,         // gems per wish — so 10 wishes = 10 gems
  rates: { 5: 0.03, 4: 0.17, 3: 0.80 },
  featuredShare: 0.5,     // chance a pull of the featured rarity is the featured buddy
  pity5: 50,              // guaranteed legendary on this many wishes without one
  tenPullGuarantee4: true // every 10-wish includes at least one rare or better
};

// ---------- Lists ----------
// Each category is its own task list, picked from the dropdown on the Focus page.
// Add, rename or reorder categories here. `id` is stored in saves, so don't change it once used.
const CATEGORIES = [
  { id: "study",  name: "Study Space",  item: "assignment", placeholder: "Assignment name",        doneLabel: "Submit" },
  { id: "work",   name: "Work Space",   item: "task",       placeholder: "Work task",              doneLabel: "Done" },
  { id: "social", name: "Social Space", item: "plan",       placeholder: "Plan or event",          doneLabel: "Done" },
  { id: "home",   name: "Home Space",   item: "chore",      placeholder: "Chore or errand",        doneLabel: "Done" },
  { id: "health", name: "Health Space", item: "goal",       placeholder: "Workout, habit or goal", doneLabel: "Done" },
];

// Stopwatch and rewards.
const SETTINGS = {
  coinsPerMinute: 1,
  classModeRate: 0.5,     // class mode earns this fraction of normal coins (½), tracked to the half coin

  // Gems: earned by submitting (marking done) an assignment. Each assignment pays out once.
  gemsPerSubmission: 1,
  partnerBonusGems: 1,    // extra gems for submitting a partnered (group) assignment
  defaultGoalMinutes: 25, // each item's goal: focus minutes needed before finishing it earns a gem (editable per item)
  coinsPerGem: 100000,    // exchange rate in the shop
};
