class Snake {
    constructor() {
        this.reset();
    }

    reset() {
        this.body = [
            {x: 10, y: 10},
            {x: 9, y: 10},
            {x: 8, y: 10}
        ];
        this.direction = 'right';
        this.nextDirection = 'right';
        this.grow = false;
    }

    move() {
        // Update direction only if not opposite to current direction
        if ((this.nextDirection === 'up' && this.direction !== 'down') ||
            (this.nextDirection === 'down' && this.direction !== 'up') ||
            (this.nextDirection === 'left' && this.direction !== 'right') ||
            (this.nextDirection === 'right' && this.direction !== 'left')) {
            this.direction = this.nextDirection;
        }

        // Calculate new head position based on direction
        const head = {...this.body[0]};
        
        switch(this.direction) {
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'right':
                head.x += 1;
                break;
        }
        
        // Add new head to the beginning of the body
        this.body.unshift(head);
        
        // Remove tail unless we need to grow
        if (!this.grow) {
            this.body.pop();
        } else {
            this.grow = false;
        }
    }

    changeDirection(newDirection) {
        this.nextDirection = newDirection;
    }

    checkCollision(width, height) {
        const head = this.body[0];
        
        // Check wall collision
        if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
            return true;
        }
        
        // Check self collision (skip first element since it's the head)
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        
        return false;
    }

    eatFood(food) {
        const head = this.body[0];
        if (head.x === food.x && head.y === food.y) {
            this.grow = true;
            return true;
        }
        return false;
    }
}

class Food {
    constructor() {
        this.position = {x: 0, y: 0};
    }

    generateNewPosition(snakeBody, gridSize) {
        let newPosition;
        let overlapping;

        do {
            overlapping = false;
            newPosition = {
                x: Math.floor(Math.random() * gridSize),
                y: Math.floor(Math.random() * gridSize)
            };

            // Check if new position overlaps with snake
            for (const segment of snakeBody) {
                if (segment.x === newPosition.x && segment.y === newPosition.y) {
                    overlapping = true;
                    break;
                }
            }
        } while (overlapping);

        this.position = newPosition;
        return this.position;
    }
}

class Game {
    constructor(canvasId, gridSize = 20) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = gridSize;
        this.cellSize = this.canvas.width / gridSize;
        
        this.snake = new Snake();
        this.food = new Food();
        this.score = 0;
        this.gameRunning = false;
        this.animationFrameId = null;
        
        // Add these properties for speed control
        this.frameCount = 0;
        this.speed = 15; // Lower is faster, higher is slower
        
        // Generate initial food
        this.food.generateNewPosition(this.snake.body, this.gridSize);
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#eee';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw snake
        this.ctx.fillStyle = '#4CAF50';
        for (const segment of this.snake.body) {
            this.ctx.fillRect(
                segment.x * this.cellSize,
                segment.y * this.cellSize,
                this.cellSize,
                this.cellSize
            );
            
            // Draw border around each segment
            this.ctx.strokeStyle = '#388E3C';
            this.ctx.strokeRect(
                segment.x * this.cellSize,
                segment.y * this.cellSize,
                this.cellSize,
                this.cellSize
            );
        }
        
        // Draw food
        this.ctx.fillStyle = '#F44336';
        this.ctx.fillRect(
            this.food.position.x * this.cellSize,
            this.food.position.y * this.cellSize,
            this.cellSize,
            this.cellSize
        );
    }

    update() {
        // Only update every N frames to control speed
        if (this.frameCount % this.speed !== 0) {
            this.frameCount++;
            if (this.gameRunning) {
                this.animationFrameId = requestAnimationFrame(() => this.update());
            }
            return;
        }
        
        this.frameCount++;
        this.snake.move();
        
        // Check if snake ate food
        if (this.snake.eatFood(this.food.position)) {
            this.score++;
            document.getElementById('score').textContent = this.score;
            this.food.generateNewPosition(this.snake.body, this.gridSize);
        }
        
        // Check for collisions
        if (this.snake.checkCollision(this.gridSize, this.gridSize)) {
            this.gameOver();
            return;
        }
        
        this.draw();
        
        if (this.gameRunning) {
            this.animationFrameId = requestAnimationFrame(() => this.update());
        }
    }

    start() {
        if (this.gameRunning) return;
        
        this.gameRunning = true;
        this.animationFrameId = requestAnimationFrame(() => this.update());
    }

    stop() {
        this.gameRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    reset() {
        this.stop();
        this.snake.reset();
        this.score = 0;
        document.getElementById('score').textContent = this.score;
        document.getElementById('gameOver').classList.add('hidden');
        this.food.generateNewPosition(this.snake.body, this.gridSize);
        this.draw();
    }

    gameOver() {
        this.stop();
        document.getElementById('gameOver').classList.remove('hidden');
    }
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Snake, Food, Game };
}