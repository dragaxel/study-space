// Saved progress, stored in the browser's localStorage.

const STORAGE_KEY = "study-space-v1";
const ROOM_SLOTS = 24; // 6 x 4 grid

function defaultState() {
  return {
    coins: 0,
    gems: 0,
    assignments: [],          // { id, name, minutes, done, gemAwarded }
    currentAssignmentId: null,
    owned: { themes: ["default"], decorations: [], games: [] },
    activeTheme: "default",
    room: Array(ROOM_SLOTS).fill(null), // decoration id per slot
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) return { ...defaultState(), ...saved };
  } catch (e) { /* storage unavailable or corrupt: start fresh */ }
  return defaultState();
}

let state = loadState();

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state, (k, v) => (k === "editingDeadline" ? undefined : v))); } catch (e) {}
}
