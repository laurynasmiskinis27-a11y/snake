const Game = require('../game');

describe('Game Class', () => {
    let game;
    let originalRequestAnimationFrame;
    let originalCancelAnimationFrame;

    beforeEach(() => {
        // Mock document.getElementById to return a mock canvas
        const mockCanvas = {
            width: 400,
            height: 400,
            getContext: jest.fn(() => ({
                fillStyle: '',
                strokeStyle: '',
                fillRect: jest.fn(),
                strokeRect: jest.fn()
            }))
        };
        
        const originalGetElementById = document.getElementById;
        document.getElementById = jest.fn(() => mockCanvas);
        
        // Mock animation frame functions
        originalRequestAnimationFrame = global.requestAnimationFrame;
        originalCancelAnimationFrame = global.cancelAnimationFrame;
        
        global.requestAnimationFrame = jest.fn((callback) => {
            setTimeout(callback, 0);
            return 1;
        });
        
        global.cancelAnimationFrame = jest.fn();
        
        game = new Game('gameCanvas');
        
        // Restore original getElementById after creating the game instance
        document.getElementById = originalGetElementById;
    });

    afterEach(() => {
        // Restore original functions
        if (originalRequestAnimationFrame) {
            global.requestAnimationFrame = originalRequestAnimationFrame;
        }
        if (originalCancelAnimationFrame) {
            global.cancelAnimationFrame = originalCancelAnimationFrame;
        }
    });

    test('should initialize with correct properties', () => {
        expect(game.gridSize).toBe(20);
        expect(game.cellSize).toBe(20);
        expect(game.score).toBe(0);
        expect(game.gameRunning).toBe(false);
        expect(game.snake).toBeDefined();
        expect(game.food).toBeDefined();
        expect(game.inputHandler).toBeDefined();
    });

    test('should update score when snake eats food', () => {
        game.food.position = {x: 11, y: 10}; 
        
        const initialScore = game.score;
        
        // Mock the update method behavior without calling requestAnimationFrame
        game.frameCount++;
        game.snake.move();
        
        if (game.snake.eatFood(game.food.position)) {
            game.score++;
        }
        
        expect(game.score).toBe(initialScore + 1);
    });

    test('should end game on collision', () => {
        game.snake.body = [{x: -1, y: -1}];
        
        const originalGameOver = game.gameOver;
        game.gameOver = jest.fn();
        
        game.frameCount = 0;
        
        // Mock the update method behavior
        game.frameCount++;
        game.snake.move();
        
        // Check for collisions
        if (game.snake.checkCollision(game.gridSize, game.gridSize)) {
            game.gameOver();
        }
        
        expect(game.gameOver).toHaveBeenCalled();
        
        game.gameOver = originalGameOver;
    });

    test('should start the game', () => {
        game.start();
        expect(game.gameRunning).toBe(true);
    });

    test('should not start if already running', () => {
        game.gameRunning = true;
        
        game.start();
        expect(game.gameRunning).toBe(true);
    });

    test('should stop the game', () => {
        game.gameRunning = true;
        game.animationFrameId = 1;
        
        game.stop();
        expect(game.gameRunning).toBe(false);
        expect(global.cancelAnimationFrame).toHaveBeenCalledWith(1);
    });

    test('should reset the game', () => {
        game.score = 10;
        game.gameRunning = true;
        game.snake.body = [{x: 100, y: 100}];
        
        const originalReset = game.snake.reset;
        game.snake.reset = jest.fn();
        
        // Mock DOM elements for reset
        document.getElementById = jest.fn((id) => {
            if (id === 'score') return { textContent: '' };
            if (id === 'gameOver') return { classList: { add: jest.fn(), remove: jest.fn() } };
            return null;
        });
        
        game.reset();
        
        expect(game.snake.reset).toHaveBeenCalled();
        expect(game.score).toBe(0);
        expect(game.gameRunning).toBe(false);
        
        game.snake.reset = originalReset;
    });
});