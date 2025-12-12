// MATRIX PUZZLE WITH SOUND EFFECTS – UPDATED VERSION

document.addEventListener("DOMContentLoaded", () => {
    const puzzleBoard = document.getElementById("puzzleBoard");
    const keyReveal = document.getElementById("keyReveal");

    // ------------ AUDIO SETUP ----------------
    const moveSound = new Audio("/static/audio/move.wav");           // short digital click
    const errorSound = new Audio("/static/audio/error.wav");         // blocked move
    const successSound = new Audio("/static/audio/success.mp3");     // access granted
    const bgHum = new Audio("/static/audio/matrix_hum.mp3");         // looping matrix hum

    bgHum.loop = true;
    bgHum.volume = 0.35;  // soft in background
    bgHum.play().catch(() => {}); // autoplay issues ignored

    // ------------ PUZZLE SETUP ---------------
    let grid = [...Array(15).keys()].map(n => n + 1);
    grid.push(""); // empty tile
    shuffle(grid);

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    function render() {
        puzzleBoard.innerHTML = "";
        grid.forEach((val, index) => {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            if (val === "") tile.classList.add("empty");
            tile.textContent = val;

            tile.addEventListener("click", () => moveTile(index));

            puzzleBoard.appendChild(tile);
        });
    }

    function moveTile(index) {
        const emptyIndex = grid.indexOf("");
        const validMoves = [index - 1, index + 1, index - 4, index + 4];

        // Invalid move? Play error beep
        if (!validMoves.includes(emptyIndex)) {
            errorSound.currentTime = 0;
            errorSound.play();
            return;
        }

        // Valid move → play move sound
        moveSound.currentTime = 0;
        moveSound.play();

        // Swap tiles
        [grid[index], grid[emptyIndex]] = [grid[emptyIndex], grid[index]];
        render();
        checkWin();
    }

    function checkWin() {
        const solution = [...Array(15).keys()].map(n => n + 1).concat("");
        if (JSON.stringify(grid) === JSON.stringify(solution)) {
            keyReveal.style.display = "block";

            // stop background hum gradually
            let fade = setInterval(() => {
                bgHum.volume -= 0.02;
                if (bgHum.volume <= 0) {
                    bgHum.pause();
                    clearInterval(fade);
                }
            }, 80);

            // play epic success sound
            successSound.currentTime = 0;
            successSound.play();
        }
    }

    render();
});
