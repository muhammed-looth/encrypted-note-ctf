// Harder Maze: 0=wall, 1=path, 2=start, 6=exit
const MAZE = [
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [2,1,1,0,1,1,1,0,1,1,1,0],
    [0,1,0,0,1,0,1,0,1,0,1,0],
    [0,1,1,1,1,0,1,1,1,0,1,0],
    [0,0,0,0,0,1,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,0,1,0,0,0,1,0,0],
    [0,1,1,1,1,0,1,1,1,0,1,0],
    [0,0,0,0,1,0,1,0,1,1,1,0],
    [0,1,1,1,1,0,1,0,1,0,0,0],
    [0,1,0,0,1,1,1,0,1,1,1,6],
    [0,0,0,0,0,0,0,0,0,0,0,0]
];

const N = MAZE.length, M = MAZE[0].length;
let playerPos = [1,0];

// === AUDIO SETUP ===
// Replace file names with whatever you download.
const enterMazeSound = new Audio('/static/audio/welcome.wav');    // plays once when maze starts
const moveBeepSound  = new Audio('/static/audio/beep.wav');     // short beep on each move
const successSound   = new Audio('/static/audio/win.wav'); // success / win sound

// To allow rapid repeated beeps, clone the audio node each time you play it
function playMoveBeep() {
    const beep = moveBeepSound.cloneNode();
    beep.play().catch(() => {});
}

function playEnterMaze() {
    enterMazeSound.play().catch(() => {});
}

function playSuccess() {
    successSound.play().catch(() => {});
}

// === RENDER MAZE ===
function renderMaze(){
    const mazeDiv = document.getElementById('maze');
    mazeDiv.innerHTML = '';
    for(let i=0;i<N;i++){
        for(let j=0;j<M;j++){
            const cell=document.createElement('div');
            cell.className='cell';
            if(MAZE[i][j]===0) cell.classList.add('wall');
            if(MAZE[i][j]===2) cell.classList.add('start');
            if(MAZE[i][j]===6) cell.classList.add('exit');
            if(playerPos[0]===i && playerPos[1]===j) cell.classList.add('player');
            mazeDiv.appendChild(cell);
        }
    }
}

// === MOVE LOGIC WITH SOUNDS ===
function move(dx,dy){
    const ni = playerPos[0]+dx, nj = playerPos[1]+dy;
    if(ni < 0 || ni>=N || nj<0 || nj>=M) return;
    if(MAZE[ni][nj]===0) return;

    // valid move -> play beep
    playerPos=[ni,nj];
    playMoveBeep();
    renderMaze();

    if(MAZE[ni][nj]===6){
        // reached exit -> success sound
        playSuccess();

        const keyBox = document.getElementById('hidden-key');
        keyBox.style.display="block";
        keyBox.textContent =
            "Key Fragment (03):  ⚠️ 70 4f 69 6f 75 63 35 5a 34 52 4f 68 50 4a 76 30 4c 71 4c 30 58 7a 42 61 58 50 52 6c 6f 4d 62 6d 37 58 4d 61 61 34 62 64 79 4c 51 42 78 33 4e 39 57 68 43 64 43 39 7a 73 6d 39 75 49 42 35 46 53 0a 57 61 76 38 4c 45 6a 57 37 68 67 6a 39 49 4c 41 56 4c 72 44 6f 2f 78 48 63 5a 79 2f 63 42 4c 65 37 46 46 54 5a 53 6b 76 4c 43 4d 44 67 64 69 76 36 33 47 79 36 53 2f 55 36 39 31 58 63 45 49 47 0a 2f 47 6a 6c 75 6a 6a 52 68 52 30 63 66 49 48 4f 55 32 4f 59 37 72 39 34 34 70 52 5a 5a 6a 34 76 6d 51 4f 73 6a 45 43 79 59 41 50 79 4d 6c 48 75 35 59 64 78 70 69 76 59 51 38 4c 47 67 4d 33 64  ---|---   Next Challenge: [https://encrypted-note-ctf.onrender.com/357de8f622ff2aaeb5073eabcb4b770be81cb56a](https://encrypted-note-ctf.onrender.com/357de8f622ff2aaeb5073eabcb4b770be81cb56a)   ";
    }
}

// === CONTROLS ===
document.addEventListener('keydown', e=>{
    if(e.key==='ArrowUp') move(-1,0);
    if(e.key==='ArrowDown') move(1,0);
    if(e.key==='ArrowLeft') move(0,-1);
    if(e.key==='ArrowRight') move(0,1);
});

// Initial render
renderMaze();

// Play "enter maze" sound once when the challenge loads
// Some browsers require a user interaction first; if it does not play,
// you can move this call inside the first keydown listener.
playEnterMaze();
