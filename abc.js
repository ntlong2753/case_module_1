let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

let gameBoard = {
    width: canvas.width,
    height: canvas.height
};

let ball = {
    x: Math.random() * (gameBoard.width - 20) + 10, // vị trí ngang ngẫu nhiên
    y: 10,                                          // điểm cao nhất
    radius: 10,
    angle: (Math.random() * Math.PI) / 2 + Math.PI / 4,
    // góc ngẫu nhiên từ 45° đến 135° (bay chéo xuống)
    speed: 4,
    dx: 0,
    dy: 0,
    updateDirection: function() {
        this.dx = this.speed * Math.cos(this.angle);
        this.dy = this.speed * Math.sin(this.angle);
    },
    move: function() {
        this.x += this.dx;
        this.y += this.dy;
    },
    bounceHorizontal: function() {
        this.angle = Math.PI - this.angle;
        this.updateDirection();
    },
    bounceVertical: function() {
        this.angle = -this.angle;
        this.updateDirection();
    }
};

let bar = {
    width: 100,
    height: 10,
    x: gameBoard.width / 2 - 50,
    y: gameBoard.height - 20,
    speed: 6,
    moveLeft: function() {
        this.x = Math.max(0, this.x - this.speed);
    },
    moveRight: function() {
        this.x = Math.min(gameBoard.width - this.width, this.x + this.speed);
    }
};

let keys = {};
document.addEventListener('keydown', function(e) {
    keys[e.key] = true;
});
document.addEventListener('keyup', function(e) {
    keys[e.key] = false;
});

let score = 0;
let gameOver = false;
let animationId;

function updateBar() {
    if (keys['ArrowLeft']) bar.moveLeft();
    if (keys['ArrowRight']) bar.moveRight();
}

function checkCollision() {
    if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= gameBoard.width) {
        ball.bounceHorizontal();
    }

    if (ball.y - ball.radius <= 0) {
        ball.bounceVertical();
    }

    if (ball.y + ball.radius >= gameBoard.height) {
        endGame();
    }

    if (
        ball.y + ball.radius >= bar.y &&
        ball.x >= bar.x &&
        ball.x <= bar.x + bar.width
    ) {
        ball.y = bar.y - ball.radius; // đặt bóng ngay trên bệ
        ball.bounceVertical();

        if (keys['ArrowLeft']) ball.angle -= 0.1;
        if (keys['ArrowRight']) ball.angle += 0.1;
        ball.updateDirection();

        score++; // tăng điểm khi đỡ bóng
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
}

function drawBar() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(bar.x, bar.y, bar.width, bar.height);
}

function drawScore() {
    ctx.fillStyle = 'red';
    ctx.font = '16px Arial';
    ctx.fillText("Score: " + score, 10, 20);
}

function endGame() {
    if (!gameOver) {
        gameOver = true;
        cancelAnimationFrame(animationId);
        setTimeout(function() {
            alert("Game Over! Điểm của bạn: " + score);
            document.location.reload();
        }, 100);
    }
}

function update() {
    ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);

    ball.move();
    updateBar();
    checkCollision();

    drawBall();
    drawBar();
    drawScore();

    animationId = requestAnimationFrame(update);
}

// Delay 1 giây trước khi bắt đầu
setTimeout(function() {
    ball.updateDirection();
    update();
}, 1000);
