// Space: a drag-and-drop sticker stage, dress-up / room-maker style.
// Stickers are decorations (from the Shop) and study buddies (from Wish).
// Positions are stored as % of the stage, so the scene scales with screen size.

let selectedSticker = null; // uid of the selected sticker on stage
const SCALE_MIN = 0.4, SCALE_MAX = 3, SCALE_STEP = 0.2;

function stickerInfo(kind, id) {
  return kind === "buddy" ? BUDDIES.find((b) => b.id === id) : CATALOG.decorations.find((d) => d.id === id);
}

// Decorations: copies owned minus copies on stage. Buddies: one of each owned buddy.
function trayCounts() {
  const placed = {};
  state.stage.items.forEach((it) => (placed[it.kind + ":" + it.id] = (placed[it.kind + ":" + it.id] || 0) + 1));
  const decor = {}, buddies = {};
  state.owned.decorations.forEach((id) => (decor[id] = (decor[id] || 0) + 1));
  for (const id in decor) decor[id] -= placed["decor:" + id] || 0;
  for (const id in state.buddies) if (state.buddies[id] > 0) buddies[id] = 1 - (placed["buddy:" + id] || 0);
  return { decor, buddy: buddies };
}

function stagePercent(clientX, clientY) {
  const r = $("#stage").getBoundingClientRect();
  return {
    x: ((clientX - r.left) / r.width) * 100,
    y: ((clientY - r.top) / r.height) * 100,
    inside: clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom,
  };
}

function addSticker(kind, id, x = 50, y = 60) {
  const it = { uid: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), kind, id, x, y, s: 1, flip: false };
  state.stage.items.push(it);
  selectedSticker = it.uid;
  saveState();
  renderSpace();
}

function removeSticker(uid) {
  state.stage.items = state.stage.items.filter((it) => it.uid !== uid);
  if (selectedSticker === uid) selectedSticker = null;
  saveState();
  renderSpace();
}

/* ---------- Stage ---------- */
function renderStage() {
  const stage = $("#stage");
  const bd = CATALOG.backdrops.find((b) => b.id === state.stage.backdrop) || CATALOG.backdrops[0];
  stage.style.background = backdropCSS(bd);
  stage.innerHTML = "";

  state.stage.items.forEach((it) => {
    const info = stickerInfo(it.kind, it.id);
    if (!info) return;
    const el = document.createElement("div");
    el.className = "sticker" + (it.uid === selectedSticker ? " selected" : "");
    el.innerHTML = artHTML(info);
    el.title = info.name;
    el.style.left = it.x + "%";
    el.style.top = it.y + "%";
    el.style.setProperty("--s", it.s * (info.size || 1));
    el.style.setProperty("--flip", it.flip ? -1 : 1);
    el.onpointerdown = (e) => startMove(e, it, el);
    stage.appendChild(el);
  });

  $("#sticker-tools").hidden = !state.stage.items.some((it) => it.uid === selectedSticker);
}

// Move a sticker already on the stage. Dropping it outside the stage puts it away.
function startMove(e, it, el) {
  e.preventDefault();
  e.stopPropagation();
  selectedSticker = it.uid;
  document.querySelectorAll(".sticker.selected").forEach((s) => s.classList.remove("selected"));
  el.classList.add("selected", "dragging");
  $("#sticker-tools").hidden = false;
  el.setPointerCapture(e.pointerId);
  const start = stagePercent(e.clientX, e.clientY);
  const off = { x: it.x - start.x, y: it.y - start.y };

  el.onpointermove = (ev) => {
    const p = stagePercent(ev.clientX, ev.clientY);
    it.x = p.x + off.x;
    it.y = p.y + off.y;
    el.style.left = it.x + "%";
    el.style.top = it.y + "%";
    el.style.opacity = p.inside ? 1 : 0.4; // hint: let go here to put it away
  };
  el.onpointerup = (ev) => {
    el.onpointermove = el.onpointerup = null;
    if (!stagePercent(ev.clientX, ev.clientY).inside) return removeSticker(it.uid);
    it.x = Math.min(100, Math.max(0, it.x));
    it.y = Math.min(100, Math.max(0, it.y));
    saveState();
    renderSpace();
  };
}

// Tapping empty stage clears the selection.
document.getElementById("stage").onpointerdown = (e) => {
  if (e.target.id === "stage" && selectedSticker) { selectedSticker = null; renderStage(); }
};

/* ---------- Toolbar ---------- */
document.getElementById("sticker-tools").onclick = (e) => {
  const tool = e.target.dataset.tool;
  const items = state.stage.items;
  const i = items.findIndex((it) => it.uid === selectedSticker);
  if (!tool || i < 0) return;
  const it = items[i];
  if (tool === "bigger") it.s = Math.min(SCALE_MAX, +(it.s + SCALE_STEP).toFixed(2));
  if (tool === "smaller") it.s = Math.max(SCALE_MIN, +(it.s - SCALE_STEP).toFixed(2));
  if (tool === "flip") it.flip = !it.flip;
  if (tool === "front" && i < items.length - 1) [items[i], items[i + 1]] = [items[i + 1], items[i]];
  if (tool === "back" && i > 0) [items[i], items[i - 1]] = [items[i - 1], items[i]];
  if (tool === "remove") return removeSticker(it.uid);
  saveState();
  renderStage();
};

document.getElementById("btn-clear-stage").onclick = () => {
  if (!state.stage.items.length || !confirm("Put every sticker back in the tray?")) return;
  state.stage.items = [];
  selectedSticker = null;
  saveState();
  renderSpace();
};

/* ---------- Tray ---------- */
// Drag a chip onto the stage to place it; a plain tap drops it in the middle.
function startTrayDrag(e, kind, id, info) {
  e.preventDefault();
  const chip = e.currentTarget;
  chip.setPointerCapture(e.pointerId);
  const sx = e.clientX, sy = e.clientY;
  let ghost = null;

  chip.onpointermove = (ev) => {
    if (!ghost && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 6) return;
    if (!ghost) {
      ghost = document.createElement("div");
      ghost.className = "drag-ghost";
      ghost.innerHTML = artHTML(info);
      document.body.appendChild(ghost);
    }
    ghost.style.left = ev.clientX + "px";
    ghost.style.top = ev.clientY + "px";
  };
  chip.onpointerup = (ev) => {
    chip.onpointermove = chip.onpointerup = null;
    if (!ghost) return addSticker(kind, id); // tap
    ghost.remove();
    const p = stagePercent(ev.clientX, ev.clientY);
    if (p.inside) addSticker(kind, id, p.x, p.y);
  };
}

function renderTrayRow(el, kind, counts, emptyText) {
  el.innerHTML = "";
  const ids = Object.keys(counts).filter((id) => counts[id] > 0);
  if (!ids.length) { el.innerHTML = `<div class="empty">${emptyText}</div>`; return; }
  ids.forEach((id) => {
    const info = stickerInfo(kind, id);
    if (!info) return;
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.title = info.name;
    chip.innerHTML = `<div class="icon">${artHTML(info)}</div><div>${kind === "decor" ? "×" + counts[id] : ""}</div>`;
    chip.onpointerdown = (e) => startTrayDrag(e, kind, id, info);
    el.appendChild(chip);
  });
}

function renderTray() {
  const counts = trayCounts();
  renderTrayRow($("#tray-decor"), "decor", counts.decor, "All placed, or none yet. Buy more in the Shop.");
  renderTrayRow($("#tray-buddies"), "buddy", counts.buddy, "All placed, or none yet. Wish for buddies on the Wish page.");

  const picker = $("#backdrop-picker");
  picker.innerHTML = "";
  CATALOG.backdrops.filter((b) => state.owned.backdrops.includes(b.id)).forEach((b) => {
    const chip = document.createElement("div");
    chip.className = "chip" + (state.stage.backdrop === b.id ? " active" : "");
    chip.style.cursor = "pointer";
    chip.innerHTML = `<div class="backdrop-swatch" style='background:${backdropCSS(b)}'></div><div>${b.name}</div>`;
    chip.onclick = () => { state.stage.backdrop = b.id; saveState(); renderSpace(); renderShop(); };
    picker.appendChild(chip);
  });
}

function renderSpace() { renderStage(); renderTray(); }
