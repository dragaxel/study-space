# Study Space

A minimalist pomodoro homework tracker. Focus time earns coins; spend them on themes, room decorations and mini games.

Open `index.html` in a browser. No build step. Progress is saved in the browser's localStorage.

## How it works
- **Focus**: add assignments, select one, run the 25/5 pomodoro timer. Each focused minute = 1 coin + 1 minute logged to the assignment.
- **Shop**: buy themes, decorations and mini games.
- **Space**: place decorations in your room grid.
- **Games**: play unlocked mini games.

## Extending the template
- `js/catalog.js`: add themes (CSS variable sets), decorations (emoji + price), mini games, and timer settings.
- `js/games.js`: add a function for each new mini game, then reference it from `CATALOG.games`.
- `style.css`: flat styling, no shadows.
