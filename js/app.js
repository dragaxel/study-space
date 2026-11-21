// Study Space — UI wiring.

const $ = (sel) => document.querySelector(sel);
const find = (kind, id) => CATALOG[kind].find((x) => x.id === id);

/* ---------- Tabs ---------- */
document.querySelectorAll(".tabs button").forEach((btn) => {
  btn.onclick = () => {
    document.querySelectorAll(".tabs button").forEach((b) => b.classList.toggle("active", b === btn));
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.id === "tab-" + btn.dataset.tab));
  };
});

/* ---------- Coins & theme ---------- */
function renderCoins() {
  $("#coin-count").textContent = state.coins.toLocaleString();
  $("#gem-count").textContent = state.gems.toLocaleString();
  $("#earn-info").textContent = `Earn ${SETTINGS.coinsPerMinute} coin per focused minute. ` +
    `Submit an assignment with ${SETTINGS.minMinutesForGem}+ focus minutes to earn ${SETTINGS.gemsPerSubmission} gem.`;
  $("#exchange-info").textContent = `1 gem = ${SETTINGS.coinsPerGem.toLocaleString()} coins.`;
  $("#btn-exchange").disabled = state.gems < 1;
}

$("#btn-exchange").onclick = () => {
  if (state.gems < 1) return;
  state.gems--;
  state.coins += SETTINGS.coinsPerGem;
  saveState();
  renderAll();
};

// Submitting (marking done) pays gems once per assignment, if enough focus time was logged.
function submitAssignment(a) {
  a.done = true;
  if (!a.gemAwarded && a.minutes >= SETTINGS.minMinutesForGem) {
    a.gemAwarded = true;
    state.gems += SETTINGS.gemsPerSubmission;
  }
}

function applyTheme() {
  const theme = find("themes", state.activeTheme) || CATALOG.themes[0];
  for (const [k, v] of Object.entries(theme.vars)) document.documentElement.style.setProperty(k, v);
}

/* ---------- Pomodoro timer ---------- */
const timer = { mode: "focus", remaining: SETTINGS.focusMinutes * 60, running: false, interval: null, secondsInMinute: 0 };

function renderTimer() {
  const m = String(Math.floor(timer.remaining / 60)).padStart(2, "0");
  const s = String(timer.remaining % 60).padStart(2, "0");
  $("#timer-display").textContent = `${m}:${s}`;
  $("#timer-mode").textContent = timer.mode === "focus" ? "focus" : "break";
  $("#btn-start").textContent = timer.running ? "Pause" : "Start";
  document.title = timer.running ? `${m}:${s} · Study Space` : "Study Space";
}

function tick() {
  timer.remaining--;
  if (timer.mode === "focus") {
    timer.secondsInMinute++;
    if (timer.secondsInMinute >= 60) {   // a full focused minute: pay out
      timer.secondsInMinute = 0;
      state.coins += SETTINGS.coinsPerMinute;
      const a = state.assignments.find((x) => x.id === state.currentAssignmentId);
      if (a) a.minutes++;
      saveState();
      renderCoins();
      renderAssignments();
    }
  }
  if (timer.remaining <= 0) switchMode();
  renderTimer();
}

function switchMode() {
  timer.mode = timer.mode === "focus" ? "break" : "focus";
  timer.remaining = (timer.mode === "focus" ? SETTINGS.focusMinutes : SETTINGS.breakMinutes) * 60;
  timer.secondsInMinute = 0;
}

$("#btn-start").onclick = () => {
  timer.running = !timer.running;
  if (timer.running) timer.interval = setInterval(tick, 1000);
  else clearInterval(timer.interval);
  renderTimer();
};
$("#btn-reset").onclick = () => {
  timer.remaining = (timer.mode === "focus" ? SETTINGS.focusMinutes : SETTINGS.breakMinutes) * 60;
  timer.secondsInMinute = 0;
  renderTimer();
};
$("#btn-skip").onclick = () => { switchMode(); renderTimer(); };

/* ---------- Assignments ---------- */
$("#assignment-form").onsubmit = (e) => {
  e.preventDefault();
  const name = $("#assignment-input").value.trim();
  if (!name) return;
  const a = { id: Date.now().toString(36), name, minutes: 0, done: false };
  state.assignments.push(a);
  if (!state.currentAssignmentId) state.currentAssignmentId = a.id;
  $("#assignment-input").value = "";
  saveState();
  renderAssignments();
};

function renderAssignments() {
  const list = $("#assignment-list");
  list.innerHTML = "";
  if (!state.assignments.length) list.innerHTML = `<li class="small">No assignments yet.</li>`;
  state.assignments.forEach((a) => {
    const li = document.createElement("li");
    li.className = (a.id === state.currentAssignmentId ? "selected " : "") + (a.done ? "done" : "");
    li.innerHTML = `<span class="name"></span><span class="mins">${a.minutes} min</span>
      ${a.gemAwarded ? '<span class="gem-tag">+gem</span>' : ""}
      <button data-act="done">${a.done ? "Undo" : "Submit"}</button><button data-act="del">✕</button>`;
    li.querySelector(".name").textContent = a.name;
    li.querySelector(".name").onclick = () => { state.currentAssignmentId = a.id; saveState(); renderAssignments(); };
    li.querySelector('[data-act="done"]').onclick = () => {
      if (a.done) a.done = false; else submitAssignment(a);
      saveState(); renderAll();
    };
    li.querySelector('[data-act="del"]').onclick = () => {
      state.assignments = state.assignments.filter((x) => x !== a);
      if (state.currentAssignmentId === a.id) state.currentAssignmentId = null;
      saveState(); renderAssignments();
    };
    list.appendChild(li);
  });
  const cur = state.assignments.find((x) => x.id === state.currentAssignmentId);
  $("#current-assignment").textContent = cur ? cur.name : "nothing selected";
}

/* ---------- Shop ---------- */
function buy(kind, item) {
  if (state.coins < item.price) return;
  state.coins -= item.price;
  state.owned[kind].push(item.id);
  saveState();
  renderAll();
}

function renderShop() {
  const sections = { themes: "#shop-themes", decorations: "#shop-decorations", games: "#shop-games" };
  for (const [kind, sel] of Object.entries(sections)) {
    const el = $(sel);
    el.innerHTML = "";
    CATALOG[kind].forEach((item) => {
      const owned = state.owned[kind].includes(item.id);
      const div = document.createElement("div");
      div.className = "item";
      const visual = kind === "themes"
        ? `<div class="swatch" style="background:${item.vars["--accent"]}"></div>`
        : `<div class="icon">${item.icon}</div>`;
      div.innerHTML = `${visual}<div>${item.name}</div>`;
      const btn = document.createElement("button");

      if (kind === "themes" && owned) {
        const active = state.activeTheme === item.id;
        btn.textContent = active ? "In use" : "Use";
        btn.disabled = active;
        btn.onclick = () => { state.activeTheme = item.id; saveState(); applyTheme(); renderShop(); };
      } else if (owned && kind === "games") {
        btn.textContent = "Owned"; btn.disabled = true;
      } else {
        // Decorations can be bought multiple times.
        const count = state.owned[kind].filter((x) => x === item.id).length;
        btn.textContent = `${item.price} coins` + (count ? ` (own ${count})` : "");
        btn.disabled = state.coins < item.price;
        btn.className = "primary";
        btn.onclick = () => buy(kind, item);
      }
      div.appendChild(btn);
      el.appendChild(div);
    });
  }
}

/* ---------- Space (room decorating) ---------- */
let selectedDecoration = null;

// How many of each decoration are owned but not yet placed.
function unplacedCounts() {
  const counts = {};
  state.owned.decorations.forEach((id) => (counts[id] = (counts[id] || 0) + 1));
  state.room.forEach((id) => id && counts[id]--);
  return counts;
}

function renderRoom() {
  const room = $("#room");
  room.innerHTML = "";
  state.room.forEach((id, i) => {
    const slot = document.createElement("div");
    slot.className = "slot" + (i >= state.room.length - 6 ? " floor" : "");
    slot.textContent = id ? find("decorations", id).icon : "";
    slot.onclick = () => {
      if (id) state.room[i] = null;                    // pick up
      else if (selectedDecoration && unplacedCounts()[selectedDecoration] > 0) state.room[i] = selectedDecoration;
      if (selectedDecoration && !(unplacedCounts()[selectedDecoration] > 0)) selectedDecoration = null;
      saveState();
      renderSpace();
    };
    room.appendChild(slot);
  });
}

function renderInventory() {
  const inv = $("#inventory");
  inv.innerHTML = "";
  const counts = unplacedCounts();
  const ids = Object.keys(counts).filter((id) => counts[id] > 0);
  if (!ids.length) { inv.innerHTML = `<div class="small">Nothing to place. Buy decorations in the Shop.</div>`; return; }
  ids.forEach((id) => {
    const d = find("decorations", id);
    const div = document.createElement("div");
    div.className = "item" + (selectedDecoration === id ? " selected" : "");
    div.innerHTML = `<div class="icon">${d.icon}</div><div>${d.name} ×${counts[id]}</div>`;
    div.style.cursor = "pointer";
    div.onclick = () => { selectedDecoration = selectedDecoration === id ? null : id; renderInventory(); };
    inv.appendChild(div);
  });
}

function renderSpace() { renderRoom(); renderInventory(); }

/* ---------- Mini games ---------- */
let cleanupGame = null;

function renderGames() {
  const el = $("#games-list");
  el.innerHTML = "";
  const owned = CATALOG.games.filter((g) => state.owned.games.includes(g.id));
  if (!owned.length) { el.innerHTML = `<div class="small">No games yet. Unlock them in the Shop with study coins.</div>`; return; }
  owned.forEach((g) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<div class="icon">${g.icon}</div><div>${g.name}</div>`;
    const btn = document.createElement("button");
    btn.textContent = "Play";
    btn.className = "primary";
    btn.onclick = () => startGame(g);
    div.appendChild(btn);
    el.appendChild(div);
  });
}

function startGame(g) {
  closeGame();
  $("#game-stage-card").hidden = false;
  $("#game-title").textContent = g.name;
  cleanupGame = GAMES[g.play]($("#game-stage")) || null;
}

function closeGame() {
  if (cleanupGame) cleanupGame();
  cleanupGame = null;
  $("#game-stage").innerHTML = "";
  $("#game-stage-card").hidden = true;
}
$("#btn-close-game").onclick = closeGame;

/* ---------- Boot ---------- */
function renderAll() {
  renderCoins();
  renderTimer();
  renderAssignments();
  renderShop();
  renderSpace();
  renderGames();
}

applyTheme();
renderAll();
