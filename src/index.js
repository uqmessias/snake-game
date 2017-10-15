$(document).ready(function () {
    setAllPossiblePositions();
    setFood();
    window.requestAnimationFrame(draw);
})

$(document).keydown(function (e) {
    switch (e.which) {
        case 37: /* left */
            snake.direction = 'l'
            break;
        case 38:/* up */
            snake.direction = 'u'
            break;
        case 39:/*right */
            snake.direction = 'r'
            break;
        case 40:/*down */
            snake.direction = 'd'
            break;
    }
})


var game = {
    isRunning: true,
    won: null,
    interval: 500,
    increment: 10,
    canvasWidth: 800,
    canvasHeight: 600,
    possiblePositions: [],
}

var setAllPossiblePositions = function () {
    var possibleX = parseInt(game.canvasWidth / snake.width),
        possibleY = parseInt(game.canvasHeight / snake.height);
    var items = [];

    for (var x = 0; x < possibleX; x++) {
        for (var y = 0; y < possibleY; y++) {
            items.push({ x: x, y: y })
        }
    }

    game.possiblePositions = items;
}

var setFood = function () {
    var food = createRandomFood();
    if (food) {
        snake.food = food;
    } else {
        game.isRunning = false;
        game.won = true;
        alert('ganhou');
    }
}

var snake = {
    direction: 'r', // r, l, u, d
    width: game.increment, height: game.increment,
    food: {},
    body: [
        { x: 0, y: 0 },
    ]
}

function draw() {
    var ctx = document.getElementById('snake-game').getContext('2d');
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, game.canvasWidth, game.canvasHeight);
    drawSnakeAndFood(ctx)

    if (game.isRunning) {
        moveSnake()

        if (didCollide()) {
            game.isRunning = false;
            game.won = false;
            alert('perdeu');
        } else {
            redrawTimeout(game.interval);
        }
    }
}

function redrawTimeout(timeout) {
    return setTimeout(function () {
        window.requestAnimationFrame(draw);
    }, timeout);
}

function drawSnakeAndFood(ctx) {
    if (snake.food) {
        ctx.fillStyle = 'white'
        ctx.fillRect(snake.food.x, snake.food.y, snake.width, snake.height)
    }

    for (var i = 0; i < snake.body.length; i++) {
        var snakeBody = snake.body[i]
        ctx.fillStyle = 'white'
        ctx.fillRect(snakeBody.x, snakeBody.y, snake.width, snake.height)
    }
}

function didCollideWithFood() {
    var last = snake.body[snake.body.length - 1];
    var food = snake.food;
    return last.x === food.x && last.y === food.y;
}

function createRandomFood() {
    var newItems = [];

    for (var i = 0; i < game.possiblePositions.length; i++) {
        var item = game.possiblePositions[i];
        var addItem = true;

        for (var s = 0; s < snake.body; s++) {
            var snakeItem = snake.body[s],
                sX = snakeItem.x / snake.width,
                sY = snakeItem.y / snake.height;

            if (item.x === sX && item.y === sY) {
                addItem = false;
                break;
            }
        }

        if (addItem) {
            newItems.push({ x: item.x, y: item.y });
        }
    }

    if (newItems.length === 0) {
        return null;
    }

    var index = parseInt(Math.random() * (newItems.length - 1))
    console.log(index);
    return newItems[index];
}

function didCollide() {
    var head = snake.body[snake.body.length - 1];

    if (head.x < 0 || head.y < 0 ||
        head.x >= game.canvasWidth || head.y >= game.canvasHeight) {
        return true;
    }

    if (snake.body.length > 3) {
        for (var i = snake.body.length - 2; i >= 0; i++) {
            var item = snake.body[i];
            if (head.x === item.x && head.y === item.y) {
                return true;
            }
        }
    }

    return false;
}

function moveSnake() {
    var move = true;
    var increment = { x: 0, y: 0 };

    switch (snake.direction) {
        case 'r':
            increment.x = game.increment;
            break;
        case 'l':
            increment.x = game.increment * -1;
            break;
        case 'u':
            increment.y = game.increment * -1;
            break;
        case 'd':
            increment.y = game.increment;
            break;
        default:
            move = false;
            break;
    }

    if (move) {
        if (snake.body.length > 1) {
            var last = snake.body[snake.body.length - 1];
            for (var i = snake.body.length - 2; i >= 0; i--) {
                var snakeItem = snake.body[i]
                var sX = snakeItem.x, sY = snakeItem.y;
                snakeItem.x = last.x;
                snakeItem.y = last.y;
                last = { x: sX, y: sY }
            }
        }

        var lastItem = snake.body[snake.body.length - 1];
        lastItem.x += increment.x;
        lastItem.y += increment.y;
    }
}
