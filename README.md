# Study Space

A minimalist pomodoro homework tracker. Focus time earns coins; spend them on themes, room decorations and mini games.

Open `index.html` in a browser. No build step. Progress is saved in the browser's localStorage.

## How it works
- **Focus**: add assignments with an optional deadline (each shows the due date and a live "time left" countdown, sorted soonest first), select one, run the 25/5 pomodoro timer. Each focused minute = 1 coin + 1 minute logged to the assignment.
- **Gems**: clicking **Submit** on an assignment with at least 25 focus minutes awards 1 gem (once per assignment). Assignments marked **Partnered** (group work, with optional partner names) pay +1 bonus gem and are highlighted with a "counting on you" reminder. 1 gem = 100,000 coins via the Exchange in the Shop.
- **Shop**: buy themes, decorations and mini games.
- **Space**: place decorations in your room grid.
- **Games**: play unlocked mini games.

## Extending the template
- `js/catalog.js`: add themes (CSS variable sets), decorations (emoji + price), mini games, timer settings, and gem rules (`gemsPerSubmission`, `partnerBonusGems`, `minMinutesForGem`, `coinsPerGem`).
- `js/games.js`: add a function for each new mini game, then reference it from `CATALOG.games`.
- `style.css`: flat styling, no shadows.
