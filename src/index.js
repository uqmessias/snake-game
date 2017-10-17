$(document).ready(function () {
    setAllPossiblePositions();
    setFood();
    window.requestAnimationFrame(draw);
})

$(document).keydown(function (e) {
    switch (e.which) {
        case 37: /* left */
            snake.asyncDirections.push('l')
            break;
        case 38:/* up */
            snake.asyncDirections.push('u')
            break;
        case 39:/*right */
            snake.asyncDirections.push('r')
            break;
        case 40:/*down */
            snake.asyncDirections.push('d')
            break;
        case 32: /* space */
            window.requestAnimationFrame(draw);
            game.isRunning = !game.isRunning;
            game.won = null;
            break;
    }
})


var game = {
    isRunning: true,
    won: null,
    interval: 10,
    increment: 10,
    diameter: 10,
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
    }
}

var snake = {
    direction: 'r', // r, l, u, d
    asyncDirections: [],
    width: game.diameter, height: game.diameter,
    food: {},
    body: [
        { x: 0, y: 0 },
    ]
}

function update() {
    if (didCollideWithFood()) {
        var firstItem = snake.body.shift();
        snake.body.unshift(snake.food);
        snake.body.unshift(firstItem);
        snake.food = createRandomFood()
        console.log(JSON.stringify(snake.body));
        moveSnake(true);
        console.log(JSON.stringify(snake.body));
    } else {
        moveSnake()
    }

    if (didCollide()) {
        game.isRunning = false;
        game.won = false;
        return false;
    }

    return true;
}

function changeDirection() {
    if (snake.body[0].x % game.diameter === 0 && snake.body[0].y % game.diameter === 0) {
        var lastDirection = snake.direction, upDown = ['u', 'd'], leftRight = ['l', 'r'];
        while (snake.asyncDirections.length > 0) {
            var newDirection = snake.asyncDirections.shift();

            // last and new are equal
            if (newDirection === lastDirection) {
                game.increment++;
            } else if (
                // last and new are opposite
                (upDown.indexOf(newDirection) !== -1 && upDown.indexOf(lastDirection) !== -1) ||
                (leftRight.indexOf(newDirection) !== -1 && leftRight.indexOf(lastDirection) !== -1)) {
                if (game.increment > 0) {
                    game.increment--;
                }
            } else {
                snake.direction = newDirection;
            }

            lastDirection = newDirection;
        }
    }
}

function draw() {
    if (game.isRunning) {
        var ctx = document.getElementById('snake-game').getContext('2d');
        ctx.globalCompositeOperation = 'destination-over';
        ctx.clearRect(0, 0, game.canvasWidth, game.canvasHeight);

        drawSnakeAndFood(ctx);

        changeDirection();

        update();

        redrawTimeout(game.interval);
    } else if (game.won !== null) {
        alert(game.won ? 'ganhou' : 'perdeu');
    }
}

function redrawTimeout(timeout) {
    return setTimeout(function () {
        window.requestAnimationFrame(draw);
    }, timeout);
}

function drawSnakeAndFood(ctx) {
    if (snake.food) {
        ctx.fillStyle = 'red'
        ctx.fillRect(snake.food.x, snake.food.y, snake.width, snake.height)
    }

    for (var i = 0; i < snake.body.length; i++) {
        var snakeBody = snake.body[i];
        ctx.fillStyle = i === 0 ? 'yellow' : 'white';
        ctx.fillRect(snakeBody.x, snakeBody.y, snake.width, snake.height)
    }
}

function didCollideWithFood() {
    var head = snake.body[0];
    var food = snake.food;
    return head.x === food.x && head.y === food.y;
}

function createRandomFood() {
    var newItems = [];

    for (var i = 0; i < game.possiblePositions.length; i++) {
        var item = game.possiblePositions[i];
        var addItem = true;

        for (var s = 0; s < snake.body.length; s++) {
            var snakeItem = snake.body[s],
                sX = snakeItem.x / snake.width,
                sY = snakeItem.y / snake.height;

            if (item.x === sX && item.y === sY) {
                addItem = false;
                break;
            }
        }

        if (addItem) {
            newItems.push({ x: item.x * snake.width, y: item.y * snake.height });
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
    var head = snake.body[0];

    if (head.x <= 0 || head.y <= 0 ||
        head.x >= game.canvasWidth || head.y >= game.canvasHeight) {
        console.warn('out of screen');
        //return true;
        if (head.x < 0) heax.x = game.canvasWidth - snake.width;
        if (head.y < 0) head.y = game.canvasHeight - snake.height;
        if (head.x > game.canvasWidth) head.x = snake.width;
        if (head.y > game.canvasHeight) head.y = snake.height;
    }

    if (snake.body.length > 3) {
        for (var i = 2; i < snake.body.length; i++) {
            var item = snake.body[i];
            if (head.x === item.x && head.y === item.y) {
                console.warn('collided with itself');
                console.log(`i: ${i} -> head: ${JSON.stringify(head)}\nitem: ${JSON.stringify(item)}\nsnake: ${JSON.stringify(snake)}\ngame: ${JSON.stringify(game)}`)
                return true;
            }
        }
    }

    return false;
}

function moveSnake(justTheFirstItem) {
    var move = true;
    var increment = { x: 0, y: 0 };
    var incrementer = justTheFirstItem ? game.diameter : game.increment;

    switch (snake.direction) {
        case 'r':
            increment.x = incrementer;
            break;
        case 'l':
            increment.x = incrementer * -1;
            break;
        case 'u':
            increment.y = incrementer * -1;
            break;
        case 'd':
            increment.y = incrementer;
            break;
        default:
            move = false;
            break;
    }

    if (move) {
        if (!justTheFirstItem) {
            if (snake.body.length > 1) {
                var head = snake.body[0];
                for (var i = 1; i < snake.body.length; i++) {
                    var snakeItem = snake.body[i]
                    var sX = snakeItem.x, sY = snakeItem.y;
                    snakeItem.x = head.x;
                    snakeItem.y = head.y;
                    head = { x: sX, y: sY }
                }
            }
        }

        var headItem = snake.body[0];
        headItem.x += increment.x;
        headItem.y += increment.y;
    }
}
