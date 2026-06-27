# Arcade Snake Game

A modernized, retro-inspired take on the classic arcade Snake game. Built entirely using vanilla web technologies, this version introduces progressive gameplay difficulty, persistent data tracking, dynamic visual styling, and immersive audio management.

## 🚀 Live Demo
https://sartaj1995.github.io/classic_snake__v2/

---

## 🕹️ Controls

* **Arrow Keys:** Change Snake Direction
* **Spacebar:** Start Game / Pause / Resume

---

## ✨ Features

* **Dynamic Speed Ramp:** The game tracks your skill. Every time the snake eats 5 standard pieces of food, the game loop automatically accelerates, ramping up the tension.
* **Golden Apples (Special Food):** Features a 15% random spawn chance. Golden apples flash distinctively, award triple points (+30), and disappear if you aren't quick enough to catch them within 5 seconds.
* **Local Leaderboard:** Keeps track of the top 5 high scores locally using the browser's `localStorage`. Prompts players for their names upon achieving a record tier score.
* **Audio Engine & State Control:** Features background retro synth tracks alongside interactive action sound effects. Includes a persistent mute toggle that saves user preferences across sessions.
* **Instant Pause/Resume:** Hit the **Spacebar** at any time to instantly freeze the game frame and audio loops when real-life distractions pop up.
* **Multiple Visual Themes:** Swap look and feel on the fly with a dedicated UI dropdown panel:
    * *Classic Green:* Traditional arcade aesthetic.
    * *Cyberpunk Neon:* High-contrast pink, neon blue, and glowing asset variables.
    * *GameBoy Retro:* Classic green-scale monochrome matrix look.

---

## 🛠️ Tech Stack

* **HTML5** (Structure & Layout Grid)
* **CSS3** (Custom Properties, Themes, & Transitions)
* **JavaScript** (ES6, Canvas API, Web Audio API, LocalStorage API)

---

## 📂 Project Structure

```text
📁 arcade-snake/
├── index.html          # Main application structure & audio DOM elements
├── style.css           # Grid layouts, responsive panels, and theme variables
├── script.js           # Core game engine loop, state flags, and mechanics
└── 📁 audio/           # Media assets folder
    ├── bg-music.mp3    # Background loop track
    ├── eat.mp3         # Food collision sound effect
    └── gameover.mp3    # Game over state sound effect
```

---

## 🏎️ Getting Started

* Clone or create your repository.
* Add Audio Files: Ensure you place your chosen royalty-free audio tracks inside the audio/ folder named exactly as shown in the directory tree above.
* Launch the Game: Simply double-click index.html to launch and play directly inside any modern web browser—no servers or package installations required!
