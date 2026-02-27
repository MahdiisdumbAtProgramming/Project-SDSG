const canvas=document.getElementById("introCanvas");
const ctx=canvas.getContext("2d");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

const introMusic=document.getElementById("introMusic");
const skidSound=document.getElementById("skidSound");
const overlay=document.getElementById("startOverlay");

function loadFrames(p){
  return p.map(s=>{
    const i=new Image();
    i.src=s;
    return i;
  });
}

const NUM_GAMES=8;
const gameFrames=[];
for(let i=1;i<=NUM_GAMES;i++){
  const img=new Image();
  img.src=`intro/${i}.png`;
  gameFrames.push(img);
}

const runFrames=loadFrames(["intro/run1.png","intro/run2.png"]);
const skidFrames=loadFrames(["intro/skid1.png","intro/skid2.png","intro/skid3.png"]);
const jumpFrame=new Image(); jumpFrame.src="intro/jump.png";
const idleFrame=new Image(); idleFrame.src="intro/idle.png";
const logoImg=new Image(); logoImg.src="intro/Logo.jpeg";

const TOTAL_DURATION=12516; // 12.516 seconds

// timeline in ms
const GAMES_END=4000;
const MAHDI_END=7000;

let animationRunning=false;
let frameIndex=0;
let frameDelay=0;
let introEnded=false;

const gameObjects=gameFrames.map(img=>({
  img,
  x:Math.random()*canvas.width,
  y:Math.random()*canvas.height,
  angle:Math.random()*Math.PI*2,
  scale:0.6+Math.random()*0.5,
  speed:0.01+Math.random()*0.02,
  alpha:0
}));

function drawBackground(){
  ctx.fillStyle="#000";
  ctx.fillRect(0,0,canvas.width,canvas.height);
}

function drawGameObjects(progress){
  gameObjects.forEach(o=>{
    o.alpha=0.35*(1-progress);

    ctx.save();
    ctx.globalAlpha=o.alpha;
    ctx.translate(o.x,o.y);
    ctx.rotate(o.angle);
    ctx.drawImage(
      o.img,
      -o.img.width*o.scale/2,
      -o.img.height*o.scale/2,
      o.img.width*o.scale,
      o.img.height*o.scale
    );
    ctx.restore();

    o.angle+=o.speed;
  });
}

// stronger easing = more snap
function easeOutExpo(t){
  return t===1?1:1-Math.pow(2,-10*t);
}

function easeInExpo(t){
  return t===0?0:Math.pow(2,10*(t-1));
}

function drawRun(x,y){
  frameDelay++;
  if(frameDelay>=5){ // was 12, now much faster
    frameIndex=(frameIndex+1)%runFrames.length;
    frameDelay=0;
  }
  ctx.drawImage(runFrames[frameIndex],x,y,180,180);
}

function drawSkid(x,y,p){
  const i=Math.min(
    skidFrames.length-1,
    Math.floor(p*(skidFrames.length-0.01))
  );
  ctx.drawImage(skidFrames[i],x,y,200,200);
}

overlay.addEventListener("click",()=>{
  overlay.style.display="none";
  introMusic.currentTime=0;
  skidSound.playedOnce=false;
  introMusic.play();
  animationRunning=true;
  introEnded=false;
  frameIndex=0;
  frameDelay=0;
  requestAnimationFrame(animate);
});

window.addEventListener("keydown",e=>{
  if(introEnded && e.key==="Enter"){
    window.location.href="./pai/load.html";
  }
});

function animate(){
  if(!animationRunning)return;

  const t=introMusic.currentTime*1000; // real audio time

  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBackground();

  // ---- 0–4s Games ----
  if(t<=GAMES_END){

    const progress=t/GAMES_END;
    drawGameObjects(progress);

  }

  // ---- 4–7s Mahdi ----
  else if(t<=MAHDI_END){

    const sectionTime=t-GAMES_END;
    const duration=MAHDI_END-GAMES_END;
    const p=sectionTime/duration;

    if(p<=0.33){ // RUN
      const rp=p/0.33;
      const x=-300+easeOutExpo(rp)*(canvas.width/2+300);
      drawRun(x,canvas.height/2+80);
    }

    else if(p<=0.66){ // SKID
      if(!skidSound.playedOnce){
        skidSound.currentTime=0;
        skidSound.play();
        skidSound.playedOnce=true;
      }

      const sp=(p-0.33)/0.33;
      const sx=canvas.width/2+180;
      const ex=canvas.width/2-120;
      const x=sx+easeInExpo(sp)*(ex-sx);
      drawSkid(x,canvas.height/2+80,sp);
    }

    else{ // JUMP
      const jp=(p-0.66)/0.34;
      const y=canvas.height/2+80
              -Math.sin(jp*Math.PI)*220; // higher jump
      ctx.drawImage(jumpFrame,
        canvas.width/2-110,
        y,
        220,
        220
      );
      if(jp>0.4){
        ctx.drawImage(logoImg,
          canvas.width/2-260,
          120,
          520,
          260
        );
      }
    }
  }

  // ---- 7–12.5s Ending ----
  else{

    ctx.drawImage(logoImg,
      canvas.width/2-260,
      120,
      520,
      260
    );

    const pulse=1+Math.sin(t/150)*0.04; // faster pulse
    const size=200*pulse;

    ctx.drawImage(idleFrame,
      canvas.width/2-size/2,
      canvas.height/2-size/2,
      size,
      size
    );

    ctx.fillStyle="white";
    ctx.font="32px Arial";
    ctx.textAlign="center";
    ctx.fillText("Press Enter to continue",
      canvas.width/2,
      canvas.height-60
    );

    introEnded=true;
  }

  if(t<TOTAL_DURATION){
    requestAnimationFrame(animate);
  }
}