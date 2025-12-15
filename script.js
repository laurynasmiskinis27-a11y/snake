document.addEventListener('DOMContentLoaded', () => {
    const game = new Game('gameCanvas');
    
    // Initial draw
    game.draw();
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (!game.gameRunning) return;
        
        switch(e.key) {
            case 'ArrowUp':
                game.snake.changeDirection('up');
                break;
            case 'ArrowDown':
                game.snake.changeDirection('down');
                break;
            case 'ArrowLeft':
                game.snake.changeDirection('left');
                break;
            case 'ArrowRight':
                game.snake.changeDirection('right');
                break;
        }
    });
    
    // Button event listeners
    document.getElementById('startBtn').addEventListener('click', () => {
        game.start();
    });
    
    document.getElementById('resetBtn').addEventListener('click', () => {
        game.reset();
    });
});