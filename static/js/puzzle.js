document.addEventListener("DOMContentLoaded", () => {
    const puzzleBoard = document.getElementById("puzzleBoard");
    const keyReveal = document.getElementById("keyReveal");

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

        if (validMoves.includes(emptyIndex)) {
            [grid[index], grid[emptyIndex]] = [grid[emptyIndex], grid[index]];
            render();
            checkWin();
        }
    }

    function checkWin() {
        const solution = [...Array(15).keys()].map(n => n + 1).concat("");
        if (JSON.stringify(grid) === JSON.stringify(solution)) {
            keyReveal.style.display = "block";
        }
    }

    render();
});
