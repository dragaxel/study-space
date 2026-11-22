# Adding sprite art

Decorations, study buddies and mini games can each use a PNG sprite instead of an emoji. Backdrops can use a picture instead of flat colours. Nothing needs building: add the file, add or edit one entry in `js/catalog.js`, then reload the page.

## Folders

| Folder | What goes in it | Catalog list |
| --- | --- | --- |
| `assets/decorations/` | Decoration stickers | `CATALOG.decorations` |
| `assets/buddies/` | Study buddies (Wish page) | `BUDDIES` |
| `assets/backdrops/` | Space stage backgrounds | `CATALOG.backdrops` |

## Adding a decoration or study buddy

1. Put the PNG in the right folder, e.g. `assets/decorations/bookshelf.png`.
2. Add an entry in `js/catalog.js`:

```js
// decoration
{ id: "bookshelf", name: "Bookshelf", icon: "📚", price: 45, sprite: "assets/decorations/bookshelf.png" },

// study buddy (rarity 3, 4 or 5)
{ id: "moth", name: "Mothra the Night Owl", icon: "🦋", rarity: 5, sprite: "assets/buddies/moth.png" },
```

To make a new buddy a banner's featured buddy, set `featured: "moth"` on an entry in `BANNERS`.

### Fields

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | yes | Unique, never change it once players have it (saves store this id) |
| `name` | yes | Shown in the shop, tray and collection |
| `icon` | yes | Emoji fallback, used if the PNG fails to load |
| `sprite` | no | PNG path, relative to `index.html` |
| `pixelated` | no | `true` for pixel art: keeps edges crisp when scaled up |
| `size` | no | Size on the Space stage relative to the default (e.g. `1.6` for furniture, `0.6` for small items) |
| `trim` | no | `false` keeps the transparent margin around the art (by default it is trimmed off) |

## Adding a backdrop

```js
{ id: "library", name: "Library", price: 120, image: "assets/backdrops/library.png", wall: "#6b4a3a" },
```

The image covers the stage (4:3, cropped to fit). `wall` is the colour shown while the image loads or if it's missing.

## Large images

Any size works: a 4000×4000 painting is fine. When the game is served over http(s) (GitHub Pages or any web server), each sprite is processed the first time it's shown:

- **Trimmed:** empty transparent space around the drawing is cut off, so art drawn small on a big canvas still fills its sprite. Turn this off per item with `trim: false`.
- **Downscaled:** the longest side is reduced to 512 px (`SPRITE_MAX_PX` in `js/sprites.js`). This keeps the shop, tray and stage fast and is still sharp at the largest stage size.
- **Never upscaled:** small pixel art is left alone.

When `index.html` is opened directly as a file, browsers block the pixel reading this needs, so the original image is shown untrimmed. The game still works.

### Preparing sprites ahead of time (recommended)

Open **`tools/sprite-prep.html`** and drop your PNGs on it. It does the same trim and downscale, shows the before and after sizes, and lets you download the results to save into `assets/`. This makes files smaller, loads faster and looks the same whether the game is opened as a file or hosted. It works when opened straight from your disk (double-click it), and nothing is uploaded anywhere.

Very wide or tall art keeps its shape. It's fitted inside a box up to 3× as wide as it is tall, so use `size` to make a long item like a rug bigger.

## Making sprites that look right

- **Format:** PNG with a transparent background.
- **Crop tight:** every sprite is drawn the same height, so padding makes it look small. The game and the prep tool trim it for you, but cropping it yourself is the surest way.
- **Shape:** square works best. Wide or tall sprites keep their shape.
- **Resolution:**
  - Pixel art can be tiny (16–64 px) with `pixelated: true`.
  - Painted or smooth art looks best at 256–512 px on its longest side. Bigger is fine, it's scaled down automatically.
- **Facing:** draw characters facing right. Players can flip them on the stage.
- **File names:** lowercase, no spaces (e.g. `study-lamp.png`).

If a sprite doesn't show up, open the browser console (F12). It prints `sprite not found:` with the path it tried.

## Samples

- `decorations/curly-plant.png`, `decorations/green-couch.png`: the Curly Plant and Green Couch decorations.
- `buddies/dizzy.png`, `buddies/imp.png`: the Dizzy and Imp 4★ buddies.

- `decorations/desk.png`: the "Study Desk" decoration (32×32 pixel art).
- `buddies/blob.png`: "Gloop the Slime", a 4★ buddy (22×22 pixel art).

Replace or delete them as you like. If you delete one, also delete its catalog entry.
