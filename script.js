const player1 = player("Player 1");
const player2 = player("Player 2");

const p1Mark = player1.mark("X");
const p2Mark = player2.mark("O");

const p1Name = player1.userName;
const p2Name = player2.userName;

const boardContainer = document.querySelector("#board");
const displayInfo = document.querySelector("#display-info");

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
    let result = [];
    const marks = board.filter((mark) => {
      if (mark.mark === playerMark) {
        result.push(mark.idx);
      }
    });

    // Compare the mark players to the win pattern
    for (let i = 0; i < winningPatterns.length; i++) {
      if (JSON.stringify(result) === JSON.stringify(winningPatterns[i])) {
        console.log(`${playerName} win!!!`);
        // return true;
        return { isWin: true, winner: playerName };
      }
    }

    return { isWin: false, winner: null };
  };

  const playerTurn = (playerName, playerMark) => {
    let row;

    do {
      row = prompt(`Choose which row for ${playerName}: `);
    } while (
      parseInt(row) < 0 ||
      parseInt(row) > 8 ||
      board[parseInt(row)].mark !== ""
    );

    const index = parseInt(row);
    board.splice(index, 1, { mark: playerMark, idx: index });
  };

  const playGame = (row) => {
    const playerMark = turn === 1 ? "X" : "O";
    const playerName = turn === 1 ? p1Name : p2Name;

    board.splice(row, 1, { mark: playerMark, idx: row });

    const { isWin, winner } = checkGame(playerName, playerMark);

    if (!isWin) turn = turn === 1 ? 2 : 1;

    return [playerMark, isWin, turn, winner];
  };

  return {
    playGame,
    turn,
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
    selector.forEach((cell) =>
      cell.addEventListener("click", () => {
        const row = cell.getAttribute("cell-idx");
        const [playerMark, isWin, turn, winner] = playGame(parseInt(row));
        if (cell.innerHTML === "") {
          cell.innerHTML = `<p>${playerMark}</p>`;
        }

        showGameInfo(displayInfo, turn);

        // if (isWin === true) {
        //   resetCells(selector);
        // }

        if (isWin === true) {
          displayInfo.innerHTML = `${winner} winner!!!`;
          disableCells(selector);
        }
      })
    );
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
    console.log("disableCells run");
    selector.forEach((cell) => {
      const clonedCell = cell.cloneNode(true);
      cell.replaceWith(clonedCell);
    });
  }

  return {
    renderBoard,
    updateCells,
  };
})();

screenController.renderBoard(boardContainer, gameBoard.board);
screenController.updateCells(document.querySelectorAll(".cell"));

function player(name) {
  const userName = name;

  function mark(str) {
    return str;
  }

  return { userName, mark };
}
