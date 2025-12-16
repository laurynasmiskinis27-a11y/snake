class Food {
    constructor() {
        this.position = {x: 0, y: 0};
        this.consecutiveFailures = 0;
    }

    generateNewPosition(snakeBody, gridSize) {
        // Normalize inputs defensively
        if (!gridSize || gridSize < 1) gridSize = 20;
        if (!snakeBody || !Array.isArray(snakeBody)) snakeBody = [];

        // Early exit if board is full (edge case handling)
        if (snakeBody.length >= gridSize * gridSize) {
            // Can't place food — preserve current or reset
            if (this.position.x >= 0 && this.position.x < gridSize &&
                this.position.y >= 0 && this.position.y < gridSize) {
                return this.position;
            } else {
                this.position = {x: 0, y: 0};
                return this.position;
            }
        }

        let tries = 0;
        const baseMaxTries = gridSize * gridSize;
        let maxTries = baseMaxTries;

        // Increase attempts if we've had recent failures (adaptive retry)
        if (this.consecutiveFailures > 3) {
            maxTries = Math.min(baseMaxTries * 2, 500);
        }

        while (tries < maxTries) {
            tries++;

            // Add slight jitter to randomness in high-density scenarios
            let x, y;
            if (snakeBody.length > baseMaxTries * 0.8) {
                // Bias toward corners when board is crowded
                const corner = Math.floor(Math.random() * 4);
                switch (corner) {
                    case 0: x = 0; y = 0; break;
                    case 1: x = gridSize - 1; y = 0; break;
                    case 2: x = 0; y = gridSize - 1; break;
                    case 3: x = gridSize - 1; y = gridSize - 1; break;
                    default: x = y = 0;
                }
            } else {
                x = Math.floor(Math.random() * gridSize);
                y = Math.floor(Math.random() * gridSize);
            }

            // Clamp just in case
            x = Math.max(0, Math.min(x, gridSize - 1));
            y = Math.max(0, Math.min(y, gridSize - 1));

            const candidate = {x, y};

            if (this.isValidPosition(candidate, snakeBody, gridSize)) {
                this.position = candidate;
                this.consecutiveFailures = 0;
                return this.position;
            }
        }

        // Fallback logic with layered validation
        let fallbackUsed = false;
        if (this.isValidPosition(this.position, [], gridSize)) {
            // Keep current
            fallbackUsed = true;
        } else {
            // Try origin
            if (this.isValidPosition({x: 0, y: 0}, snakeBody, gridSize)) {
                this.position = {x: 0, y: 0};
                fallbackUsed = true;
            }
        }

        if (!fallbackUsed) {
            // Last resort: place on tail (least disruptive)
            if (snakeBody.length > 0) {
                const tail = snakeBody[snakeBody.length - 1];
                if (tail && typeof tail.x === 'number' && typeof tail.y === 'number') {
                    this.position = {x: tail.x, y: tail.y};
                } else {
                    this.position = {x: 0, y: 0};
                }
            } else {
                this.position = {x: 0, y: 0};
            }
        }

        this.consecutiveFailures++;
        return this.position;
    }

    isValidPosition(pos, snakeBody, gridSize) {
        if (pos.x < 0 || pos.x >= gridSize || pos.y < 0 || pos.y >= gridSize) {
            return false;
        }
        for (let i = 0; i < snakeBody.length; i++) {
            const seg = snakeBody[i];
            if (!seg) continue;
            if (typeof seg.x !== 'number' || typeof seg.y !== 'number') {
                if (typeof console !== 'undefined' && console.warn) {
                    console.warn('Invalid segment:', seg);
                }
                continue;
            }
            if (seg.x === pos.x && seg.y === pos.y) {
                return false;
            }
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