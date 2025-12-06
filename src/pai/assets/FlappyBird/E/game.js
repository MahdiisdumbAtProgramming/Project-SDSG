// Game configuration
const GAME_CONFIG = {
  moveSpeed: 15,
  gravity: 0.25,
  pipeGap: 35,
  jumpForce: -3.1
};

class FlappyBirdGame {
  constructor() {
      this.bird = document.querySelector('.bird');
      this.background = document.querySelector('.background');
      this.scoreVal = document.querySelector('.score_val');
      this.message = document.querySelector('.message');
      this.scoreTitle = document.querySelector('.score_title');
      this.highScoreVal = document.querySelector('.high_score_val');
      this.gameState = 'Start';
      this.birdDy = 0;
      this.pipeSeparation = 0;
      this.highScore = this.loadHighScore();
      
      this.initializeEventListeners();
      this.updateHighScoreDisplay();
  }

  loadHighScore() {
      const saved = localStorage.getItem('highScore');
      return saved ? parseInt(saved) : 0;
  }

  saveHighScore(score) {
      if (score > this.highScore) {
          this.highScore = score;
          localStorage.setItem('highScore', score);
          return true;
      }
      return false;
  }

  updateHighScoreDisplay() {
      this.highScoreVal.innerHTML = this.highScore;
  }

  initializeEventListeners() {
      document.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && this.gameState !== 'Play') {
              this.startGame();
          }
          if ((e.key === 'ArrowUp' || e.key === ' ') && this.gameState === 'Play') {
              this.birdDy = GAME_CONFIG.jumpForce;
          }
      });
  }

  startGame() {
      document.querySelectorAll('.pipe_sprite').forEach(pipe => pipe.remove());
      this.bird.style.top = '40vh';
      this.gameState = 'Play';
      this.message.innerHTML = '';
      this.scoreTitle.innerHTML = 'Score : ';
      this.scoreVal.innerHTML = '0';
      
      this.play();
  }

  play() {
      this.moveElements();
      this.applyGravity();
      this.createPipes();
  }

  moveElements() {
      const move = () => {
          if (this.gameState !== 'Play') return;
          
          const pipes = document.querySelectorAll('.pipe_sprite');
          pipes.forEach(pipe => {
              const pipeProps = pipe.getBoundingClientRect();
              const birdProps = this.bird.getBoundingClientRect();
              
              if (pipeProps.right <= 0) {
                  pipe.remove();
              } else {
                  if (this.checkCollision(birdProps, pipeProps)) {
                      this.endGame();
                      return;
                  }
                  
                  this.updateScore(pipe, pipeProps, birdProps);
                  pipe.style.left = `${pipeProps.left - GAME_CONFIG.moveSpeed}px`;
              }
          });
          
          requestAnimationFrame(move);
      };
      
      requestAnimationFrame(move);
  }

  checkCollision(bird, pipe) {
      return (
          bird.left < pipe.left + pipe.width &&
          bird.left + bird.width > pipe.left &&
          bird.top < pipe.top + pipe.height &&
          bird.top + bird.height > pipe.top
      );
  }

  applyGravity() {
      const gravity = () => {
          if (this.gameState !== 'Play') return;
          
          this.birdDy += GAME_CONFIG.gravity;
          const birdProps = this.bird.getBoundingClientRect();
          const backgroundProps = this.background.getBoundingClientRect();
          
          if (birdProps.top <= 0 || birdProps.bottom >= backgroundProps.bottom) {
              this.endGame();
              return;
          }
          
          this.bird.style.top = `${birdProps.top + this.birdDy}px`;
          requestAnimationFrame(gravity);
      };
      
      requestAnimationFrame(gravity);
  }

  createPipes() {
      const create = () => {
          if (this.gameState !== 'Play') return;
          
          if (this.pipeSeparation > 115) {
              this.pipeSeparation = 0;
              const pipePosition = Math.floor(Math.random() * 43) + 8;
              
              this.createPipePair(pipePosition);
          }
          
          this.pipeSeparation++;
          requestAnimationFrame(create);
      };
      
      requestAnimationFrame(create);
  }

  createPipePair(position) {
      const upperPipe = this.createPipeElement(position - 70, false);
      const lowerPipe = this.createPipeElement(position + GAME_CONFIG.pipeGap, true);
      
      document.body.appendChild(upperPipe);
      document.body.appendChild(lowerPipe);
  }

  createPipeElement(topPosition, increaseScore) {
      const pipe = document.createElement('div');
      pipe.className = 'pipe_sprite';
      pipe.style.top = `${topPosition}vh`;
      pipe.style.left = '100vw';
      if (increaseScore) pipe.increase_score = '1';
      return pipe;
  }

  endGame() {
      this.gameState = 'End';
      const currentScore = parseInt(this.scoreVal.innerHTML);
      const isNewHighScore = this.saveHighScore(currentScore);
      
      this.message.innerHTML = isNewHighScore 
          ? 'New High Score! Press Enter To Restart'
          : 'Press Enter To Restart';
      this.message.style.left = '28vw';
      this.updateHighScoreDisplay();
  }

  updateScore(pipe, pipeProps, birdProps) {
      if (
          pipeProps.right < birdProps.left &&
          pipeProps.right + GAME_CONFIG.moveSpeed >= birdProps.left &&
          pipe.increase_score === '1'
      ) {
          this.scoreVal.innerHTML = parseInt(this.scoreVal.innerHTML) + 1;
      }
  }
}

// Initialize game
const game = new FlappyBirdGame();
