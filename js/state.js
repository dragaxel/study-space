// Saved progress, stored in the browser's localStorage.

const STORAGE_KEY = "study-space-v1";

function defaultState() {
  return {
    coins: 0,
    gems: 0,
    assignments: [],          // { id, name, minutes, done, gemAwarded }
    currentAssignmentId: null,
    activeCategory: "study",  // which list the dropdown shows
    owned: { themes: ["default"], decorations: [], games: [], backdrops: ["plain"] },
    activeTheme: "default",
    // Space stage. items are stickers in back-to-front order:
    // { uid, kind: "decor" | "buddy", id, x, y (centre, % of stage), s (scale), flip }
    stage: { backdrop: "plain", items: [] },
    buddies: {},              // buddy id -> copies owned
    activeBuddy: null,        // buddy shown on the Focus page
    pity: 0,                  // wishes since last legendary
  };
}

// Fill in anything missing from older saves (also used when loading a save code).
function normalizeState(saved) {
  const base = defaultState();
  const s = { ...base, ...saved };
  s.owned = { ...base.owned, ...(saved.owned || {}) };
  s.stage = { ...base.stage, ...(saved.stage || {}) };
  // Saves from before lists existed: everything was homework.
  s.assignments = (s.assignments || []).map((a) => (a.category ? a : { ...a, category: "study" }));
  // v1 saves had a 6x4 grid "room": turn each filled slot into a sticker in the same spot.
  if (Array.isArray(saved.room)) {
    saved.room.forEach((id, i) => {
      if (id) s.stage.items.push({ uid: "m" + i, kind: "decor", id, x: ((i % 6) + 0.5) / 6 * 100, y: (Math.floor(i / 6) + 0.5) / 4 * 100, s: 1, flip: false });
    });
    delete s.room;
  }
  return s;
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) return normalizeState(saved);
  } catch (e) { /* storage unavailable or corrupt: start fresh */ }
  return defaultState();
}

let state = loadState();

// UI-only fields that never get saved.
const serializeState = (s) => JSON.stringify(s, (k, v) => (k === "editingDeadline" ? undefined : v));

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, serializeState(state)); } catch (e) {}
}
