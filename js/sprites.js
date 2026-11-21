// Artwork helper. Any catalog entry (decoration, study buddy, mini game) can use either:
//   icon:   "🪴"                              an emoji (always required: it is the fallback)
//   sprite: "assets/decorations/desk.png"     a PNG (or WebP/JPG), path relative to index.html
// Optional for sprites:
//   pixelated: true   keep hard pixel edges when scaled up (for pixel art)
//   size: 1.5         make it bigger/smaller on the Space stage than the default
//   trim: false       keep the transparent margin around the art (default: trimmed off)
// If the image fails to load, the emoji is shown instead and a warning goes to the console.
//
// Large images: the first time a sprite is shown it is trimmed to its visible pixels and
// downscaled to at most SPRITE_MAX_PX on its longest side, then reused everywhere. This keeps
// big artwork sharp, correctly sized and fast. It needs the page served over http(s)
// (e.g. GitHub Pages or a local server); when opened as a file the browser forbids reading
// pixels, so the original image is used as-is. tools/sprite-prep.html does the same job ahead of time.

const SPRITE_MAX_PX = 512;
const spriteCache = new Map(); // original src -> processed URL (or the original if it can't be processed)

const escapeAttr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function spriteFailed(img) {
  console.warn(`Study Space: sprite not found: ${img.dataset.orig || img.getAttribute("src")} (showing emoji instead)`);
  const span = document.createElement("span");
  span.textContent = img.dataset.fallback || "?";
  img.replaceWith(span);
}

// Find the bounding box of non-transparent pixels. Returns null if fully transparent.
function opaqueBounds(data, w, h) {
  let top = h, left = w, right = -1, bottom = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 8) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        bottom = y;
      }
    }
  }
  return right < 0 ? null : { x: left, y: top, w: right - left + 1, h: bottom - top + 1 };
}

// Trim + downscale one image. Resolves to a blob URL, or the original src if not possible.
function processSprite(src, { trim = true, pixelated = false, maxPx = SPRITE_MAX_PX } = {}) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        // Pass 1: draw (downscaled if huge) to find the visible area cheaply.
        const scanScale = Math.min(1, 1024 / Math.max(img.naturalWidth, img.naturalHeight));
        const sw = Math.max(1, Math.round(img.naturalWidth * scanScale));
        const sh = Math.max(1, Math.round(img.naturalHeight * scanScale));
        const scan = document.createElement("canvas");
        scan.width = sw; scan.height = sh;
        const sctx = scan.getContext("2d", { willReadFrequently: true });
        sctx.drawImage(img, 0, 0, sw, sh);
        let box = { x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight };
        if (trim) {
          const b = opaqueBounds(sctx.getImageData(0, 0, sw, sh).data, sw, sh); // throws on file://
          if (b) {
            const pad = 1; // one scan pixel of breathing room so edges aren't clipped
            box = {
              x: Math.max(0, (b.x - pad) / scanScale), y: Math.max(0, (b.y - pad) / scanScale),
              w: Math.min(img.naturalWidth, (b.w + 2 * pad) / scanScale), h: Math.min(img.naturalHeight, (b.h + 2 * pad) / scanScale),
            };
          }
        } else {
          sctx.getImageData(0, 0, 1, 1); // same file:// check, so behaviour is consistent
        }
        // Pass 2: crop from the full-resolution original, downscaling only (never upscale).
        const scale = Math.min(1, maxPx / Math.max(box.w, box.h));
        if (scale === 1 && box.w === img.naturalWidth && box.h === img.naturalHeight) return resolve(src);
        const out = document.createElement("canvas");
        out.width = Math.max(1, Math.round(box.w * scale));
        out.height = Math.max(1, Math.round(box.h * scale));
        const octx = out.getContext("2d");
        octx.imageSmoothingEnabled = !pixelated;
        octx.imageSmoothingQuality = "high";
        octx.drawImage(img, box.x, box.y, box.w, box.h, 0, 0, out.width, out.height);
        out.toBlob((blob) => resolve(blob ? URL.createObjectURL(blob) : src), "image/png");
      } catch (e) {
        resolve(src); // file:// (tainted canvas) or other failure: use original
      }
    };
    img.onerror = () => resolve(src); // the <img> itself will show the emoji fallback
    img.src = src;
  });
}

// Start processing a sprite once; when done, swap every <img> showing it to the processed version.
function ensureSprite(item) {
  const src = item.sprite;
  if (spriteCache.has(src)) return;
  spriteCache.set(src, null); // in progress
  processSprite(src, { trim: item.trim !== false, pixelated: !!item.pixelated }).then((url) => {
    spriteCache.set(src, url);
    if (url === src) return;
    document.querySelectorAll("img.sprite").forEach((img) => { if (img.dataset.orig === src) img.src = url; });
  });
}

// Returns HTML for an item's art. Size follows the surrounding font-size (1em tall),
// so the same call works in the shop, tray, stage and wish results.
function artHTML(item) {
  if (!item) return "";
  if (item.sprite) {
    ensureSprite(item);
    const src = spriteCache.get(item.sprite) || item.sprite;
    return `<img class="sprite${item.pixelated ? " pixelated" : ""}" src="${escapeAttr(src)}" data-orig="${escapeAttr(item.sprite)}"` +
      ` alt="${escapeAttr(item.name || "")}" draggable="false" decoding="async"` +
      ` data-fallback="${escapeAttr(item.icon || "?")}" onerror="spriteFailed(this)">`;
  }
  return `<span>${escapeAttr(item.icon || "?")}</span>`;
}

// Background CSS for a Space backdrop: an image if given, else flat wall + floor colours.
function backdropCSS(bd) {
  if (bd.image) return `url("${bd.image}") center / cover no-repeat, ${bd.wall || "#eee"}`;
  return `linear-gradient(${bd.wall} 0 66%, ${bd.floor} 66% 100%)`;
}
