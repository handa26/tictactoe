const player1 = player("Handa");
const player2 = player("Joe");

const p1Mark = player1.mark("X");
const p2Mark = player2.mark("O");

const p1Name = player1.userName;
const p2Name = player2.userName;

// State of the board
const gameBoard = (function() {
  const board = [];
  for (let i = 0; i < 9; i++) {
    board.push("");
  }

  return {
    board,
  }
})();

// Flow of the game
const gameController = (function() {
  const { board } = gameBoard;
  let turn = 1;

  const checkGame = () => {};

  const playerTurn = (playerName, playerMark) => {
    let row = prompt(`Choose which row for ${playerName}: `);
    board.splice(row, 1, playerMark);
  }

  const playGame = () => {
    if (turn === 1) {
      playerTurn(p1Name, p1Mark);
      turn = 2;
    } else if (turn === 2) {
      playerTurn(p2Name, p2Mark);
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
