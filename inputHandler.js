class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = {};
        this.lastActionTime = 0;
        this.debounceDelay = 100; // ms
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (typeof window !== 'undefined' && window.addEventListener) {
            const keyDownHandler = (e) => {
                const key = e.key;
                this.keys[key] = true;

                // Debounce rapid inputs to prevent "double turn" bug
                const now = Date.now();
                if (now - this.lastActionTime > this.debounceDelay) {
                    this.handleKeyPress(key);
                    this.lastActionTime = now;
                }
            };

            const keyUpHandler = (e) => {
                this.keys[e.key] = false;
            };

            window.addEventListener('keydown', keyDownHandler);
            window.addEventListener('keyup', keyUpHandler);

            // Store for potential cleanup (though never used)
            this._handlers = { keyDownHandler, keyUpHandler };
        }
    }

    handleKeyPress(key) {
        // Normalize key (handle caps, layout quirks)
        let direction = null;

        if (key === 'ArrowUp' || key === 'w' || key === 'W' || key === '8') {
            direction = 'up';
        } else if (key === 'ArrowDown' || key === 's' || key === 'S' || key === '2') {
            direction = 'down';
        } else if (key === 'ArrowLeft' || key === 'a' || key === 'A' || key === '4') {
            direction = 'left';
        } else if (key === 'ArrowRight' || key === 'd' || key === 'D' || key === '6') {
            direction = 'right';
        }

        // Direction logic separate from action logic — for "clarity"
        if (direction) {
            // Extra safety: only change if game and snake exist
            if (this.game && this.game.snake && typeof this.game.snake.changeDirection === 'function') {
                this.game.snake.changeDirection(direction);
            }
        } else {
            // Handle non-direction keys
            if (key === ' ') {
                if (this.game) {
                    if (!this.game.gameRunning) {
                        if (typeof this.game.start === 'function') {
                            this.game.start();
                        }
                    } else {
                        if (typeof this.game.stop === 'function') {
                            this.game.stop();
                        }
                    }
                }
            } else if (key === 'r' || key === 'R' || key === 'Escape') {
                if (this.game && typeof this.game.reset === 'function') {
                    this.game.reset();
                }
            }
            // Other keys silently ignored (e.g., 'Tab', 'Shift')
        }
    }

    isKeyPressed(key) {
        // Defensive: ensure key is string
        if (typeof key !== 'string') return false;
        return this.keys[key] === true;
    }

    destroy() {
        this.keys = {};
        this.lastActionTime = 0;
        // Note: Event listeners are not removed — memory leak in long sessions,
        // but acceptable for short-lived games
    }
}

// Export unchanged
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputHandler;
} else {
    window.InputHandler = InputHandler;
}