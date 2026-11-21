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

## Adding a backdrop

```js
{ id: "library", name: "Library", price: 120, image: "assets/backdrops/library.png", wall: "#6b4a3a" },
```

The image covers the stage (4:3, cropped to fit). `wall` is the colour shown while the image loads or if it's missing.

## Making sprites that look right

- **Format:** PNG with a transparent background.
- **Crop tight:** trim empty space around the drawing. Every sprite is drawn the same height, so padding makes it look small.
- **Shape:** square works best. Wide or tall sprites keep their shape, up to 2.5× as wide as they are tall.
- **Resolution:**
  - Pixel art can be tiny (16–64 px) with `pixelated: true`.
  - Painted or smooth art should be about 256 px tall so it stays sharp on large screens.
- **Facing:** draw characters facing right. Players can flip them on the stage.
- **File names:** lowercase, no spaces (e.g. `study-lamp.png`).

If a sprite doesn't show up, open the browser console (F12). It prints `sprite not found:` with the path it tried.

## Samples

- `decorations/desk.png`: the "Study Desk" decoration (32×32 pixel art).
- `buddies/blob.png`: "Gloop the Slime", a 4★ buddy (22×22 pixel art).

Replace or delete them as you like. If you delete one, also delete its catalog entry.
