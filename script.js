const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score-display");
const leaderboardList = document.getElementById("leaderboard-list");
const themeSelect = document.getElementById("theme-select");
const muteBtn = document.getElementById("mute-btn");
const startBtn = document.getElementById("start-btn");

// Audio Elements
const bgMusic = document.getElementById("bg-music");
const eatSfx = document.getElementById("eat-sfx");
const gameoverSfx = document.getElementById("gameover-sfx");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{x: 10, y: 10}];
let food = {x: 5, y: 5, isGolden: false};
let foodTimeout = null;

let dx = 1;
let dy = 0;
let score = 0;
let baseSpeed = 120;
let currentSpeed = baseSpeed;
let gameTimeoutId = null;

// Game State Flags
let gameStarted = false;
let isPaused = false;

let isMuted = localStorage.getItem("snakeMuted") === "true";
let currentTheme = localStorage.getItem("snakeTheme") || "theme-classic";

const themes = {
    "theme-classic": { head: '#4CAF50', body: '#81C784', food: '#FF5252', gold: '#FFD700', text: '#ffffff' },
    "theme-cyberpunk": { head: '#ff007f', body: '#ff66b2', food: '#00ffcc', gold: '#ffff00', text: '#00ffcc' },
    "theme-gameboy": { head: '#306230', body: '#8b956d', food: '#0f380f', gold: '#0f380f', text: '#0f380f' }
};

function gameLoop() {
    if (!gameStarted || isPaused) return;

    if (hasGameEnded()) {
        handleGameOver();
        return;
    }

    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();

    gameTimeoutId = setTimeout(gameLoop, currentSpeed);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    const colors = themes[currentTheme];
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? colors.head : colors.body;
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    if (snake[0].x === food.x && snake[0].y === food.y) {
        if (!isMuted) { eatSfx.currentTime = 0; eatSfx.play().catch(()=>{}); }

        score += food.isGolden ? 30 : 10;
        scoreElement.innerText = score;

        if (currentSpeed > 40) {
            currentSpeed -= 4; 
        }

        clearTimeout(foodTimeout);
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    
    for (let part of snake) {
        if (part.x === food.x && part.y === food.y) {
            generateFood();
            return;
        }
    }

    food.isGolden = Math.random() < 0.15;

    if (food.isGolden) {
        foodTimeout = setTimeout(() => {
            if (food.isGolden) {
                food.isGolden = false;
                generateFood();
            }
        }, 5000);
    }
}

function drawFood() {
    const colors = themes[currentTheme];
    ctx.fillStyle = food.isGolden ? colors.gold : colors.food;
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function hasGameEnded() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    return snake[0].x < 0 || snake[0].x >= tileCount || snake[0].y < 0 || snake[0].y >= tileCount;
}

// UI State Draw Overlays
function drawOverlayText(text) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = themes[currentTheme].text;
    ctx.font = "24px 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

// Input Controllers
document.addEventListener("keydown", handleKeyPress);
themeSelect.addEventListener("change", (e) => updateTheme(e.target.value));
muteBtn.addEventListener("click", toggleMute);
startBtn.addEventListener("click", handleStartButton);

function handleStartButton() {
    if (!gameStarted) {
        startGame();
    } else {
        togglePause();
    }
}

function handleKeyPress(event) {
    const keyPressed = event.keyCode;
    
    if([32, 37, 38, 39, 40].includes(keyPressed)) event.preventDefault();

    // Spacebar handles pausing
    if (keyPressed === 32) {
        if (!gameStarted) {
            startGame();
        } else {
            togglePause();
        }
        return;
    }

    if (!gameStarted || isPaused) return;

    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === 37 && !goingRight) { dx = -1; dy = 0; }
    if (keyPressed === 38 && !goingDown) { dx = 0; dy = -1; }
    if (keyPressed === 39 && !goingLeft) { dx = 1; dy = 0; }
    if (keyPressed === 40 && !goingUp) { dx = 0; dy = 1; }
}

function startGame() {
    gameStarted = true;
    isPaused = false;
    startBtn.innerText = "Pause Game";
    
    if (!isMuted && bgMusic.paused) {
        bgMusic.play().catch(() => {});
    }
    
    gameLoop();
}

function togglePause() {
    isPaused = !isPaused;
    
    if (isPaused) {
        clearTimeout(gameTimeoutId);
        startBtn.innerText = "Resume Game";
        drawOverlayText("PAUSED");
        if (!isMuted) bgMusic.pause();
    } else {
        startBtn.innerText = "Pause Game";
        if (!isMuted) bgMusic.play().catch(()=>{});
        gameLoop();
    }
}

function updateTheme(themeName) {
    document.body.className = themeName;
    currentTheme = themeName;
    themeSelect.value = themeName;
    localStorage.setItem("snakeTheme", themeName);
    
    // Refresh visual display context state if game is holding frame
    if (!gameStarted) {
        clearCanvas();
        drawOverlayText("Press Start to Play");
    } else if (isPaused) {
        drawOverlayText("PAUSED");
    }
}

function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem("snakeMuted", isMuted);
    muteBtn.innerText = isMuted ? "Unmute Music" : "Mute Music";
    
    if (isMuted || isPaused || !gameStarted) {
        bgMusic.pause();
    } else {
        bgMusic.play().catch(()=>{});
    }
}

function loadLeaderboard() {
    const scores = JSON.parse(localStorage.getItem("snakeLeaderboard")) || [];
    leaderboardList.innerHTML = scores.map(item => `<li>${item.name}: ${item.score}</li>`).join('');
    highScoreElement.innerText = scores[0] ? scores[0].score : 0;
}

function handleGameOver() {
    if (!isMuted) { bgMusic.pause(); gameoverSfx.play().catch(()=>{}); }
    clearTimeout(foodTimeout);
    gameStarted = false;

    setTimeout(() => {
        alert(`Game Over! Final Score: ${score}`);
        checkLeaderboardEligibility(score);
        initializeMenu();
    }, 50);
}

function checkLeaderboardEligibility(finalScore) {
    let scores = JSON.parse(localStorage.getItem("snakeLeaderboard")) || [];
    if (scores.length < 5 || finalScore > scores[scores.length - 1].score) {
        const name = prompt("New High Score! Enter your name:") || "Anonymous";
        scores.push({ name: name.substring(0, 10), score: finalScore });
        scores.sort((a, b) => b.score - a.score);
        scores = scores.slice(0, 5);
        localStorage.setItem("snakeLeaderboard", JSON.stringify(scores));
        loadLeaderboard();
    }
}

function initializeMenu() {
    clearTimeout(gameTimeoutId);
    snake = [{x: 10, y: 10}];
    dx = 1;
    dy = 0;
    score = 0;
    currentSpeed = baseSpeed;
    scoreElement.innerText = score;
    gameStarted = false;
    isPaused = false;
    
    generateFood();
    updateTheme(currentTheme);
    loadLeaderboard();
    
    startBtn.innerText = "Start Game";
    muteBtn.innerText = isMuted ? "Unmute Music" : "Mute Music";
    bgMusic.pause();
}

// Initial system boots to clean static main screen state
initializeMenu();