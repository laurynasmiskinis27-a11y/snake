class Game {
    constructor(canvasId, gridSize = 20) {
        // Determine if we're in a Node.js environment (for testing)
        const isNodeEnv = typeof window === 'undefined' || typeof document === 'undefined';
        
        if (isNodeEnv) {
            // Create a mock canvas for Node.js/testing
            this.canvas = {
                width: 400,
                height: 400,
                getContext: () => ({
                    fillStyle: '',
                    strokeStyle: '',
                    fillRect: () => {},
                    strokeRect: () => {}
                })
            };
        } else {
            // In browser environment, get the actual canvas element
            this.canvas = document.getElementById(canvasId);
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = gridSize;
        this.cellSize = this.canvas.width / gridSize;
        
        // Use globals directly from window in browser environment
        this.snake = typeof module !== 'undefined' && module.exports ? 
            new (require('./snake'))() : new window.Snake();
        this.food = typeof module !== 'undefined' && module.exports ? 
            new (require('./food'))() : new window.Food();
        
        this.score = 0;
        this.gameRunning = false;
        this.animationFrameId = null;
        
        // Add these properties for speed control
        this.frameCount = 0;
        this.speed = 15; // Lower is faster, higher is slower
        
        // Create input handler
        this.inputHandler = typeof module !== 'undefined' && module.exports ? 
            new (require('./inputHandler'))(this) : new window.InputHandler(this);
        
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
                // In test environment, we might not have requestAnimationFrame
                if (typeof requestAnimationFrame !== 'undefined') {
                    this.animationFrameId = requestAnimationFrame(() => this.update());
                }
            }
            return;
        }
        
        this.frameCount++;
        this.snake.move();
        
        // Check if snake ate food
        if (this.snake.eatFood(this.food.position)) {
            this.score++;
            // Handle score display in browser
            if (typeof document !== 'undefined' && typeof window !== 'undefined') {
                const scoreElement = document.getElementById('score');
                if (scoreElement) {
                    scoreElement.textContent = this.score;
                }
            }
            this.food.generateNewPosition(this.snake.body, this.gridSize);
        }
        
        // Check for collisions
        if (this.snake.checkCollision(this.gridSize, this.gridSize)) {
            this.gameOver();
            return;
        }
        
        this.draw();
        
        if (this.gameRunning) {
            // In test environment, we might not have requestAnimationFrame
            if (typeof requestAnimationFrame !== 'undefined') {
                this.animationFrameId = requestAnimationFrame(() => this.update());
            }
        }
    }

    start() {
        if (this.gameRunning) return;
        
        this.gameRunning = true;
        // In test environment, we might not have requestAnimationFrame
        if (typeof requestAnimationFrame !== 'undefined') {
            this.animationFrameId = requestAnimationFrame(() => this.update());
        }
    }

    stop() {
        this.gameRunning = false;
        if (this.animationFrameId && typeof cancelAnimationFrame !== 'undefined') {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    reset() {
        this.stop();
        this.snake.reset();
        this.score = 0;
        // Handle DOM elements in browser
        if (typeof document !== 'undefined' && typeof window !== 'undefined') {
            const scoreElement = document.getElementById('score');
            if (scoreElement) {
                scoreElement.textContent = this.score;
            }
            const gameOverElement = document.getElementById('gameOver');
            if (gameOverElement) {
                gameOverElement.classList.add('hidden');
            }
        }
        this.food.generateNewPosition(this.snake.body, this.gridSize);
        this.draw();
    }

    gameOver() {
        this.stop();
        // Handle DOM elements in browser
        if (typeof document !== 'undefined' && typeof window !== 'undefined') {
            const gameOverElement = document.getElementById('gameOver');
            if (gameOverElement) {
                gameOverElement.classList.remove('hidden');
            }
        }
    }
}

// Export for Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Game;
} else {
    window.Game = Game;
}