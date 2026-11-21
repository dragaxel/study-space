// Wish page: banner-style gacha for study buddies. Data lives in catalog.js (BUDDIES, BANNERS, WISH).

let currentBanner = BANNERS[0].id;
const buddy = (id) => BUDDIES.find((b) => b.id === id);
const stars = (r) => "★".repeat(r);

function rollRarity(forceAtLeast4) {
  if (state.pity + 1 >= WISH.pity5) return 5;
  const x = Math.random();
  if (x < WISH.rates[5]) return 5;
  if (x < WISH.rates[5] + WISH.rates[4] || forceAtLeast4) return 4;
  return 3;
}

function rollBuddy(rarity, banner) {
  const featured = buddy(banner.featured);
  if (featured.rarity === rarity && Math.random() < WISH.featuredShare) return featured;
  const pool = BUDDIES.filter((b) => b.rarity === rarity && b.id !== banner.featured);
  return pool[Math.floor(Math.random() * pool.length)] || featured;
}

function wish(count) {
  const cost = count * WISH.costPerWish;
  if (state.gems < cost) return;
  state.gems -= cost;
  const banner = BANNERS.find((b) => b.id === currentBanner);
  const results = [];
  for (let i = 0; i < count; i++) {
    // Last pull of a 10-wish is upgraded if nothing rare or better came yet.
    const needs4 = WISH.tenPullGuarantee4 && count >= 10 && i === count - 1 && !results.some((b) => b.rarity >= 4);
    const rarity = rollRarity(needs4);
    state.pity = rarity === 5 ? 0 : state.pity + 1;
    const b = rollBuddy(rarity, banner);
    results.push({ ...b, isNew: !state.buddies[b.id] });
    state.buddies[b.id] = (state.buddies[b.id] || 0) + 1;
  }
  if (!state.activeBuddy) state.activeBuddy = results[0].id;
  saveState();
  renderAll();
  showResults(results);
}

function buddyCard(b, extraClass = "") {
  const div = document.createElement("div");
  div.className = `item r${b.rarity} ${extraClass}`;
  div.innerHTML = `<div class="icon">${b.icon}</div><div class="stars">${stars(b.rarity)}</div><div></div>`;
  div.lastChild.textContent = b.name;
  return div;
}

function showResults(results) {
  const el = $("#wish-results");
  el.innerHTML = "";
  results.forEach((b) => el.appendChild(buddyCard(b, b.isNew ? "new" : "")));
  $("#wish-results-card").hidden = false;
  $("#wish-results-card").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function renderWish() {
  const banner = BANNERS.find((b) => b.id === currentBanner);
  const featured = buddy(banner.featured);

  const tabs = $("#banner-tabs");
  tabs.innerHTML = "";
  if (BANNERS.length > 1) BANNERS.forEach((b) => {
    const btn = document.createElement("button");
    btn.textContent = b.name;
    btn.className = b.id === currentBanner ? "active" : "";
    btn.onclick = () => { currentBanner = b.id; renderWish(); };
    tabs.appendChild(btn);
  });

  $("#banner-art").textContent = featured.icon;
  $("#banner-name").textContent = banner.name;
  $("#banner-blurb").textContent = `Featured: ${featured.name} ${stars(featured.rarity)}. ${banner.blurb}`;
  const pct = (r) => +(WISH.rates[r] * 100).toFixed(1) + "%";
  $("#banner-rates").textContent =
    `Rates: ★★★★★ ${pct(5)} · ★★★★ ${pct(4)} · ★★★ ${pct(3)}. ` +
    `Legendary guaranteed within ${WISH.pity5} wishes (${WISH.pity5 - state.pity} to go).`;

  const one = $("#btn-wish-1"), ten = $("#btn-wish-10");
  one.textContent = `Wish ×1 · ${WISH.costPerWish} gem`;
  ten.textContent = `Wish ×10 · ${WISH.costPerWish * 10} gems`;
  one.disabled = state.gems < WISH.costPerWish;
  ten.disabled = state.gems < WISH.costPerWish * 10;

  // Collection: owned buddies are clickable, others are greyed out.
  const col = $("#buddy-collection");
  col.innerHTML = "";
  [...BUDDIES].sort((a, b) => b.rarity - a.rarity).forEach((b) => {
    const n = state.buddies[b.id] || 0;
    const card = buddyCard(n ? b : { ...b, name: "???" }, n ? "" : "locked");
    if (n) {
      card.lastChild.textContent += ` ×${n}`;
      if (state.activeBuddy === b.id) card.classList.add("selected");
      card.style.cursor = "pointer";
      card.onclick = () => { state.activeBuddy = state.activeBuddy === b.id ? null : b.id; saveState(); renderAll(); };
    }
    col.appendChild(card);
  });

  // Companion on the Focus page.
  const comp = $("#buddy-companion");
  const active = state.activeBuddy && buddy(state.activeBuddy);
  comp.hidden = !active;
  if (active) comp.textContent = `${active.icon} ${active.name} is studying with you`;
}

document.getElementById("btn-wish-1").onclick = () => wish(1);
document.getElementById("btn-wish-10").onclick = () => wish(10);
