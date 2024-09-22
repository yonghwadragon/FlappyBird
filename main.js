// 캔버스 설정
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 게임 오버 화면 요소
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

// 시작 화면 요소
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');

// 게임 변수 설정
let frames = 0;
let gameState = 'start'; // 'start', 'playing', 'gameover'
let score = 0;

// 새 클래스 정의
class Bird {
  constructor() {
    this.x = 50;
    this.y = canvas.height / 2;
    this.radius = 12; // 새를 원으로 표현
    this.gravity = 0.25;
    this.lift = -4.6;
    this.velocity = 0;
  }

  draw() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'orange';
    ctx.stroke();
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    // 바닥 또는 천장 충돌 감지
    if (this.y + this.radius >= canvas.height || this.y - this.radius <= 0) {
      gameOver();
    }
  }

  flap() {
    this.velocity = this.lift;
    // 사운드 제거
  }

  reset() {
    this.y = canvas.height / 2;
    this.velocity = 0;
  }
}

// 파이프 클래스 정의
class Pipe {
  constructor() {
    this.x = canvas.width;
    this.width = 52;
    this.gap = 120;
    this.speed = 2;
    this.top = Math.floor(Math.random() * (canvas.height / 2)) + 20;
    this.bottom = this.top + this.gap;
    this.counted = false;
  }

  draw() {
    ctx.fillStyle = 'green';
    // 위쪽 파이프
    ctx.fillRect(this.x, 0, this.width, this.top);
    // 아래쪽 파이프
    ctx.fillRect(this.x, this.bottom, this.width, canvas.height - this.bottom);
  }

  update() {
    this.x -= this.speed;

    // 파이프가 화면을 벗어나면 제거
    if (this.x + this.width < 0) {
      pipes.shift();
    }

    // 점수 증가
    if (!this.counted && this.x + this.width < bird.x) {
      score++;
      this.counted = true;
    }

    // 충돌 감지
    if (
      (bird.x + bird.radius > this.x && bird.x - bird.radius < this.x + this.width) &&
      (bird.y - bird.radius < this.top || bird.y + bird.radius > this.bottom)
    ) {
      gameOver();
    }
  }
}

// 인스턴스 생성
const bird = new Bird();
let pipes = [];

// 입력 이벤트 설정
document.addEventListener('keydown', function (e) {
  if (e.code === 'Space') {
    if (gameState === 'playing') {
      bird.flap();
    }
  }
});

// 클릭 이벤트와 터치 이벤트 모두 처리
canvas.addEventListener('click', handleInput);
canvas.addEventListener('touchstart', handleInput);

function handleInput(e) {
  e.preventDefault();
  if (gameState === 'playing') {
    bird.flap();
  }
}

// 시작 버튼 클릭 시 게임 시작
startButton.addEventListener('click', function () {
  startGame();
});

// 재시작 버튼 클릭 시 게임 재시작
restartButton.addEventListener('click', function () {
  resetGame();
});

// 게임 루프 함수
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameState === 'playing') {
    bird.update();
    bird.draw();

    // 파이프 생성
    if (frames % 90 === 0) { // 파이프 생성 속도 조절
      pipes.push(new Pipe());
    }

    // 파이프 업데이트 및 그리기
    pipes.forEach(pipe => {
      pipe.update();
      pipe.draw();
    });

    // 점수 표시
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`점수: ${score}`, 10, 30);

    frames++;
  }

  requestAnimationFrame(gameLoop);
}

// 게임 시작 함수
function startGame() {
  gameState = 'playing';
  startScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  resetGame();
}

// 게임 오버 함수
function gameOver() {
  if (gameState !== 'gameover') {
    gameState = 'gameover';
    finalScoreElement.textContent = score;
    gameOverScreen.classList.remove('hidden');
  }
}

// 게임 리셋 함수
function resetGame() {
  score = 0;
  frames = 0;
  pipes = [];
  bird.reset();
  gameState = 'playing'; // 게임 상태를 'playing'으로 변경
  gameOverScreen.classList.add('hidden'); // 게임 오버 화면 숨김
}

// 게임 루프 시작
gameLoop();
