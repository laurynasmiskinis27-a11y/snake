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

// Export for Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Food;
} else {
    window.Food = Food;
}