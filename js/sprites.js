// Artwork helper. Any catalog entry (decoration, study buddy, mini game) can use either:
//   icon:   "🪴"                              an emoji (always required: it is the fallback)
//   sprite: "assets/decorations/desk.png"     a PNG, path relative to index.html
// Optional for sprites:
//   pixelated: true   keep hard pixel edges when scaled up (for pixel art)
//   size: 1.5         make it bigger/smaller on the Space stage than the default
// If the PNG fails to load, the emoji is shown instead and a warning goes to the console.

const escapeAttr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function spriteFailed(img) {
  console.warn(`Study Space: sprite not found: ${img.getAttribute("src")} (showing emoji instead)`);
  const span = document.createElement("span");
  span.textContent = img.dataset.fallback || "?";
  img.replaceWith(span);
}

// Returns HTML for an item's art. Size follows the surrounding font-size (1em tall),
// so the same call works in the shop, tray, stage and wish results.
function artHTML(item) {
  if (!item) return "";
  if (item.sprite) {
    return `<img class="sprite${item.pixelated ? " pixelated" : ""}" src="${escapeAttr(item.sprite)}" alt="${escapeAttr(item.name || "")}"` +
      ` draggable="false" data-fallback="${escapeAttr(item.icon || "?")}" onerror="spriteFailed(this)">`;
  }
  return `<span>${escapeAttr(item.icon || "?")}</span>`;
}

// Background CSS for a Space backdrop: an image if given, else flat wall + floor colours.
function backdropCSS(bd) {
  if (bd.image) return `url("${bd.image}") center / cover no-repeat, ${bd.wall || "#eee"}`;
  return `linear-gradient(${bd.wall} 0 66%, ${bd.floor} 66% 100%)`;
}
