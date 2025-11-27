// Advanced Labyrinth Challenge with multiple difficulty layers
const canvas = document.getElementById('labyrinthCanvas');
const ctx = canvas.getContext('2d');
const timerDisplay = document.getElementById('timer');
const glyphCountDisplay = document.getElementById('glyphCount');
const glyphHintsDiv = document.getElementById('glyphHints');
const partialKeyDisplay = document.getElementById('partialKey');
const finalKeyDiv = document.getElementById('finalKey');

let timeLeft = 180; // 3 minutes
let glyphsFound = 0;
let playerX = 50, playerY = 50;
let labyrinthRotation = 0;
let walls = [];
let hiddenGlyphs = [];
let glyphStates = [false, false, false];
let isSpinning = false;

// Initialize maze walls (simplified procedural generation)
function generateMaze() {
  walls = [
    {x: 0, y: 0, w: 600, h: 20},
    {x: 0, y: 0, w: 20, h: 600},
    {x: 580, y: 0, w: 20, h: 600},
    {x: 0, y: 580, w: 600, h: 20},
    {x: 100, y: 100, w: 400, h: 20},
    {x: 100, y: 100, w: 20, h: 200},
    {x: 480, y: 100, w: 20, h: 400},
    {x: 200, y: 280, w: 300, h: 20},
    {x: 200, y: 400, w: 20, h: 180},
    {x: 300, y: 200, w: 20, h: 100},
    {x: 350, y: 350, w: 130, h: 20},
  ];

  // Hidden glyph zones (click/hover targets)
  hiddenGlyphs = [
    {x: 300, y: 300, radius: 25, type: 'click', id: 0},
    {x: 150, y: 500, radius: 20, type: 'hover', id: 1},
    {x: 450, y: 150, radius: 22, type: 'spacebar', id: 2}
  ];
}

// Draw the labyrinth
function drawMaze() {
  ctx.save();
  ctx.translate(300, 300);
  ctx.rotate(labyrinthRotation);
  ctx.translate(-300, -300);
  
  ctx.fillStyle = '#1a0000';
  ctx.fillRect(0, 0, 600, 600);
  
  // Draw walls
  ctx.fillStyle = '#8b0000';
  walls.forEach(wall => {
    ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
  });
  
  // Draw hidden glyphs (barely visible flicker)
  hiddenGlyphs.forEach((glyph, idx) => {
    if (!glyphStates[idx]) {
      ctx.fillStyle = `rgba(255, 255, 0, ${0.1 + Math.sin(Date.now() / 500) * 0.05})`;
      ctx.beginPath();
      ctx.arc(glyph.x, glyph.y, glyph.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  
  // Draw player
  ctx.fillStyle = '#00ff00';
  ctx.beginPath();
  ctx.arc(playerX, playerY, 8, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

// Collision detection
function checkCollision(newX, newY) {
  for (let wall of walls) {
    if (newX > wall.x && newX < wall.x + wall.w &&
        newY > wall.y && newY < wall.y + wall.h) {
      return true;
    }
  }
  return false;
}

// Player movement with WASD
let keys = {};
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  
  // Glyph 3 trigger: spacebar when spinning
  if (e.key === ' ' && isSpinning && !glyphStates[2]) {
    collectGlyph(2);
  }
});
window.addEventListener('keyup', (e) => keys[e.key] = false);

function updatePlayer() {
  let newX = playerX, newY = playerY;
  const speed = 3;
  
  if (keys['w'] || keys['W']) newY -= speed;
  if (keys['s'] || keys['S']) newY += speed;
  if (keys['a'] || keys['A']) newX -= speed;
  if (keys['d'] || keys['D']) newX += speed;
  
  if (!checkCollision(newX, newY)) {
    playerX = newX;
    playerY = newY;
  }
}

// Glyph collection
function collectGlyph(id) {
  if (!glyphStates[id]) {
    glyphStates[id] = true;
    glyphsFound++;
    glyphCountDisplay.textContent = `${glyphsFound}/3`;
    
    if (glyphsFound === 1) {
      glyphHintsDiv.style.display = 'block';
      partialKeyDisplay.textContent = 'CTF{L4B...';
    } else if (glyphsFound === 2) {
      partialKeyDisplay.textContent = 'CTF{L4BYR1NTH...';
    } else if (glyphsFound === 3) {
      finalKeyDiv.style.display = 'block';
    }
  }
}

// Canvas click detection for glyph 1
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;
  
  hiddenGlyphs.forEach(glyph => {
    if (glyph.type === 'click') {
      const dist = Math.sqrt((clickX - glyph.x) ** 2 + (clickY - glyph.y) ** 2);
      if (dist < glyph.radius) {
        collectGlyph(glyph.id);
      }
    }
  });
});

// Canvas hover detection for glyph 2
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  
  hiddenGlyphs.forEach(glyph => {
    if (glyph.type === 'hover') {
      const dist = Math.sqrt((mouseX - glyph.x) ** 2 + (mouseY - glyph.y) ** 2);
      if (dist < glyph.radius) {
        collectGlyph(glyph.id);
      }
    }
  });
});

// Timer countdown
function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = `Time: ${timeLeft}s`;
  if (timeLeft <= 0) {
    alert('Time expired! Refresh to try again.');
    clearInterval(timerInterval);
  }
}

// Labyrinth spin mechanic (makes it harder)
function spinLabyrinth() {
  isSpinning = true;
  labyrinthRotation += 0.02;
  setTimeout(() => { isSpinning = false; }, 2000);
}

// Main game loop
function gameLoop() {
  updatePlayer();
  drawMaze();
  requestAnimationFrame(gameLoop);
}

// Initialize
generateMaze();
gameLoop();
const timerInterval = setInterval(updateTimer, 1000);
setInterval(spinLabyrinth, 15000); // Spin every 15 seconds
