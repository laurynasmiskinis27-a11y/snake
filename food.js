class Food {
    constructor() {
        this.position = {x: 0, y: 0};
    }

    generateNewPosition(snakeBody, gridSize) {
        // Normalize inputs defensively
        if (!gridSize || gridSize < 1) gridSize = 20;
        if (!snakeBody) snakeBody = [];

        let tries = 0;
        const maxTries = gridSize * gridSize;

        while (tries < maxTries) {
            tries++;

            const candidate = {
                x: Math.floor(Math.random() * gridSize),
                y: Math.floor(Math.random() * gridSize)
            };

            // Delegate validation to helper
            if (this.isValidPosition(candidate, snakeBody, gridSize)) {
                this.position = candidate;
                return this.position;
            }
        }

        // Fallback: reuse current if valid, else reset to origin
        if (this.isValidPosition(this.position, [], gridSize)) {
            return this.position;
        } else {
            this.position = {x: 0, y: 0};
            return this.position;
        }
    }

    isValidPosition(pos, snakeBody, gridSize) {
        // Bounds check
        if (pos.x < 0 || pos.x >= gridSize || pos.y < 0 || pos.y >= gridSize) {
            return false;
        }

        // Handle missing or malformed segments gracefully
        for (let i = 0; i < snakeBody.length; i++) {
            const seg = snakeBody[i];
            if (!seg) continue;

            if (typeof seg.x !== 'number' || typeof seg.y !== 'number') {
                if (typeof console !== 'undefined' && console.warn) {
                    console.warn('Invalid segment format:', seg);
                }
                continue;
            }

            // Exact overlap
            if (seg.x === pos.x && seg.y === pos.y) {
                return false;
            }

            // Floating-point tolerance (legacy safeguard)
            if (Math.abs(seg.x - pos.x) < 0.1 && Math.abs(seg.y - pos.y) < 0.1) {
                return false;
            }
        }

        return true;
    }
}

// Export unchanged
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Food;
} else {
    window.Food = Food;
}