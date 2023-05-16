// controls the state of the game
const gameController = (function () {
  // player 1 is -1 and player 2 is 2 for each for checking winner
  let playerTurn = 1;

  function checkWinner() {
    const board = boardController.getBoardState();

    for (let i = 0; i < 3; i += 1) {
      // check horizontal
      if (Math.abs(board[i][0] + board[i][1] + board[i][2]) === 3) {
        return board[i][0];
      }

      // check vertically
      if (Math.abs(board[0][i] + board[1][i] + board[2][i]) === 3) {
        return board[0][i];
      }
    }

    // check diagonals
    if (Math.abs(board[0][0] + board[1][1] + board[2][2]) === 3) {
      return board[0][0]; // return the winner (-1 or 2)
    }

    if (Math.abs(board[0][2] + board[1][1] + board[2][0]) === 3) {
      return board[0][2]; // return the winner (-1 or 2)
    }

    return 0;
  }

  function makeMove() {
    playerTurn = playerTurn === 1 ? -1 : 1;

    // 1 for player 1, -1 for player 2, 0 for no winner
    const winner = checkWinner();
    if (winner !== 0) {
      UIController.announceWinner(winner);
    }
  }

  function getPlayerTurn() {
    return playerTurn;
  }

  // public methods
  return { makeMove, getPlayerTurn };
})();

// controls the state of the board and display
const boardController = (() => {
  const playerOne = {
    symbol: "X",
    color: "rgb(44, 145, 170)",
  };

  const playerTwo = {
    symbol: "O",
    color: "rgb(43, 194, 232)",
  };

  const board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  function getBoardState() {
    const currentboard = board;
    return currentboard;
  }

  function setBoardState(row, column) {
    board[row][column] = gameController.getPlayerTurn();
  }

  function makeMove(boardSquareElement) {
    //calculate row and column
    const boardSquareLocation = parseInt(boardSquareElement.dataset.id, 10);
    const row = Math.floor((boardSquareLocation - 1) / 3);
    const column = (boardSquareLocation - 1) % 3;

    // if spot is empty
    if (board[row][column] === 0) {
      boardSquareElement.style.backgroundColor =
        gameController.getPlayerTurn() === 1
          ? playerOne.color
          : playerTwo.color;
      boardSquareElement.textContent =
        gameController.getPlayerTurn() === 1
          ? playerOne.symbol
          : playerTwo.symbol;
      setBoardState(row, column);
      gameController.makeMove();
    }
  }

  function init() {
    const boardSquares = document.querySelectorAll(".board-square");
    boardSquares.forEach((boardSquare) => {
      boardSquare.addEventListener("click", () => {
        //send data to game object
        makeMove(boardSquare);
      });
    });
  }

  // public methods
  return { init, getBoardState };
})();

// controls the state of the user interface
const UIController = (() => {
  const newGameButton = document.getElementById("new-game-button");
  const playerVsPlayerButton = document.getElementById("player");
  const playerVsBotButton = document.getElementById("bot");
  const startScreen = document.querySelector(".start-screen");
  const selectScreen = document.querySelector(".select-screen");
  let isOpponentBot = false;

  function setIsOpponentBot(isBot) {
    isOpponentBot = isBot;
  }

  // hides start screen and shows the opponent select screen
  function showSelectScreen() {
    startScreen.style.display = "none";
    selectScreen.style.display = "flex";
  }

  // starts game
  function setupGame(isBot) {
    boardController.init();
    selectScreen.style.display = "none";
  }

  // resets UI to startscreen
  function restartUI() {
    startScreen.style.display = "flex";
  }

  function announceWinner(winner) {
    // announce winner in ui here
    const winnerName = winner === 1 ? "Player One" : "Player Two";
    console.log(winnerName);
  }

  // adds necessary listeners
  function init() {
    newGameButton.addEventListener("click", () => showSelectScreen());
    playerVsBotButton.addEventListener("click", () => {
      setIsOpponentBot(true);
      setupGame();
    });
    playerVsPlayerButton.addEventListener("click", () => {
      setIsOpponentBot(false);
      setupGame();
    });
  }

  // public methods
  return { init, announceWinner };
})();

UIController.init();
