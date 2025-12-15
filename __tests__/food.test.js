const Food = require('../food');

describe('Food Class', () => {
    let food;

    beforeEach(() => {
        food = new Food();
    });

    test('should initialize with default position', () => {
        expect(food.position).toEqual({x: 0, y: 0});
    });

    test('should generate new position not on snake', () => {
        const snakeBody = [
            {x: 5, y: 5},
            {x: 5, y: 6},
            {x: 5, y: 7}
        ];
        
        const newPosition = food.generateNewPosition(snakeBody, 10);
        
        for (const segment of snakeBody) {
            expect(newPosition).not.toEqual(segment);
        }
        
        expect(newPosition.x).toBeGreaterThanOrEqual(0);
        expect(newPosition.x).toBeLessThan(10);
        expect(newPosition.y).toBeGreaterThanOrEqual(0);
        expect(newPosition.y).toBeLessThan(10);
    });
});