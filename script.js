class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scores = {
            X: 0,
            O: 0
        };
        
        this.initializeGame();
    }

    initializeGame() {
        this.cells = document.querySelectorAll('.cell');
        this.gameStatus = document.getElementById('game-status');
        this.currentPlayerText = document.getElementById('current-player-text');
        this.scoreX = document.getElementById('score-x');
        this.scoreO = document.getElementById('score-o');
        this.resetBtn = document.getElementById('reset-btn');
        this.resetScoresBtn = document.getElementById('reset-scores-btn');
        this.playerX = document.querySelector('.player-x');
        this.playerO = document.querySelector('.player-o');

        this.addEventListeners();
        this.updateDisplay();
    }

    addEventListeners() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });

        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.resetScoresBtn.addEventListener('click', () => this.resetScores());
    }

    handleCellClick(e) {
        const cell = e.target;
        const cellIndex = parseInt(cell.getAttribute('data-cell-index'));

        if (this.board[cellIndex] !== '' || !this.gameActive) {
            return;
        }

        this.makeMove(cellIndex);
    }

    makeMove(cellIndex) {
        this.board[cellIndex] = this.currentPlayer;
        this.cells[cellIndex].textContent = this.currentPlayer;
        this.cells[cellIndex].classList.add(this.currentPlayer.toLowerCase());

        if (this.checkWin()) {
            this.handleWin();
        } else if (this.checkDraw()) {
            this.handleDraw();
        } else {
            this.switchPlayer();
        }
    }

    checkWin() {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        return winConditions.some(condition => {
            const [a, b, c] = condition;
            return this.board[a] && 
                   this.board[a] === this.board[b] && 
                   this.board[a] === this.board[c];
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    handleWin() {
        this.gameActive = false;
        this.scores[this.currentPlayer]++;
        this.updateScores();
        
        this.gameStatus.textContent = `Player ${this.currentPlayer} wins!`;
        this.gameStatus.classList.add('win');
        
        this.highlightWinningCells();
        
        setTimeout(() => {
            this.resetGame();
        }, 2000);
    }

    handleDraw() {
        this.gameActive = false;
        
        this.gameStatus.textContent = "It's a draw!";
        this.gameStatus.classList.add('draw');
        
        setTimeout(() => {
            this.resetGame();
        }, 2000);
    }

    highlightWinningCells() {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        const winningCondition = winConditions.find(condition => {
            const [a, b, c] = condition;
            return this.board[a] && 
                   this.board[a] === this.board[b] && 
                   this.board[a] === this.board[c];
        });

        if (winningCondition) {
            winningCondition.forEach(index => {
                this.cells[index].classList.add('winning');
            });
        }
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateDisplay();
    }

    updateDisplay() {
        this.currentPlayerText.textContent = `Player ${this.currentPlayer}'s turn`;
        
        // Update active player indicator
        if (this.currentPlayer === 'X') {
            this.playerX.classList.add('active');
            this.playerO.classList.remove('active');
        } else {
            this.playerO.classList.add('active');
            this.playerX.classList.remove('active');
        }
    }

    updateScores() {
        this.scoreX.textContent = this.scores.X;
        this.scoreO.textContent = this.scores.O;
    }

    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning');
        });
        
        this.gameStatus.textContent = '';
        this.gameStatus.classList.remove('win', 'draw');
        
        this.updateDisplay();
    }

    resetScores() {
        this.scores = { X: 0, O: 0 };
        this.updateScores();
        this.resetGame();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});

// Add some fun keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        document.getElementById('reset-btn').click();
    }
    if (e.key === 's' || e.key === 'S') {
        document.getElementById('reset-scores-btn').click();
    }
}); 