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

  // Backdrops for the Space stage: a wall colour and a floor colour.
  backdrops: [
    { id: "plain",  name: "Cozy Room",  price: 0,   wall: "#efe9df", floor: "#d9cbb5" },
    { id: "mint",   name: "Mint Study", price: 40,  wall: "#d8efe4", floor: "#b9a58a" },
    { id: "night",  name: "Night Loft", price: 60,  wall: "#2b2f4a", floor: "#4a3f35" },
    { id: "garden", name: "Garden",     price: 80,  wall: "#cfe6f7", floor: "#9cc98a" },
  ],

  // Decorations are stickers you drag onto the Space stage. Buy as many copies as you like.
  decorations: [
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
const BUDDIES = [
  { id: "frog",    name: "Pip the Frog",       icon: "🐸", rarity: 3 },
  { id: "turtle",  name: "Shelly the Turtle",  icon: "🐢", rarity: 3 },
  { id: "hamster", name: "Nibbles the Hamster", icon: "🐹", rarity: 3 },
  { id: "chick",   name: "Peep the Chick",     icon: "🐥", rarity: 3 },
  { id: "snail",   name: "Slowpoke the Snail", icon: "🐌", rarity: 3 },
  { id: "owl",     name: "Professor Hoot",     icon: "🦉", rarity: 4 },
  { id: "fox",     name: "Ember the Fox",      icon: "🦊", rarity: 4 },
  { id: "penguin", name: "Waddles",            icon: "🐧", rarity: 4 },
  { id: "panda",   name: "Bao the Panda",      icon: "🐼", rarity: 4 },
  { id: "dragon",  name: "Inkwing the Dragon", icon: "🐉", rarity: 5 },
  { id: "unicorn", name: "Starlight",          icon: "🦄", rarity: 5 },
  { id: "phoenix", name: "Cinder",             icon: "🐦‍🔥", rarity: 5 },
];

// Banners. Each one features a buddy that gets the rate-up for its rarity.
// Add a banner here to make it appear on the Wish page.
const BANNERS = [
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

// Pomodoro settings (minutes).
const SETTINGS = {
  focusMinutes: 25,
  breakMinutes: 5,
  coinsPerMinute: 1,

  // Gems: earned by submitting (marking done) an assignment. Each assignment pays out once.
  gemsPerSubmission: 1,
  partnerBonusGems: 1,    // extra gems for submitting a partnered (group) assignment
  minMinutesForGem: 25,   // focus minutes an assignment needs before it can earn a gem
  coinsPerGem: 100000,    // exchange rate in the shop
};
