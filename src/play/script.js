const gameElement = document.getElementById('game');
const scoreElement = document.getElementById('score');

let player1Score = 0;
let player2Score = 0;

const playerOneColor = localStorage.getItem('playerOneColor');
const playerTwoColor = localStorage.getItem('playerTwoColor');

if (!playerOneColor || !playerTwoColor) {
    window.location.href = '../';
}

const gameMatrix = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

// Create the game board with 3x3 grid
const boardElements = [];
for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    boardElements.push(cell);
    gameElement.appendChild(cell);
}

let currentPlayer = '✘';

boardElements.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (cell.textContent === '') {
            cell.textContent = currentPlayer;
            cell.style.color = currentPlayer === '✘' ? playerOneColor : playerTwoColor;
            currentPlayer = currentPlayer === '✘' ? '✔' : '✘';
            cell.classList.add('clicked');
            setTimeout(() => {
                cell.classList.remove('clicked');
            }, 200);

            const row = Math.floor(index / 3);
            const col = index % 3;
            gameMatrix[row][col] = cell.textContent === '✘' ? 1 : -1;
        }
        checkWon();
    });
});

function checkWon() {
    // Sum rows, columns, and diagonals
    for (let i = 0; i < 3; i++) {
        const rowSum = gameMatrix[i][0] + gameMatrix[i][1] + gameMatrix[i][2];
        const colSum = gameMatrix[0][i] + gameMatrix[1][i] + gameMatrix[2][i];

        if (rowSum === 3 || colSum === 3) {
            winPlayer(1);
            resetGame();
            return;
        } else if (rowSum === -3 || colSum === -3) {
            winPlayer(2);
            resetGame();
            return;
        }
    }

    const diag1Sum = gameMatrix[0][0] + gameMatrix[1][1] + gameMatrix[2][2];
    const diag2Sum = gameMatrix[0][2] + gameMatrix[1][1] + gameMatrix[2][0];

    if (diag1Sum === 3 || diag2Sum === 3) {
        winPlayer(1);
        return;
    } else if (diag1Sum === -3 || diag2Sum === -3) {
        winPlayer(2);
        return;
    }

    // Check for draw
    if (boardElements.every(cell => cell.textContent !== '')) { // every cell filled
        winPlayer(null);
    }
}

function winPlayer(player) {
    gameElement.innerHTML = '';
    const message = document.createElement('div');
    message.classList.add('win-message');

    if (player === 1) {
        message.textContent = 'Player 1 Wins! ✘';
        message.style.color = playerOneColor;
        player1Score++;
    } else if (player === 2) {
        message.textContent = 'Player 2 Wins! ✔';
        message.style.color = playerTwoColor;
        player2Score++;
    } else {
        message.textContent = "It's a Draw!";
        message.style.color = '#888';
    }
    

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Play Again';
    resetButton.classList.add('reset-button');
    resetButton.addEventListener('click', () => {
        location.reload();
    });
    message.appendChild(resetButton);
    gameElement.appendChild(message);

    scoreElement.innerHTML = `<span style="color: ${playerOneColor}">Player 1: ${player1Score}</span><span style="color: ${playerTwoColor}">Player 2: ${player2Score}</span>`;
}