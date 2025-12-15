const InputHandler = require('../inputHandler');
const Snake = require('../snake');

// Mock Game class for testing
class MockGame {
    constructor() {
        this.snake = new Snake();
        this.gameRunning = false;
    }
    start() {
        this.gameRunning = true;
    }
    stop() {
        this.gameRunning = false;
    }
    reset() {}
}

describe('InputHandler Class', () => {
    let game;
    let inputHandler;

    beforeEach(() => {
        game = new MockGame();
        inputHandler = new InputHandler(game);
    });

    test('should initialize with game reference', () => {
        expect(inputHandler.game).toBe(game);
        expect(inputHandler.keys).toEqual({});
    });

    test('should handle arrow key presses for direction changes', () => {
        inputHandler.handleKeyPress('ArrowUp');
        expect(game.snake.nextDirection).toBe('up');
        
        inputHandler.handleKeyPress('ArrowDown');
        expect(game.snake.nextDirection).toBe('down');
        
        inputHandler.handleKeyPress('ArrowLeft');
        expect(game.snake.nextDirection).toBe('left');
        
        inputHandler.handleKeyPress('ArrowRight');
        expect(game.snake.nextDirection).toBe('right');
    });

    test('should handle WASD key presses for direction changes', () => {
        inputHandler.handleKeyPress('w');
        expect(game.snake.nextDirection).toBe('up');
        
        inputHandler.handleKeyPress('s');
        expect(game.snake.nextDirection).toBe('down');
        
        inputHandler.handleKeyPress('a');
        expect(game.snake.nextDirection).toBe('left');
        
        inputHandler.handleKeyPress('d');
        expect(game.snake.nextDirection).toBe('right');
        
        // Test uppercase as well
        inputHandler.handleKeyPress('W');
        expect(game.snake.nextDirection).toBe('up');
        
        inputHandler.handleKeyPress('S');
        expect(game.snake.nextDirection).toBe('down');
        
        inputHandler.handleKeyPress('A');
        expect(game.snake.nextDirection).toBe('left');
        
        inputHandler.handleKeyPress('D');
        expect(game.snake.nextDirection).toBe('right');
    });

    test('should handle spacebar to start/stop game', () => {
        game.gameRunning = false;
        inputHandler.handleKeyPress(' ');
        expect(game.gameRunning).toBe(true);
        
        game.gameRunning = true;
        inputHandler.handleKeyPress(' ');
        expect(game.gameRunning).toBe(false);
    });

    test('should handle R key to reset game', () => {
        const resetSpy = jest.spyOn(game, 'reset');
        inputHandler.handleKeyPress('r');
        expect(resetSpy).toHaveBeenCalled();
        
        resetSpy.mockRestore();
    });

    test('should check if key is pressed', () => {
        inputHandler.keys['ArrowUp'] = true;
        expect(inputHandler.isKeyPressed('ArrowUp')).toBe(true);
        
        inputHandler.keys['ArrowUp'] = false;
        expect(inputHandler.isKeyPressed('ArrowUp')).toBe(false);
        
        expect(inputHandler.isKeyPressed('NonExistentKey')).toBe(false);
    });
});