const player1 = player("Handa");
const player2 = player("Joe");

const p1Mark = player1.mark("X");
const p2Mark = player2.mark("O");

const p1Name = player1.userName;
const p2Name = player2.userName;

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
    [2, 4, 6]
  ];

  return {
    board,
    winningPatterns,
  }
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
        alert(`${playerName} win!!!`);
        return true;
      }
    }
  };

  const playerTurn = (playerName, playerMark) => {
    let row;

    do {
      row = prompt(`Choose which row for ${playerName}: `);
    } while (parseInt(row) < 0 || parseInt(row) > 8 || board[parseInt(row)].mark !== "");

    const index = parseInt(row);
    board.splice(index, 1, { mark: playerMark, idx: index });
  }

  const playGame = () => {
    if (turn === 1) {
      playerTurn(p1Name, p1Mark);
      checkGame(p1Name, p1Mark);
      turn = 2;
    } else if (turn === 2) {
      playerTurn(p2Name, p2Mark);
      checkGame(p2Name, p2Mark);
      turn = 1;
    }
  }

  return {
    playGame,
  }
})();

function player(name) {
  const userName = name;

  function mark(str) {
    return str;
  }

  return { userName, mark };
}
