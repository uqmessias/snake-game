$(document).ready(function () {
    window.requestAnimationFrame(draw);
})

var snake = {
    direction: 'r', // r, l, u, d
    width: 10, height: 10,
    body: [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 10 },
    ]
}

var canvasWidth = 800,
    canvasHeight = 600;

var game = {
    interval: 1000,
}

function draw() {
    var ctx = document.getElementById('snake-game').getContext('2d');
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawSnake(ctx)
}

function drawSnake(ctx) {
    for (var i = 0; i < snake.body.length; i++) {
        var snakeBody = snake.body[i]
        ctx.fillStyle = 'white'
        console.log(snakeBody)
        ctx.fillRect(snakeBody.x, snakeBody.y, snake.width, snake.height)
    }
}

function update() {
    switch (snake.direction) {
        case 'r':
            var last = snake.body[snake.body.length - 1]
            break;
    }
}

function willCollide(nextPoint) {

}
