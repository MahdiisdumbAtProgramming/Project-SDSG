const SIZE = 9;
const MINES = 10;

let cells=[], mines=new Set(), revealed=new Set(), flagged=new Set();
let firstClick=true, dead=false, locked=false;
let time=0, timerId;

const grid=document.getElementById("grid");
const smiley=document.getElementById("smiley");
const mineCounter=document.getElementById("mineCounter");
const timer=document.getElementById("timer");
const overlay=document.getElementById("bossOverlay");
const introMusic=document.getElementById("introMusic");
const bossMusic=document.getElementById("bossMusic");

function reset() {
  grid.innerHTML="";
  cells=[]; mines.clear(); revealed.clear(); flagged.clear();
  firstClick=true; dead=false; locked=false;
  clearInterval(timerId); time=0;
  timer.textContent="000"; mineCounter.textContent=String(MINES).padStart(3,"0");
  smiley.textContent="🙂";
  overlay.style.display="none";
  overlay.style.pointerEvents = ""; // restore default
  overlay.querySelectorAll(".spike").forEach(s=>s.remove());
  stopMusic();

  for(let i=0;i<SIZE*SIZE;i++){
    const c=document.createElement("div");
    c.className="cell";

    c.onmousedown=()=>{ if(!dead&&!locked) smiley.textContent="😐"; };
    c.onmouseup=c.onmouseleave=()=>{ if(!dead&&!locked) smiley.textContent="🙂"; };

    c.onclick=()=>reveal(i);
    c.oncontextmenu=e=>{e.preventDefault();flag(i);};

    grid.appendChild(c);
    cells.push(c);
  }
}
function stopMusic(){
    introMusic.pause();
    bossMusic.pause();
    }
function startTimer(){
  timerId=setInterval(()=>{
    time++;
    timer.textContent=String(time).padStart(3,"0");
  },1000);
}

function placeMines(safe){
  while(mines.size<MINES){
    let r=Math.floor(Math.random()*SIZE*SIZE);
    if(r!==safe) mines.add(r);
  }
}

function neighbors(i){
  let x=i%SIZE, y=Math.floor(i/SIZE), n=[];
  for(let dx=-1;dx<=1;dx++)
    for(let dy=-1;dy<=1;dy++){
      if(!dx&&!dy) continue;
      let nx=x+dx, ny=y+dy;
      if(nx>=0 && nx<SIZE && ny>=0 && ny<SIZE)
        n.push(ny*SIZE+nx);
    }
  return n;
}

function reveal(i){
  if(dead||locked||revealed.has(i)||flagged.has(i)) return;
  if(firstClick){ placeMines(i); startTimer(); firstClick=false; }

  revealed.add(i);
  const c=cells[i];
  c.classList.add("revealed");

  if(mines.has(i)){
    c.textContent="💣"; c.classList.add("mine");
    lose(); return;
  }

  const count=neighbors(i).filter(n=>mines.has(n)).length;
  if(count){ c.textContent=count; c.classList.add("n"+count); }
  else neighbors(i).forEach(reveal);
}

function flag(i){
  if(dead||locked||revealed.has(i)) return;
  const c=cells[i];
  if(flagged.has(i)){ flagged.delete(i); c.textContent=""; }
  else{ flagged.add(i); c.textContent="🚩"; }
  mineCounter.textContent=String(MINES-flagged.size).padStart(3,"0");
}

function lose(){
  dead=true;
  clearInterval(timerId);
  smiley.textContent="☹️";
  mines.forEach(i=>{
    if(!revealed.has(i)){
      cells[i].textContent="💣";
      cells[i].classList.add("revealed");
    }
  });
}

/* ===== KONAMI SECRET ===== */
const konami=[ "ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight"];
let buffer=[];

window.addEventListener("keydown",e=>{
  buffer.push(e.key);
  buffer.splice(0,buffer.length-konami.length);
  if(konami.every((k,i)=>buffer[i]===k)) triggerBoss();
});

function triggerBoss(){
  reset();

  // During the intro we keep interactions locked; after intro we allow clicks.
  locked = true;
  overlay.style.display="flex";
  overlay.style.pointerEvents = "auto"; // block clicks during intro

  /* Intro Spikes */
  const CIRCLE_RADIUS=50;
  const SPIKE_HEIGHT=5;
  for(let i=0;i<9;i++){
    const spike=document.createElement("div");
    spike.className="spike";
    overlay.appendChild(spike);
  }

  let angleOffset=0;
  function spinSpikes(){
    angleOffset+=2;
    overlay.querySelectorAll(".spike").forEach((spike,i)=>{
      const angle=(360/9)*i + angleOffset;
      spike.style.transform=`translate(-50%,-50%) rotate(${angle}deg) translateY(-${CIRCLE_RADIUS}px) translateY(-${SPIKE_HEIGHT/2}px)`;
    });
    if(overlay.style.display==="flex") requestAnimationFrame(spinSpikes);
  }
  spinSpikes();

  // When intro ends, remove intro spikes but KEEP overlay visible for the fight.
  introMusic.currentTime=0;
  introMusic.onended=()=>{
    overlay.querySelectorAll(".spike").forEach(s=>s.remove());
    // Keep the overlay visible during the boss fight but allow clicks to pass through.
    overlay.style.pointerEvents = "none";
    bossMusic.currentTime=0;
    bossMusic.play().catch(()=>{}); // ignore play failures
    locked = false; // allow normal clicks during the boss fight
    startBoss();
  };

  const playPromise = introMusic.play();
  if(playPromise !== undefined){
    playPromise.catch(()=>{
      // Autoplay blocked -> skip intro audio and start boss immediately (but keep overlay visible)
      introMusic.onended();
    });
  }
}

/* ===== Boss Movement ===== */
let bossPos={x:4,y:4};

function regenerateMinesAvoidingRevealed(){
  // Regenerate mines but never place on already revealed tiles.
  mines.clear();
  while(mines.size<MINES){
    let r=Math.floor(Math.random()*SIZE*SIZE);
    if(revealed.has(r)) continue;
    mines.add(r);
  }
  // Update mine counter display (flags may be stale, still show MINES - flags)
  mineCounter.textContent=String(MINES-flagged.size).padStart(3,"0");
}

function refreshRevealedCounts(){
  // Update visible counts for already revealed safe tiles after mines changed
  for(const i of revealed){
    const c=cells[i];
    // don't overwrite mine reveal (shouldn't happen because we avoid revealed when placing mines)
    if(c.classList.contains("mine")) continue;
    // remove previous number classes
    for(let n=1;n<=8;n++) c.classList.remove("n"+n);
    const count=neighbors(i).filter(n=>mines.has(n)).length;
    if(count) c.textContent=count, c.classList.add("n"+count);
    else c.textContent="";
  }
}

function clearBossVisuals(){
  // remove boss-related classes/texts from previous boss area
  for(let dx=-1;dx<=1;dx++)
    for(let dy=-1;dy<=1;dy++){
      const x=bossPos.x+dx, y=bossPos.y+dy;
      if(x>=0 && x<SIZE && y>=0 && y<SIZE){
        const idx=y*SIZE+x;
        cells[idx].classList.remove("boss","boss-center");
        // if not revealed and not flagged, clear any boss text
        if(!revealed.has(idx) && !flagged.has(idx)) cells[idx].textContent="";
      }
    }
}

function startBoss(){
  const BOSS_SIZE=3;

  function moveBoss(){
    if(overlay.style.display!=="flex") return; // stop if overlay hidden (fight ended)

    // clear old boss visuals
    clearBossVisuals();

    // new random position (ensure whole 3x3 fits inside grid)
    bossPos.x=Math.floor(Math.random()*(SIZE-2));
    bossPos.y=Math.floor(Math.random()*(SIZE-2));

    // Move mines when boss moves; do not place mines on already revealed tiles
    regenerateMinesAvoidingRevealed();

    // apply boss visuals and ensure revealed tiles remain safe (boss won't kill revealed)
    for(let dx=-1;dx<=1;dx++)
      for(let dy=-1;dy<=1;dy++){
        const x=bossPos.x+dx, y=bossPos.y+dy;
        if(x>=0 && x<SIZE && y>=0 && y<SIZE){
          const idx=y*SIZE+x;
          cells[idx].classList.add("boss");
          // center cell shows a "9" marker unless already revealed/flagged
          if(dx===0 && dy===0){
            cells[idx].classList.add("boss-center");
            if(!revealed.has(idx) && !flagged.has(idx)) cells[idx].textContent="9";
          }
        }
      }

    // Update visible counts for tiles already swept so they reflect new mine layout.
    refreshRevealedCounts();

    // Boss does NOT kill already revealed tiles; only player stepping on a mine (via reveal) causes lose.
    setTimeout(moveBoss, 1000); // moves every second
  }

  // ensure there is an initial mine layout that avoids revealed tiles
  regenerateMinesAvoidingRevealed();
  moveBoss();
}

smiley.onclick=reset;
reset();