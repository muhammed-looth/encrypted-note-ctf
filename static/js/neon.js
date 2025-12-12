const canvas = document.getElementById("neonCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let mouseTrail = [];
let keyShown = false;

const pulseSound = document.getElementById("pulseSound");
const unlockSound = document.getElementById("unlockSound");

function random(min, max) {
    return Math.random() * (max - min) + min;
}

class Particle {
    constructor() {
        this.x = random(0, canvas.width);
        this.y = random(0, canvas.height);
        this.size = random(1, 3);
        this.speedX = random(-0.8, 0.8);
        this.speedY = random(-0.8, 0.8);
        this.alpha = random(0.3, 0.8);
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = `rgba(0,255,255,${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createParticles() {
    for (let i = 0; i < 250; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

createParticles();
animate();

/* ======== SECRET MOUSE PUZZLE ======== */

window.addEventListener("mousemove", (e) => {
    if (keyShown) return;

    mouseTrail.push({ x: e.clientX, y: e.clientY });

    if (mouseTrail.length > 80) mouseTrail.shift();

    detectLightningPattern();
});

/* === Detect Zig-Zag Pattern === */

function detectLightningPattern() {
    if (mouseTrail.length < 40) return;

    let ups = 0, downs = 0;
    
    for (let i = 1; i < mouseTrail.length - 1; i++) {
        const prev = mouseTrail[i - 1].y;
        const curr = mouseTrail[i].y;
        const next = mouseTrail[i + 1].y;

        if (curr < prev && curr < next) ups++;   // peak
        if (curr > prev && curr > next) downs++; // dip
    }

    // Need *at least* 3 peaks + 3 dips (zig-zag, lightning shape)
    if (ups >= 3 && downs >= 3) {
        showKey();
    }
}

function showKey() {
    keyShown = true;
    unlockSound.play();
    pulseFlash();

    document.getElementById("keyBox").style.display = "block";
}

function pulseFlash() {
    let flashes = 0;
    let interval = setInterval(() => {
        document.body.style.background = flashes % 2 === 0 ? "#0ff" : "#000";
        flashes++;
        if (flashes > 6) {
            clearInterval(interval);
            document.body.style.background = "#000";
        }
    }, 120);
}
