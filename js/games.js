// Mini games. Each takes the stage element and returns an optional cleanup function.
// To add a game: write a function here, then add an entry to CATALOG.games.

const GAMES = {
  // Tap as many targets as you can in 15 seconds.
  clicker(stage) {
    let score = 0, timeLeft = 15;
    stage.innerHTML = `<div class="small">Score: <b id="g-score">0</b> · Time: <b id="g-time">15</b>s</div>`;
    const target = document.createElement("button");
    target.className = "target";
    stage.appendChild(target);

    const move = () => {
      const w = stage.clientWidth - 40, h = stage.clientHeight - 60;
      target.style.left = Math.random() * w + "px";
      target.style.top = 30 + Math.random() * h + "px";
    };
    target.onclick = () => { score++; stage.querySelector("#g-score").textContent = score; move(); };
    move();

    const timer = setInterval(() => {
      timeLeft--;
      stage.querySelector("#g-time").textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timer);
        stage.innerHTML = `<p>Time's up! You tapped <b>${score}</b> targets.</p>`;
      }
    }, 1000);
    return () => clearInterval(timer);
  },

  // Classic flip-two-cards memory game.
  memory(stage) {
    const icons = ["📘", "✏️", "📐", "🧪", "🎒", "📎", "🔬", "🧮"];
    const cards = [...icons, ...icons].sort(() => Math.random() - 0.5);
    let open = [], matched = 0, moves = 0;

    stage.innerHTML = `<div class="small" id="g-moves">Moves: 0</div><div class="memory-grid"></div>`;
    const grid = stage.querySelector(".memory-grid");
    cards.forEach((icon) => {
      const b = document.createElement("button");
      b.onclick = () => {
        if (open.length === 2 || b.textContent || b.disabled) return;
        b.textContent = icon;
        open.push(b);
        if (open.length === 2) {
          moves++;
          stage.querySelector("#g-moves").textContent = "Moves: " + moves;
          const [a, c] = open;
          if (a.textContent === c.textContent) {
            a.disabled = c.disabled = true;
            open = [];
            matched += 2;
            if (matched === cards.length) stage.querySelector("#g-moves").textContent = `Solved in ${moves} moves!`;
          } else {
            setTimeout(() => { a.textContent = c.textContent = ""; open = []; }, 700);
          }
        }
      };
      grid.appendChild(b);
    });
  },
};
