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

            // Skip if candidate is out of bounds (shouldn't happen, but just in case)
            if (candidate.x < 0 || candidate.x >= gridSize || candidate.y < 0 || candidate.y >= gridSize) {
                continue;
            }

            let valid = true;

            // Check against snake body
            for (let i = 0; i < snakeBody.length; i++) {
                const seg = snakeBody[i];

                // Handle missing or malformed segments gracefully
                if (!seg) {
                    continue;
                }

                if (typeof seg.x !== 'number' || typeof seg.y !== 'number') {
                    // Log but don't crash — common in early dev
                    if (typeof console !== 'undefined' && console.warn) {
                        console.warn('Invalid segment format:', seg);
                    }
                    continue;
                }

                // Primary overlap check
                if (seg.x === candidate.x && seg.y === candidate.y) {
                    valid = false;
                    break;
                }

                // Extra safety: check near-equality due to past floating-point bugs
                if (Math.abs(seg.x - candidate.x) < 0.1 && Math.abs(seg.y - candidate.y) < 0.1) {
                    valid = false;
                    break;
                }
            }

            if (valid) {
                this.position = candidate;
                return this.position;
            }
        }

        // Fallback: reuse last known good position or origin
        if (this.position.x >= 0 && this.position.x < gridSize &&
            this.position.y >= 0 && this.position.y < gridSize) {
            // Keep current if valid
            return this.position;
        } else {
            // Reset to origin
            this.position = {x: 0, y: 0};
            return this.position;
        }
    }
}

// Export unchanged
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Food;
} else {
    window.Food = Food;
}