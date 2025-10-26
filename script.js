function Gameboard() {
    const rows = 3;
    const cols = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const setPosition = (i, j, symbol) => {
        const cell = board[i][j];
        if (cell.getValue() == null) {
            cell.addSymbol(symbol);
            return true;
        } 
    }

    const resetBoard = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < cols; j++) {
                board[i][j] = Cell();
            }
        }
    }

    const checkWinner = () => {
        const b = board.map(row => row.map(cell => cell.getValue()));
        
        //check rows
        for(let i = 0; i < 3; i++) {
            if(b[i][0] && b[i][0] === b[i][1] && b[i][1] === b[i][2]) return b[i][0];
        }

        //check columns
        for(let j = 0; j < 3; j++) {
            if(b[0][j] && b[0][j] === b[1][j] && b[1][j] === b[2][j]) return b[0][j];
        }

        // Check diagonals
        if (b[0][0] && b[0][0] === b[1][1] && b[1][1] === b[2][2]) return b[0][0];
        if (b[0][2] && b[0][2] === b[1][1] && b[1][1] === b[2][0]) return b[0][2];

        if(b.flat().every(cell => cell !== null)) return "Draw";

       return null;

    };

    return {getBoard, setPosition, resetBoard, checkWinner};
}

function Cell() {
    let value = null;

    const addSymbol = (symbol) => {
        value = symbol;
    };

    const getValue = () => value;

    return {
        addSymbol,
        getValue
    };
}

function GameController (
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            symbol: 'X'
        },
        {
            name: playerTwoName,
            symbol: 'O'
        }
    ];

    let activePlayer = players[0];
    let gameOver = false;
    
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        if(!gameOver) showMessage(`${getActivePlayer().name}'s turn`);
    };

    const playRound = (row, column) => {
        if(gameOver) {
            showMessage("Game over.Please restart");
            return;
        }
        showMessage(`${getActivePlayer().name}'s  ${getActivePlayer().symbol} into cell row:- ${row}, colomn:- ${column}`);
    
        const success = board.setPosition(row, column, getActivePlayer().symbol);
        if(!success) return;

        const result = board.checkWinner();

        if(result === "Draw") {
            showMessage("It's a draw! Press Restart to play again.");;
            gameOver = true;
        } else if(result) {
            showMessage(`${getActivePlayer().name} (${result}) wins! Press Restart to play again.`);
            gameOver = true;
        } else {
            switchPlayerTurn();
            showMessage(`${getActivePlayer().name}'s turn`);
        }


        return true;
        
    };

    const resetGame = () => {
        board.resetBoard();
        document.querySelectorAll('.board div').forEach(cell => cell.textContent = "");// clear UI
        activePlayer = players[0];
        gameOver = false;
        showMessage("Game reset.");

        printNewRound();
    }

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        resetGame
    };
}


let game;

const container = document.createElement("div");
container.classList.add("player-name-container");

// Player One input
const playerOneInput = document.createElement("input");
playerOneInput.type = "text";
playerOneInput.placeholder = "Player One Name";
playerOneInput.disabled = true;


// Player Two input
const playerTwoInput = document.createElement("input");
playerTwoInput.type = "text";
playerTwoInput.placeholder = "Player Two Name";
playerTwoInput.disabled = true;

const playButton = document.createElement("button");
playButton.textContent = "Play";
playButton.disabled = true;


container.appendChild(playerOneInput);
container.appendChild(playerTwoInput);
container.appendChild(playButton);

document.body.appendChild(container);


const statusDisplay = document.createElement('div');
statusDisplay.id = 'status';
document.body.appendChild(statusDisplay);



function showMessage(msg) {
    statusDisplay.textContent = msg;
}


const boardElement = document.querySelector('.board');
boardElement.style.pointerEvents = 'none';
boardElement.style.opacity = '0.5';



const restart = document.querySelector('.restart');
restart.addEventListener('click', () => {
    playerOneInput.disabled = false;
    playerTwoInput.disabled = false;
    playButton.disabled = false;

    document.querySelectorAll('.player-name-container input').forEach(player => player.value ="")

    boardElement.style.pointerEvents = 'none';
    boardElement.style.opacity = '0.5';

    showMessage("Enter player names and press Play to start!")
});


playButton.addEventListener('click', () => {
    const playerOneName = playerOneInput.value || "Player One";
    const playerTwoName = playerTwoInput.value || "Player Two";

    game = GameController(playerOneName, playerTwoName);
    game.resetGame();


    playerOneInput.disabled = true;
    playerTwoInput.disabled = true;
    playButton.disabled = true;

    boardElement.style.pointerEvents ='auto';
    boardElement.style.opacity = '1';
})

const userInput = () => {
    const board = document.querySelector('.board');

   
    board.addEventListener('click', e => {
        if(e.target.className.startsWith('b')) {
            const cls = e.target.className;
            const row = parseInt(cls[1]);
            const col = parseInt(cls[2]);

            const cellValue = e.target.textContent.trim();
            if(cellValue) {
                showMessage("Can't put here");
                return;
            }
            
            const currentSymbol = game.getActivePlayer().symbol;

            const success = game.playRound(row, col); // Update game state
            if (success) {
                e.target.textContent = currentSymbol; // Update UI
            }
        }
    });
}

showMessage("Press Start button to play the game!");
userInput();

