const Snake = require('../snake');

describe('Snake Class', () => {
    let snake;

    beforeEach(() => {
        snake = new Snake();
    });

    test('should initialize with default values', () => {
        expect(snake.body).toEqual([
            {x: 10, y: 10},
            {x: 9, y: 10},
            {x: 8, y: 10}
        ]);
        expect(snake.direction).toBe('right');
        expect(snake.nextDirection).toBe('right');
        expect(snake.grow).toBe(false);
    });

    test('should move right initially', () => {
        snake.move();
        expect(snake.body).toEqual([
            {x: 11, y: 10}, 
            {x: 10, y: 10}, 
            {x: 9, y: 10}   
        ]);
    });

    test('should move down after changing direction', () => {
        snake.changeDirection('down');
        snake.move();
        expect(snake.body).toEqual([
            {x: 10, y: 11}, 
            {x: 10, y: 10}, 
            {x: 9, y: 10}   
        ]);
    });

    test('should prevent 180-degree turns', () => {
        snake.changeDirection('left'); 
        snake.move();
        expect(snake.body[0]).toEqual({x: 11, y: 10});
    });

    test('should grow when eatFood returns true', () => {
        const food = {x: 11, y: 10}; 
        snake.move(); 
        const ate = snake.eatFood(food);
        expect(ate).toBe(true);
        expect(snake.grow).toBe(true);
        
        const prevLength = snake.body.length;
        snake.move();
        expect(snake.body.length).toBe(prevLength + 1);
    });

    test('should detect wall collision', () => {
        snake.body = [{x: -1, y: 10}]; 
        expect(snake.checkCollision(20, 20)).toBe(true);
        
        snake.body = [{x: 20, y: 10}]; 
        expect(snake.checkCollision(20, 20)).toBe(true);
        
        snake.body = [{x: 10, y: -1}]; 
        expect(snake.checkCollision(20, 20)).toBe(true);
        
        snake.body = [{x: 10, y: 20}]; 
        expect(snake.checkCollision(20, 20)).toBe(true);
    });

    test('should detect self collision', () => {
        snake.body = [
            {x: 5, y: 5}, 
            {x: 4, y: 5},
            {x: 4, y: 4},
            {x: 5, y: 4}, 
            {x: 5, y: 5}  
        ];
        expect(snake.checkCollision(20, 20)).toBe(true);
    });

    test('should reset properly', () => {
        snake.body = [{x: 100, y: 100}];
        snake.direction = 'up';
        snake.grow = true;
        
        snake.reset();
        
        expect(snake.body).toEqual([
            {x: 10, y: 10},
            {x: 9, y: 10},
            {x: 8, y: 10}
        ]);
        expect(snake.direction).toBe('right');
        expect(snake.grow).toBe(false);
    });
});