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

  // Decorations are placed in the room grid.
  decorations: [
    { id: "plant",  name: "Plant",  icon: "🪴", price: 10 },
    { id: "lamp",   name: "Lamp",   icon: "💡", price: 15 },
    { id: "books",  name: "Books",  icon: "📚", price: 15 },
    { id: "chair",  name: "Chair",  icon: "🪑", price: 20 },
    { id: "clock",  name: "Clock",  icon: "🕰️", price: 25 },
    { id: "frame",  name: "Picture", icon: "🖼️", price: 30 },
    { id: "cat",    name: "Cat",    icon: "🐈", price: 80 },
  ],

  // Mini games. `play` must match a key in GAMES (games.js).
  games: [
    { id: "clicker", name: "Target Tap",   icon: "🎯", price: 40, play: "clicker" },
    { id: "memory",  name: "Memory Match", icon: "🧠", price: 75, play: "memory" },
  ],
};

// Pomodoro settings (minutes).
const SETTINGS = {
  focusMinutes: 25,
  breakMinutes: 5,
  coinsPerMinute: 1,
};
