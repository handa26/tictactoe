const player1 = player("Player 1");
const player2 = player("Player 2");

const p1Mark = player1.mark("X");
const p2Mark = player2.mark("O");

const p1Name = player1.userName;
const p2Name = player2.userName;

const boardContainer = document.querySelector("#board");
const displayInfo = document.querySelector("#display-info");
const btnReset = document.querySelector("#btn-reset");

// State of the board
const gameBoard = (function () {
  const board = [];
  for (let i = 0; i < 9; i++) {
    board.push({ mark: "", idx: i });
  }

  const winningPatterns = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // Diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  return {
    board,
    winningPatterns,
  };
})();

// Flow of the game
const gameController = (function () {
  const { board, winningPatterns } = gameBoard;
  let turn = 1;

  const checkGame = (playerName, playerMark) => {
    let result = board
      .filter((mark) => mark.mark === playerMark)
      .map((mark) => mark.idx);
  
    // Compare player's marks with winning patterns
    for (let i = 0; i < winningPatterns.length; i++) {
      if (winningPatterns[i].every((idx) => result.includes(idx))) {
        return { isWin: true, winner: playerName };
      }
    }
  
    return { isWin: false, winner: null };
  };

  const playGame = (row) => {
    const playerMark = turn === 1 ? "X" : "O";
    const playerName = turn === 1 ? p1Name : p2Name;

    board.splice(row, 1, { mark: playerMark, idx: row });

    const { isWin, winner } = checkGame(playerName, playerMark);

    if (!isWin) turn = turn === 1 ? 2 : 1;

    return [playerMark, isWin, turn, winner];
  };

  const resetGame = () => {
    gameBoard.board = Array.from({ length: 9 }, (_, index) => ({
      mark: "",
      idx: index,
    }));

    board.splice(0, board.length, ...gameBoard.board);

    turn = 1;
  };

  return {
    playGame,
    turn,
    resetGame,
  };
})();

const screenController = (function () {
  const { playGame, turn } = gameController;

  showGameInfo(displayInfo, turn);

  const renderBoard = (selector, board) => {
    for (let i = 0; i < board.length; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("cell-idx", i);

      selector?.appendChild(cell);
    }
  };

  const updateCells = (selector) => {
    selector.forEach((cell) => {
      const clonedCell = cell.cloneNode(true);
      cell.replaceWith(clonedCell);
  
      clonedCell.addEventListener("click", () => {
        const row = clonedCell.getAttribute("cell-idx");
        const [playerMark, isWin, turn, winner] = gameController.playGame(parseInt(row));
  
        if (clonedCell.innerHTML === "") {
          clonedCell.innerHTML = `<p>${playerMark}</p>`;
        }
  
        showGameInfo(displayInfo, turn);
  
        if (isWin === true) {
          displayInfo.innerHTML = `${winner} winner!!!`;
          btnReset.style.display = "block";
        }
      });
    });
  };

  function resetCells(selector) {
    selector.forEach((cell) => (cell.innerHTML = ""));
  }

  function showGameInfo(selector, playerTurn) {
    return playerTurn === 1
      ? (selector.innerHTML = "X player 1 turn")
      : (selector.innerHTML = "O player 2 turn");
  }

  function disableCells(selector) {
    selector.forEach((cell) => {
      const clonedCell = cell.cloneNode(true);
      cell.replaceWith(clonedCell);
    });
  }

  function resetGame() {
    gameController.resetGame(); // Reset game logic
  
    const cells = document.querySelectorAll(".cell");
    resetCells(cells); // Clear all cell contents
    updateCells(cells); // Add fresh listeners
    showGameInfo(displayInfo, gameController.turn); // Reset display info
  }
  
  return {
    renderBoard,
    updateCells,
    resetGame,
  };
})();

screenController.renderBoard(boardContainer, gameBoard.board);
screenController.updateCells(document.querySelectorAll(".cell"));

btnReset.addEventListener("click", () => {
  screenController.resetGame();
  btnReset.style.display = "none";
});

function player(name) {
  const userName = name;

  function mark(str) {
    return str;
  }

  return { userName, mark };
}
