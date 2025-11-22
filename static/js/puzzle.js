// Puzzle pieces drag and drop mechanics and solution check

document.addEventListener('DOMContentLoaded', () => {
  const rows = 4, cols = 4;
  const puzzleBoard = document.getElementById('puzzleBoard');
  const keyReveal = document.getElementById('keyReveal');
  let draggingElem = null;
  let dragElemIndex = -1;
  let piecesOrder = [];

  // Initialize pieces data with correct positions (0 to 15)
  for (let i = 0; i < rows * cols; i++) {
    piecesOrder.push(i);
  }
  // Shuffle piecesOrder for starting positions
  piecesOrder = shuffleArray(piecesOrder);

  // Create puzzle pieces elements
  piecesOrder.forEach((pos, idx) => {
    const piece = document.createElement('div');
    piece.classList.add('puzzle-piece');
    piece.style.backgroundPosition = `${-(pos % cols) * 160}px ${-(Math.floor(pos / cols)) * 160}px`;
    piece.setAttribute('data-pos', pos);
    piece.setAttribute('draggable', true);
    piece.setAttribute('aria-label', `Puzzle piece ${pos + 1}`);
    puzzleBoard.appendChild(piece);
  });

  puzzleBoard.addEventListener('dragstart', (e) => {
    if (!e.target.classList.contains('puzzle-piece')) return;
    draggingElem = e.target;
    dragElemIndex = Array.from(puzzleBoard.children).indexOf(draggingElem);
    setTimeout(() => {
      draggingElem.classList.add('dragging');
    }, 0);
  });

  puzzleBoard.addEventListener('dragend', (e) => {
    if (draggingElem) {
      draggingElem.classList.remove('dragging');
      draggingElem = null;
      dragElemIndex = -1;
      checkSolution();
    }
  });

  puzzleBoard.addEventListener('dragover', (e) => {
    e.preventDefault();
    const target = e.target;
    if (!target.classList.contains('puzzle-piece') || target === draggingElem) return;

    const targetIndex = Array.from(puzzleBoard.children).indexOf(target);
    if (dragElemIndex < targetIndex) {
      puzzleBoard.insertBefore(draggingElem, target.nextSibling);
    } else {
      puzzleBoard.insertBefore(draggingElem, target);
    }
  });

  // Shuffle function
  function shuffleArray(arr) {
    let shuffled = arr.slice();
    for(let i = shuffled.length -1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Check if puzzle solved by comparing data-pos in correct order
  function checkSolution() {
    const children = Array.from(puzzleBoard.children);
    for(let i = 0; i < children.length; i++) {
      if (+children[i].getAttribute('data-pos') !== i) return;
    }
    // Puzzle solved
    keyReveal.style.display = 'block';
  }
});
