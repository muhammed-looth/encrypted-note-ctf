// MATRIX RAIN BACKGROUND
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const chars = "01";
const fontSize = 18;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function matrixLoop() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ff9d";
    ctx.font = fontSize + "px monospace";

    drops.forEach((y, i) => {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.95) drops[i] = 0;
        drops[i]++;
    });
}
setInterval(matrixLoop, 50);

// TYPING SOUND
document.addEventListener("keydown", () => {
    let audio = document.getElementById("typeSound");
    audio.currentTime = 0;
    audio.play().catch(()=>{});
});

// Fake delay login effect
document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const btn = document.querySelector(".btn");
    btn.disabled = true;
    btn.innerText = "VERIFYING...";

    setTimeout(() => {
        alert("ACCESS GRANTED. WELCOME BACK.");
        e.target.submit();
    }, 2500);
});
