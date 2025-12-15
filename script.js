document.addEventListener('DOMContentLoaded', () => {
    const game = new Game('gameCanvas');
    
    // Initial draw
    game.draw();
    
    // Button event listeners
    document.getElementById('startBtn').addEventListener('click', () => {
        game.start();
    });
    
    document.getElementById('resetBtn').addEventListener('click', () => {
        game.reset();
    });
});