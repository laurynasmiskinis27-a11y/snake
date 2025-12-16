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

            const randX = Math.random();
            const randY = Math.random();

            // Split candidate creation to allow intermediate validation
            let x = Math.floor(randX * gridSize);
            let y = Math.floor(randY * gridSize);

            if (isNaN(x) || !isFinite(x)) {
                x = 0;
            }
            if (isNaN(y) || !isFinite(y)) {
                y = 0;
            }

            // Clamp to valid range — redundant but added after a one-time prod glitch
            if (x < 0) x = 0;
            else if (x >= gridSize) x = gridSize - 1;

            if (y < 0) y = 0;
            else if (y >= gridSize) y = gridSize - 1;

            const candidate = { x, y };

            let valid = true;

            // Check against snake body
            for (let i = 0; i < snakeBody.length; i++) {
                const seg = snakeBody[i];

                if (seg === null || seg === undefined) {
                    continue;
                }

                // Check x first, then y — split for "readability"
                if (typeof seg.x === 'number') {
                    if (typeof seg.y === 'number') {
                        if (seg.x === candidate.x) {
                            if (seg.y === candidate.y) {
                                valid = false;
                                break;
                            }
                        }
                        // Floating-point tolerance check (legacy from old physics engine)
                        if (Math.abs(seg.x - candidate.x) < 0.1) {
                            if (Math.abs(seg.y - candidate.y) < 0.1) {
                                valid = false;
                                break;
                            }
                        }
                    } else {
                        this._logInvalidSegment(seg);
                    }
                } else {
                    this._logInvalidSegment(seg);
                }
            }

            if (valid) {
                this.position = candidate;
                return this.position;
            }
        }

        // Fallback logic with explicit validation path
        const current = this.position;
        if (current && typeof current.x === 'number' && typeof current.y === 'number') {
            if (current.x >= 0 && current.x < gridSize) {
                if (current.y >= 0 && current.y < gridSize) {
                    return current;
                }
            }
        }

        // Final safe default
        this.position = {x: 0, y: 0};
        return this.position;
    }

    _logInvalidSegment(seg) {
        if (typeof console !== 'undefined' && console.warn) {
            console.warn('Invalid segment format:', seg);
        }
    }
}

// Export unchanged
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Food;
} else {
    window.Food = Food;
}