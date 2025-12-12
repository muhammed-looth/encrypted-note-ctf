/* MIRROR: Draw a shape on one side, then draw the mirrored shape on the other side.
   The script compares the second stroke against the mirrored first stroke (tolerance).
   If they match closely enough, reveal the key.
*/

const canvas = document.getElementById('mirrorCanvas');
const ctx = canvas.getContext('2d');

const scribble = document.getElementById('scribble');
const matchSound = document.getElementById('matchSound');
const failSound = document.getElementById('failSound');
const revealBox = document.getElementById('revealBox');
const resetBtn = document.getElementById('resetBtn');
const statusEl = document.querySelector('.status');

let DPR = window.devicePixelRatio || 1;
function resize() {
  canvas.width = Math.floor(canvas.clientWidth * DPR);
  canvas.height = Math.floor(canvas.clientHeight * DPR);
  ctx.setTransform(DPR,0,0,DPR,0,0);
  drawGrid();
}
window.addEventListener('resize', resize);
resize();

/* visuals */
function drawGrid(){
  // subtle glass grid with reflection lines
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  ctx.clearRect(0,0,w,h);

  // background sheen
  const g = ctx.createLinearGradient(0,0,0,h);
  g.addColorStop(0,'rgba(255,255,255,0.02)');
  g.addColorStop(1,'rgba(0,0,0,0.2)');
  ctx.fillStyle = g;
  ctx.fillRect(0,0,w,h);

  // faint vertical lines for depth
  ctx.strokeStyle = 'rgba(0,255,255,0.03)';
  ctx.lineWidth = 1;
  for(let i=0;i<w;i+=28){
    ctx.beginPath();
    ctx.moveTo(i,0);
    ctx.lineTo(i,h);
    ctx.stroke();
  }

  // middle reflective divider highlight
  ctx.fillStyle = 'rgba(255,255,255,0.015)';
  ctx.fillRect(w/2 - 1.5, 0, 3, h);
}

/* stroke capture */
let drawing = false;
let strokes = []; // stores strokes: each stroke is array of points [{x,y},...]
let currentStroke = null;

canvas.addEventListener('pointerdown', (e) => {
  const p = normalizedPoint(e);
  drawing = true;
  currentStroke = [p];
  scribble.currentTime = 0;
  scribble.play().catch(()=>{});
});

canvas.addEventListener('pointermove', (e) => {
  if(!drawing) return;
  const p = normalizedPoint(e);
  currentStroke.push(p);
  redraw();
});

canvas.addEventListener('pointerup', (e) => {
  if(!drawing) return;
  drawing = false;
  strokes.push(currentStroke);
  currentStroke = null;
  redraw();

  // logic: if we now have 2 strokes, compare first->second mirrored
  if(strokes.length === 2){
    statusEl.textContent = 'Comparing reflections...';
    setTimeout(()=> {
      const ok = compareMirror(strokes[0], strokes[1]);
      if(ok){
        successReveal();
      } else {
        statusEl.textContent = 'Not quite a mirror. Try again.';
        failSound.play().catch(()=>{});
        // allow retry: keep the first stroke so user can try again drawing a new mirrored stroke
        strokes = [strokes[0]];
      }
    }, 600);
  } else if (strokes.length > 2) {
    // reset to keep only most recent sequence
    strokes = strokes.slice(-2);
  } else {
    statusEl.textContent = 'Now draw the mirrored shape on the other side.';
  }
});

resetBtn.addEventListener('click', () => {
  strokes = [];
  currentStroke = null;
  statusEl.textContent = 'Draw anywhere (left OR right)';
  drawGrid();
});

/* helpers */
function normalizedPoint(e){
  const r = canvas.getBoundingClientRect();
  const x = (e.clientX - r.left);
  const y = (e.clientY - r.top);
  return { x, y };
}

/* draw strokes */
function redraw(){
  drawGrid();
  // draw stored strokes
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // draw first stroke (teal)
  if(strokes[0]){
    ctx.strokeStyle = 'rgba(0,255,200,0.95)';
    ctx.lineWidth = 4;
    drawPath(strokes[0]);
    // ghost mirrored version of first stroke (a faint guide only visible after drawing)
    const mirrored = mirrorPoints(strokes[0]);
    ctx.strokeStyle = 'rgba(0,255,200,0.12)';
    ctx.lineWidth = 2;
    drawPath(mirrored);
  }

  // draw second stroke (magenta)
  if(strokes[1]){
    ctx.strokeStyle = 'rgba(200,80,255,0.95)';
    ctx.lineWidth = 4;
    drawPath(strokes[1]);
  }

  // current stroke
  if(currentStroke){
    ctx.strokeStyle = 'rgba(255,255,255,0.92)';
    ctx.lineWidth = 3;
    drawPath(currentStroke);
  }
}

function drawPath(points){
  if(!points || points.length===0) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for(let i=1;i<points.length;i++){
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}

/* Mirror transform: reflect across vertical center line */
function mirrorPoints(points){
  const w = canvas.clientWidth;
  return points.map(p => ({ x: w - p.x, y: p.y }));
}

/* Compare two stroke arrays: resample and compute mean distance between mirrored first and second */
function compareMirror(first, second){
  // quick checks: ensure strokes are on opposite sides of divider roughly
  const w = canvas.clientWidth;
  const firstAvgX = first.reduce((s,p)=>s+p.x,0)/first.length;
  const secondAvgX = second.reduce((s,p)=>s+p.x,0)/second.length;
  // require roughly opposite halves (one left, one right)
  if(!((firstAvgX < w*0.48 && secondAvgX > w*0.52) || (firstAvgX > w*0.52 && secondAvgX < w*0.48))){
    return false;
  }

  // resample each to N points
  const N = 80;
  const a = resample(mirrorPoints(first), N);
  const b = resample(second, N);

  // compute normalized mean squared distance
  let sum = 0;
  for(let i=0;i<N;i++){
    const dx = a[i].x - b[i].x;
    const dy = a[i].y - b[i].y;
    sum += dx*dx + dy*dy;
  }
  const mse = sum / N;

  // choose threshold relative to canvas diagonal
  const diag = Math.hypot(canvas.clientWidth, canvas.clientHeight);
  // threshold tuned: allows imprecise hand-drawings but not totally different shapes
  const threshold = Math.pow(diag * 0.08, 2); // ~8% of diagonal
  return mse < threshold;
}

/* resample polyline to N evenly spaced points along arc-length */
function resample(points, N){
  if(points.length < 2){
    // return N copies of single point
    const out = [];
    for(let i=0;i<N;i++){ out.push(points[0] ? {x:points[0].x, y:points[0].y} : {x:0,y:0}); }
    return out;
  }

  // compute cumulative lengths
  const dists = [0];
  let total = 0;
  for(let i=1;i<points.length;i++){
    const dx = points[i].x - points[i-1].x;
    const dy = points[i].y - points[i-1].y;
    const dd = Math.hypot(dx,dy);
    total += dd;
    dists.push(total);
  }

  const out = [];
  for(let i=0;i<N;i++){
    const t = (i / (N-1)) * total;
    // find segment containing t
    let idx = 0;
    while(idx < dists.length -1 && dists[idx+1] < t) idx++;
    const t0 = dists[idx];
    const t1 = dists[idx+1];
    const p0 = points[idx];
    const p1 = points[idx+1];
    const f = (t1 - t0) === 0 ? 0 : (t - t0) / (t1 - t0);
    out.push({ x: p0.x + (p1.x - p0.x)*f, y: p0.y + (p1.y - p0.y)*f });
  }
  return out;
}

/* success reveal */
function successReveal(){
  // glam animation
  matchSound.play().catch(()=>{});
  const flash = document.createElement('div');
  flash.style.position = 'fixed';
  flash.style.left = '0'; flash.style.top='0';
  flash.style.width='100%'; flash.style.height='100%';
  flash.style.background='radial-gradient(circle at 50% 40%, rgba(0,255,200,0.08), rgba(255,255,255,0.02))';
  flash.style.pointerEvents='none';
  flash.style.opacity='0';
  flash.style.transition='opacity 350ms ease';
  document.body.appendChild(flash);
  requestAnimationFrame(()=> { flash.style.opacity='1'; });
  setTimeout(()=>{ flash.style.opacity='0'; setTimeout(()=>flash.remove(),400); }, 600);

  // reveal key
  revealBox.style.display = 'block';
  statusEl.textContent = 'Reflection matched — key revealed.';
}

/* initialize draw */
drawGrid();
