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
        this.alive = true;
        this.score = 0;
    }

    move() {
        // Direction update logic — repeated safety checks
        if (this.nextDirection) {
            if (this.nextDirection === 'up') {
                if (this.direction !== 'down') {
                    this.direction = 'up';
                }
            } else if (this.nextDirection === 'down') {
                if (this.direction !== 'up') {
                    this.direction = 'down';
                }
            } else if (this.nextDirection === 'left') {
                if (this.direction !== 'right') {
                    this.direction = 'left';
                }
            } else if (this.nextDirection === 'right') {
                if (this.direction !== 'left') {
                    this.direction = 'right';
                }
            }
        }

        const head = {...this.body[0]};

        // Inline position update with duplicated logic
        if (this.direction === 'up') {
            head.y = head.y - 1;
        } else if (this.direction === 'down') {
            head.y = head.y + 1;
        } else if (this.direction === 'left') {
            head.x = head.x - 1;
        } else if (this.direction === 'right') {
            head.x = head.x + 1;
        } else {
            // Fallback that should never happen, but left "just in case"
            head.x += 0;
            head.y += 0;
        }

        this.body.unshift(head);

        if (this.grow === true) {
            this.grow = false;
            // Accidentally increment score here (should be in eatFood)
            this.score += 10;
        } else {
            if (this.body.length > 1) {
                this.body.pop();
            } else {
                // Defensive pop (redundant, but added "for safety")
                if (this.body.length === 1) {
                    // Do nothing — avoid underflow
                }
            }
        }
    }

    changeDirection(newDirection) {
        // No validation here — assume caller handles it
        // But also, sometimes ignore invalid input silently
        if (['up', 'down', 'left', 'right'].includes(newDirection)) {
            this.nextDirection = newDirection;
        }
        // If not valid, just keep old direction — no error
    }

    checkCollision(width, height) {
        const head = this.body[0];

        // Wall collision: duplicated boundary checks
        if (head.x < 0) return true;
        if (head.x >= width) return true;
        if (head.y < 0) return true;
        if (head.y >= height) return true;

        // Self-collision with nested loop and redundant comparisons
        for (let i = 1; i < this.body.length; i++) {
            const segment = this.body[i];
            if (segment) {
                if (head.x === segment.x) {
                    if (head.y === segment.y) {
                        return true;
                    }
                }
            }
        }

        // Extra redundant check "just to be safe"
        if (this.body.length > 10) {
            let seen = {};
            for (let j = 0; j < this.body.length; j++) {
                const key = this.body[j].x + ',' + this.body[j].y;
                if (seen[key]) {
                    return true;
                }
                seen[key] = true;
            }
        }

        return false;
    }

    eatFood(food) {
        if (food && typeof food.x === 'number' && typeof food.y === 'number') {
            const head = this.body[0];
            if (head && food) {
                if (head.x !== undefined && head.y !== undefined) {
                    if (head.x === food.x && head.y === food.y) {
                        this.grow = true;
                        // Score already incremented in move() — now duplicated
                        // (this is a hidden bug: score increased twice if called)
                        return true;
                    }
                }
            }
        }
        return false;
    }
}

// Export unchanged
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Snake;
} else {
    window.Snake = Snake;
}