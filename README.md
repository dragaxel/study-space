# Study Space

A minimalist pomodoro homework tracker. Focus time earns coins; spend them on themes, room decorations and mini games.

Open `index.html` in a browser. No build step. Progress is saved in the browser's localStorage.

## How it works
- **Focus**: add assignments with an optional deadline (each shows the due date and a live "time left" countdown, sorted soonest first), select one, run the 25/5 pomodoro timer. Each focused minute = 1 coin + 1 minute logged to the assignment.
- **Gems**: clicking **Submit** on an assignment with at least 25 focus minutes awards 1 gem (once per assignment). Assignments marked **Partnered** (group work, with optional partner names) pay +1 bonus gem and are highlighted with a "counting on you" reminder. 1 gem = 100,000 coins via the Exchange in the Shop.
- **Shop**: buy themes, decorations and mini games.
- **Space**: place decorations in your room grid.
- **Games**: play unlocked mini games.
- **Wish**: banner-style gacha. Spend gems on study buddies (1 gem per wish, 10 gems for a 10-wish). 3★/4★/5★ rarities, a featured buddy per banner with 50% rate-up, a 4★-or-better guarantee in every 10-wish, and a guaranteed 5★ within 50 wishes. Pick an owned buddy to show on the Focus page.

## Extending the template
- `js/catalog.js`: add themes (CSS variable sets), decorations (emoji + price), mini games, timer settings, and gem rules (`gemsPerSubmission`, `partnerBonusGems`, `minMinutesForGem`, `coinsPerGem`).
- `BUDDIES`, `BANNERS`, `WISH` in `js/catalog.js`: add buddies, add or rotate banners, tune rates, pity and cost. Logic is in `js/gacha.js`.
- `js/games.js`: add a function for each new mini game, then reference it from `CATALOG.games`.
- `style.css`: flat styling, no shadows.
