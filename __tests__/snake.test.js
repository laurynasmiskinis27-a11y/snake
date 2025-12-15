const { Snake, Food, Game } = require('../snake.js');

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

describe('Game Class', () => {
    let game;
    let mockCanvas;
    let mockCtx;

    beforeEach(() => {
        mockCanvas = {
            width: 400,
            height: 400,
            getContext: jest.fn(() => ({
                fillStyle: '',
                strokeStyle: '',
                fillRect: jest.fn(),
                strokeRect: jest.fn()
            }))
        };
        
        document.getElementById = jest.fn(() => mockCanvas);
        
        game = new Game('gameCanvas');
    });

    test('should initialize with correct properties', () => {
        expect(game.gridSize).toBe(20);
        expect(game.cellSize).toBe(20);
        expect(game.score).toBe(0);
        expect(game.gameRunning).toBe(false);
        expect(game.snake).toBeDefined();
        expect(game.food).toBeDefined();
    });

    test('should update score when snake eats food', () => {
        game.food.position = {x: 11, y: 10}; 
        
        const initialScore = game.score;
        
        game.frameCount = 0;
        
        game.update(); 
        
        expect(game.score).toBe(initialScore + 1);
    });

    test('should end game on collision', () => {
        game.snake.body = [{x: -1, y: -1}];
        
        const originalGameOver = game.gameOver;
        game.gameOver = jest.fn();
        
        game.frameCount = 0;
        
        game.update();
        
        expect(game.gameOver).toHaveBeenCalled();
        
        game.gameOver = originalGameOver;
    });
});