const player1=document.getElementById("player1");const player2=document.getElementById("player2");const tagStatus=document.getElementById("tag-status");let player1Pos={x:100,y:100};let player2Pos={x:400,y:100};let isPlayer1It=!0;let tagDelayActive=!1;const baseSpeed=5;const slowSpeed=1;let currentSpeed=baseSpeed;let speedDecayInterval;const speedDecayRate=0.05;const speedDecayDelay=2000;let keys={};player1.style.left=player1Pos.x+"px";player1.style.top=player1Pos.y+"px";player2.style.left=player2Pos.x+"px";player2.style.top=player2Pos.y+"px";document.addEventListener("keydown",(event)=>{keys[event.key]=!0});document.addEventListener("keyup",(event)=>{keys[event.key]=!1});function gameLoop(){if(!tagDelayActive){movePlayers()}else{moveNonItPlayer()}
checkTag();requestAnimationFrame(gameLoop)}
function movePlayers(){if(!tagDelayActive){movePlayer1();movePlayer2()}}
function moveNonItPlayer(){if(isPlayer1It){movePlayer2()}else{movePlayer1()}}
function movePlayer1(){let speed=isPlayer1It?baseSpeed:currentSpeed;if(keys.ArrowUp&&player1Pos.y>0){player1Pos.y-=speed}
if(keys.ArrowDown&&player1Pos.y<520){player1Pos.y+=speed}
if(keys.ArrowLeft&&player1Pos.x>0){player1Pos.x-=speed}
if(keys.ArrowRight&&player1Pos.x<720){player1Pos.x+=speed}
player1.style.left=player1Pos.x+"px";player1.style.top=player1Pos.y+"px"}
function movePlayer2(){let speed=isPlayer1It?currentSpeed:baseSpeed;if(keys.w&&player2Pos.y>0){player2Pos.y-=speed}
if(keys.s&&player2Pos.y<520){player2Pos.y+=speed}
if(keys.a&&player2Pos.x>0){player2Pos.x-=speed}
if(keys.d&&player2Pos.x<720){player2Pos.x+=speed}
player2.style.left=player2Pos.x+"px";player2.style.top=player2Pos.y+"px"}
function checkTag(){const dx=player1Pos.x-player2Pos.x;const dy=player1Pos.y-player2Pos.y;const distance=Math.sqrt(dx*dx+dy*dy);if(distance<80){if(!tagDelayActive){if(isPlayer1It){tagStatus.textContent="Player 2 is 'it'!";stopSpeedDecay();resetRunnerSpeed();isPlayer1It=!1}else{tagStatus.textContent="Player 1 is 'it'!";stopSpeedDecay();resetRunnerSpeed();isPlayer1It=!0}
activateTagDelay();startSpeedDecay()}}}
function activateTagDelay(){tagDelayActive=!0;setTimeout(()=>{tagDelayActive=!1},1000)}
function startSpeedDecay(){currentSpeed=baseSpeed;speedDecayInterval=setInterval(()=>{if(currentSpeed>slowSpeed){currentSpeed-=speedDecayRate}else{currentSpeed=slowSpeed}},1000)}
function stopSpeedDecay(){clearInterval(speedDecayInterval)}
function resetRunnerSpeed(){currentSpeed=baseSpeed}
gameLoop()