class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = {};
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Only set up event listeners in browser environment
        if (typeof window !== 'undefined') {
            window.addEventListener('keydown', (e) => {
                this.keys[e.key] = true;
                this.handleKeyPress(e.key);
            });

            window.addEventListener('keyup', (e) => {
                this.keys[e.key] = false;
            });
        }
    }

    handleKeyPress(key) {
        switch(key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.game.snake.changeDirection('up');
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.game.snake.changeDirection('down');
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.game.snake.changeDirection('left');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.game.snake.changeDirection('right');
                break;
            case ' ':
                if (!this.game.gameRunning) {
                    this.game.start();
                } else {
                    this.game.stop();
                }
                break;
            case 'r':
            case 'R':
                this.game.reset();
                break;
        }
    }

    isKeyPressed(key) {
        return !!this.keys[key];
    }

    destroy() {
        // Note: We can't remove the specific bound functions easily,
        // so we'll just clear the keys object
        this.keys = {};
    }
}

// Export for Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputHandler;
} else {
    window.InputHandler = InputHandler;
}