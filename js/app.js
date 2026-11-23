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
  $("#earn-info").textContent = `Earn ${SETTINGS.coinsPerMinute} coin per focused minute ` +
    `(half in class mode). Reach an item's goal minutes, then finish it to earn ${SETTINGS.gemsPerSubmission} gem ` +
    `(+${SETTINGS.partnerBonusGems} bonus if it's partnered).`;
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

// Each item's goal in focus minutes (older items without one use the default).
const goalOf = (a) => a.goal || SETTINGS.defaultGoalMinutes;
const clampGoal = (v) => Math.min(600, Math.max(1, Math.round(+v) || SETTINGS.defaultGoalMinutes));

// Submitting (marking done) pays gems once per item, if its goal minutes were reached.
function submitAssignment(a) {
  a.done = true;
  if (!a.gemAwarded && a.minutes >= goalOf(a)) {
    const earned = SETTINGS.gemsPerSubmission + (a.partnered ? SETTINGS.partnerBonusGems : 0);
    a.gemAwarded = earned;  // truthy = paid out; the number is how many gems it paid
    state.gems += earned;
  }
}

function applyTheme() {
  const theme = find("themes", state.activeTheme) || CATALOG.themes[0];
  for (const [k, v] of Object.entries(theme.vars)) document.documentElement.style.setProperty(k, v);
}

/* ---------- Stopwatch ---------- */
// Counts up from 0. Time comes from the clock, not from counting ticks, so it stays
// accurate when the tab is in the background. Every full minute pays coins:
// normal minutes also add a minute to the selected item; class minutes pay at a reduced rate.
const timer = { base: 0, startedAt: null, paidMinutes: 0, interval: null };
const elapsedSec = () => timer.base + (timer.startedAt ? (Date.now() - timer.startedAt) / 1000 : 0);

function formatElapsed(sec) {
  sec = Math.floor(sec);
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

function renderTimer() {
  const t = formatElapsed(elapsedSec());
  const running = !!timer.startedAt;
  $("#timer-display").textContent = t;
  $("#timer-mode").textContent = state.classMode ? "in class" : "focus";
  $("#btn-start").textContent = running ? "Pause" : elapsedSec() > 0 ? "Resume" : "Start";
  $("#class-mode").checked = !!state.classMode;
  $("#class-rate").textContent = `(${SETTINGS.classModeRate === 0.5 ? "½" : SETTINGS.classModeRate + "×"} coins)`;
  $(".timer-card").classList.toggle("class-on", !!state.classMode);
  $("#working-on-line").hidden = !!state.classMode;
  document.title = running ? `${t} · Study Space` : "Study Space";
}

function payMinute() {
  if (state.classMode) {
    state.coinFraction = (state.coinFraction || 0) + SETTINGS.coinsPerMinute * SETTINGS.classModeRate;
    const whole = Math.floor(state.coinFraction + 1e-9);
    state.coins += whole;
    state.coinFraction -= whole;
  } else {
    state.coins += SETTINGS.coinsPerMinute;
    const a = state.assignments.find((x) => x.id === state.currentAssignmentId);
    if (a) a.minutes++;
  }
}

function tick() {
  const minutes = Math.floor(elapsedSec() / 60);
  if (minutes > timer.paidMinutes) {
    while (timer.paidMinutes < minutes) { payMinute(); timer.paidMinutes++; }
    saveState();
    renderCoins();
    renderAssignments();
  }
  renderTimer();
}

function pauseTimer() {
  if (!timer.startedAt) return;
  tick();
  timer.base = elapsedSec();
  timer.startedAt = null;
  clearInterval(timer.interval);
}

$("#btn-start").onclick = () => {
  if (timer.startedAt) pauseTimer();
  else { timer.startedAt = Date.now(); timer.interval = setInterval(tick, 250); }
  renderTimer();
};
$("#btn-reset").onclick = () => {
  pauseTimer();
  timer.base = 0;
  timer.paidMinutes = 0;
  renderTimer();
};
$("#class-mode").onchange = (e) => {
  const on = e.target.checked; // read before tick(), which re-renders the switch from state
  tick(); // pay any finished minute at the old rate first
  state.classMode = on;
  saveState();
  renderAll();
};

/* ---------- Assignments ---------- */
$("#assignment-form").onsubmit = (e) => {
  e.preventDefault();
  const name = $("#assignment-input").value.trim();
  if (!name) return;
  const deadline = $("#assignment-deadline").value || null; // "YYYY-MM-DDTHH:MM" local time
  const partnered = $("#assignment-partnered").checked;
  const partners = partnered ? $("#assignment-partners").value.trim() : "";
  const goal = clampGoal($("#assignment-goal").value);
  const a = { id: Date.now().toString(36), name, minutes: 0, goal, done: false, deadline, partnered, partners, category: state.activeCategory };
  state.assignments.push(a);
  if (!state.currentAssignmentId) state.currentAssignmentId = a.id;
  $("#assignment-input").value = "";
  $("#assignment-deadline").value = "";
  $("#assignment-goal").value = SETTINGS.defaultGoalMinutes;
  $("#assignment-partnered").checked = false;
  $("#assignment-partners").value = "";
  $("#assignment-partners").hidden = true;
  saveState();
  renderAssignments();
};

// "2d 4h left", "3h 10m left", "overdue by 1d 2h"
$("#assignment-partnered").onchange = (e) => { $("#assignment-partners").hidden = !e.target.checked; };

function timeLeftText(deadline) {
  const ms = new Date(deadline) - Date.now();
  const mins = Math.floor(Math.abs(ms) / 60000);
  const d = Math.floor(mins / 1440), h = Math.floor((mins % 1440) / 60), m = mins % 60;
  const span = d ? `${d}d ${h}h` : h ? `${h}h ${m}m` : `${m}m`;
  if (ms < 0) return { text: `overdue by ${span}`, cls: "overdue" };
  return { text: `${span} left`, cls: ms < 86400000 ? "soon" : "left" }; // under 24h = soon
}

function formatDeadline(deadline) {
  return new Date(deadline).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

/* ---------- Lists (categories) ---------- */
const activeCat = () => CATEGORIES.find((c) => c.id === state.activeCategory) || CATEGORIES[0];
const catOf = (a) => CATEGORIES.find((c) => c.id === a.category) || CATEGORIES[0];

$("#category-select").onchange = (e) => {
  state.activeCategory = e.target.value;
  saveState();
  renderAssignments();
};

function renderCategories() {
  const sel = $("#category-select");
  const open = (id) => state.assignments.filter((a) => a.category === id && !a.done).length;
  sel.innerHTML = "";
  CATEGORIES.forEach((c) => {
    const o = document.createElement("option");
    o.value = c.id;
    o.textContent = c.name + (open(c.id) ? ` (${open(c.id)})` : "");
    sel.appendChild(o);
  });
  sel.value = activeCat().id;
  const c = activeCat();
  $("#list-title").textContent = c.name;
  $("#assignment-input").placeholder = c.placeholder;
  $("#list-help").textContent =
    `Add each ${c.item} and when it's due. Click a name to focus on it, then ${c.doneLabel} when it's finished.`;
}

// Unfinished first, soonest deadline first; no deadline after those; submitted at the bottom.
function sortedAssignments() {
  const key = (a) => [a.done ? 1 : 0, a.deadline ? new Date(a.deadline).getTime() : Infinity, a.partnered ? 0 : 1];
  return state.assignments.filter((a) => a.category === activeCat().id).sort((x, y) => {
    const [a1, a2, a3] = key(x), [b1, b2, b3] = key(y);
    return a1 - b1 || (a2 === b2 ? 0 : a2 - b2) || a3 - b3;
  });
}

function renderDue(a, el) {
  el.innerHTML = "";
  if (a.editingDeadline) {
    const input = document.createElement("input");
    input.type = "datetime-local";
    input.value = a.deadline || "";
    const pLabel = document.createElement("label");
    pLabel.innerHTML = `<input type="checkbox"> partnered`;
    const pBox = pLabel.querySelector("input");
    pBox.checked = !!a.partnered;
    const names = document.createElement("input");
    names.placeholder = "partner names"; names.maxLength = 80; names.value = a.partners || "";
    names.hidden = !pBox.checked;
    pBox.onchange = () => { names.hidden = !pBox.checked; };
    const gLabel = document.createElement("label");
    gLabel.innerHTML = `goal <input type="number" min="1" max="600" step="1" class="goal-input"> min`;
    const gInput = gLabel.querySelector("input");
    gInput.value = goalOf(a);
    const save = document.createElement("button");
    save.className = "link"; save.textContent = "save";
    save.onclick = () => {
      a.deadline = input.value || null;
      a.goal = clampGoal(gInput.value);
      a.partnered = pBox.checked;
      a.partners = pBox.checked ? names.value.trim() : "";
      delete a.editingDeadline; saveState(); renderAssignments();
    };
    el.append(input, gLabel, pLabel, names, save);
    return;
  }
  if (a.deadline) {
    const due = document.createElement("span");
    due.textContent = "due " + formatDeadline(a.deadline);
    el.appendChild(due);
    if (!a.done) {
      const t = timeLeftText(a.deadline);
      const left = document.createElement("span");
      left.className = t.cls; left.textContent = "· " + t.text;
      el.appendChild(left);
    }
  }
  const edit = document.createElement("button");
  edit.className = "link"; edit.textContent = a.deadline ? "edit" : "set deadline";
  edit.onclick = () => { a.editingDeadline = true; renderAssignments(); };
  el.appendChild(edit);
}

function renderAssignments() {
  const list = $("#assignment-list");
  list.innerHTML = "";
  renderCategories();
  const items = sortedAssignments();
  if (!items.length) list.innerHTML = `<li class="small">Nothing in ${activeCat().name} yet.</li>`;
  items.forEach((a) => {
    const li = document.createElement("li");
    li.className = [a.id === state.currentAssignmentId && "selected", a.done && "done", a.partnered && "partnered"].filter(Boolean).join(" ");
    const gemsPaid = a.gemAwarded === true ? 1 : a.gemAwarded; // older saves stored `true`
    li.innerHTML = `<div class="info"><div><span class="name"></span></div><div class="due"></div></div>
      <span class="mins${a.minutes >= goalOf(a) ? " met" : ""}" title="focus minutes / goal">${a.minutes}/${goalOf(a)} min${a.minutes >= goalOf(a) ? " ✓" : ""}</span>
      ${gemsPaid ? `<span class="gem-tag">+${gemsPaid} gem${gemsPaid > 1 ? "s" : ""}</span>` : ""}
      <button data-act="done">${a.done ? "Undo" : catOf(a).doneLabel}</button><button data-act="del">✕</button>`;
    li.querySelector(".name").textContent = a.name;
    if (a.partnered) {
      const tag = document.createElement("span");
      tag.className = "partner-tag";
      tag.textContent = "partnered" + (a.gemAwarded ? "" : ` · +${SETTINGS.partnerBonusGems} bonus gem`);
      li.querySelector(".name").after(tag);
      if (!a.done) {
        const note = document.createElement("div");
        note.className = "counting";
        const plural = /,|&| and /i.test(a.partners || "");
        note.textContent = `${a.partners || "Your group"} ${plural ? "are" : "is"} counting on you`;
        li.querySelector(".info").appendChild(note);
      }
    }
    renderDue(a, li.querySelector(".due"));
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
  $("#current-assignment").textContent = cur ? `${cur.name} (${catOf(cur).name})` : "nothing selected";
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
  const sections = { themes: "#shop-themes", backdrops: "#shop-backdrops", decorations: "#shop-decorations", games: "#shop-games" };
  for (const [kind, sel] of Object.entries(sections)) {
    const el = $(sel);
    el.innerHTML = "";
    CATALOG[kind].forEach((item) => {
      const owned = state.owned[kind].includes(item.id);
      const div = document.createElement("div");
      div.className = "item";
      const visual = kind === "themes"
        ? `<div class="swatch" style="background:${item.vars["--accent"]}"></div>`
        : kind === "backdrops"
        ? `<div class="backdrop-swatch" style='background:${backdropCSS(item)}'></div>`
        : `<div class="icon">${artHTML(item)}</div>`;
      div.innerHTML = `${visual}<div>${item.name}</div>`;
      const btn = document.createElement("button");

      if (kind === "themes" && owned) {
        const active = state.activeTheme === item.id;
        btn.textContent = active ? "In use" : "Use";
        btn.disabled = active;
        btn.onclick = () => { state.activeTheme = item.id; saveState(); applyTheme(); renderShop(); };
      } else if (kind === "backdrops" && owned) {
        const active = state.stage.backdrop === item.id;
        btn.textContent = active ? "In use" : "Use";
        btn.disabled = active;
        btn.onclick = () => { state.stage.backdrop = item.id; saveState(); renderAll(); };
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

/* ---------- Space: see js/space.js ---------- */

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
    div.innerHTML = `<div class="icon">${artHTML(g)}</div><div>${g.name}</div>`;
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
  renderWish();
}

applyTheme();
$("#assignment-goal").value = SETTINGS.defaultGoalMinutes;
renderAll();
// Keep the "time left" countdowns fresh (skip while a deadline is being edited).
setInterval(() => { if (!state.assignments.some((a) => a.editingDeadline)) renderAssignments(); }, 30000);
