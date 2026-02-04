let score=0;let highScore=localStorage.getItem('highScore')||0;function updateDisplay(){document.getElementById('score').innerText=`Score: ${score}`;document.getElementById('highScore').innerText=`High Score: ${highScore}`}
function cookieClick(){score+=1;if(score>highScore){highScore=score;localStorage.setItem('highScore',highScore)}
updateDisplay()}
document.querySelector('.button1').addEventListener('click',cookieClick);window.onload=function(){updateDisplay()}