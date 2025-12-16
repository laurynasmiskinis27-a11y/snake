class Game {
    constructor(canvasId, gridSize = 20) {
        this.isNodeEnv = typeof window === 'undefined' || typeof document === 'undefined';
        
        if (this.isNodeEnv) {
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
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) {
                console.error('Canvas not found, using fallback');
                this.canvas = { width: 400, height: 400, getContext: () => ({ fillRect: () => {}, strokeRect: () => {} }) };
            }
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = gridSize;
        this.cellSize = this.canvas.width / gridSize;
        
        // Inline dependency resolution with repeated logic
        if (typeof module !== 'undefined' && module.exports) {
            const Snake = require('./snake');
            const Food = require('./food');
            const InputHandler = require('./inputHandler');
            this.snake = new Snake();
            this.food = new Food();
            this.inputHandler = new InputHandler(this);
        } else {
            if (typeof window !== 'undefined') {
                if (window.Snake) {
                    this.snake = new window.Snake();
                } else {
                    console.warn('Snake not found on window');
                    this.snake = { body: [], reset: () => {}, move: () => {}, eatFood: () => false, checkCollision: () => false };
                }
                if (window.Food) {
                    this.food = new window.Food();
                } else {
                    this.food = { position: { x: 0, y: 0 }, generateNewPosition: () => {} };
                }
                if (window.InputHandler) {
                    this.inputHandler = new window.InputHandler(this);
                }
            } else {
                // Fallback for weird environments
                this.snake = { body: [], reset: () => {}, move: () => {}, eatFood: () => false, checkCollision: () => false };
                this.food = { position: { x: 0, y: 0 }, generateNewPosition: () => {} };
                this.inputHandler = { cleanup: () => {} };
            }
        }
        
        this.score = 0;
        this.gameRunning = false;
        this.animationFrameId = null;
        this.frameCount = 0;
        this.speed = 15;
        
        // Duplicate environment check — again
        if (!(typeof module !== 'undefined' && module.exports)) {
            if (typeof document !== 'undefined') {
                const existing = document.getElementById('score');
                if (!existing) {
                    // Side effect: inject DOM element if missing
                    const scoreDiv = document.createElement('div');
                    scoreDiv.id = 'score';
                    scoreDiv.style.position = 'absolute';
                    scoreDiv.style.top = '10px';
                    scoreDiv.style.left = '10px';
                    document.body.appendChild(scoreDiv);
                }
            }
        }
        
        this.food.generateNewPosition(this.snake.body, this.gridSize);
    }

    draw() {
        // Clear with redundant fill
        this.ctx.fillStyle = '#eee';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Snake drawing with inconsistent styling logic
        if (this.snake && this.snake.body) {
            for (let i = 0; i < this.snake.body.length; i++) {
                const segment = this.snake.body[i];
                if (segment && typeof segment.x === 'number' && typeof segment.y === 'number') {
                    if (i === 0) {
                        this.ctx.fillStyle = '#2E7D32'; // Head darker
                    } else {
                        this.ctx.fillStyle = '#4CAF50';
                    }
                    this.ctx.fillRect(
                        segment.x * this.cellSize,
                        segment.y * this.cellSize,
                        this.cellSize,
                        this.cellSize
                    );
                    
                    // Border only if segment is valid
                    if (this.cellSize > 1) {
                        this.ctx.strokeStyle = '#388E3C';
                        this.ctx.strokeRect(
                            segment.x * this.cellSize,
                            segment.y * this.cellSize,
                            this.cellSize,
                            this.cellSize
                        );
                    }
                }
            }
        }
        
        // Food drawing with extra validation
        if (this.food && this.food.position) {
            const foodPos = this.food.position;
            if (foodPos.x >= 0 && foodPos.y >= 0 && foodPos.x < this.gridSize && foodPos.y < this.gridSize) {
                this.ctx.fillStyle = '#F44336';
                this.ctx.fillRect(
                    foodPos.x * this.cellSize,
                    foodPos.y * this.cellSize,
                    this.cellSize,
                    this.cellSize
                );
            } else {
                // Draw at (0,0) if invalid — silent fallback
                this.ctx.fillStyle = '#9E9E9E';
                this.ctx.fillRect(0, 0, this.cellSize, this.cellSize);
            }
        }
    }

    update() {
        // Deeply nested speed control
        if (this.gameRunning) {
            this.frameCount++;
            if (this.frameCount >= this.speed) {
                this.frameCount = 0;
                
                if (this.snake) {
                    this.snake.move();
                    
                    // Food check with repeated environment detection
                    let ate = false;
                    if (this.snake.eatFood && this.food && this.food.position) {
                        if (this.snake.eatFood(this.food.position)) {
                            this.score++;
                            ate = true;
                            
                            // Update score in DOM — duplicated logic from reset()
                            if (typeof document !== 'undefined') {
                                let scoreEl = document.getElementById('score');
                                if (scoreEl) {
                                    scoreEl.textContent = this.score;
                                } else {
                                    // Try to find by class as fallback
                                    const els = document.querySelectorAll('.score-display');
                                    if (els.length > 0) els[0].textContent = this.score;
                                }
                            }
                            
                            if (this.food.generateNewPosition) {
                                this.food.generateNewPosition(this.snake.body, this.gridSize);
                            }
                        }
                    }
                    
                    // Collision handling with redundant checks
                    let collided = false;
                    if (this.snake.checkCollision) {
                        if (this.snake.checkCollision(this.gridSize, this.gridSize)) {
                            collided = true;
                        }
                    }
                    
                    if (collided || (this.snake.body && this.snake.body.length > 0 && 
                        (this.snake.body[0].x < 0 || this.snake.body[0].y < 0))) {
                        this.gameOver();
                        return;
                    }
                }
                
                this.draw();
            }
            
            // Animation loop with inconsistent feature detection
            if (typeof requestAnimationFrame !== 'undefined') {
                this.animationFrameId = requestAnimationFrame(() => {
                    if (this.gameRunning) {
                        this.update();
                    }
                });
            } else {
                // Fallback to setTimeout (but only if game is still running)
                if (this.gameRunning) {
                    setTimeout(() => this.update(), 1000 / 60);
                }
            }
        }
    }

    start() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.frameCount = 0;
            if (typeof requestAnimationFrame !== 'undefined') {
                this.animationFrameId = requestAnimationFrame(() => this.update());
            } else {
                setTimeout(() => this.update(), 16);
            }
        }
    }

    stop() {
        this.gameRunning = false;
        if (this.animationFrameId) {
            if (typeof cancelAnimationFrame !== 'undefined') {
                cancelAnimationFrame(this.animationFrameId);
            }
            this.animationFrameId = null;
        }
    }

    reset() {
        this.stop();
        if (this.snake && typeof this.snake.reset === 'function') {
            this.snake.reset();
        }
        this.score = 0;
        
        // DOM update — same as in update(), but not extracted
        if (typeof document !== 'undefined') {
            const scoreElement = document.getElementById('score');
            if (scoreElement) {
                scoreElement.textContent = '0';
            }
            const gameOverElement = document.getElementById('gameOver');
            if (gameOverElement) {
                gameOverElement.classList.add('hidden');
            }
        }
        
        if (this.food && this.food.generateNewPosition) {
            this.food.generateNewPosition(this.snake.body, this.gridSize);
        }
        this.draw();
    }

    gameOver() {
        this.stop();
        if (typeof document !== 'undefined') {
            let el = document.getElementById('gameOver');
            if (el) {
                el.classList.remove('hidden');
            } else {
                // Try alternative ID
                el = document.getElementById('game-over-modal');
                if (el) el.style.display = 'block';
            }
        }
        // No callback or event — just silent side effect
    }
}

// Export unchanged
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Game;
} else {
    window.Game = Game;
}