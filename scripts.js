// controls the state of the game
const gameController = (function () {
  // player 1 is -1 and player 2 is 2 for each for checking winner
  let playerTurn = 1;
  let isGameOver = false;
  let isOpponentBot = false;

  function getIsOpponentBot() {
    return isOpponentBot;
  }

  function setIsOpponentBot(isBot) {
    isOpponentBot = isBot;
  }

  function getIsGameOver() {
    return isGameOver;
  }

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

  function clearGame() {
    playerTurn = 1;
    isGameOver = false;
  }

  function makeMove() {
    playerTurn = playerTurn === 1 ? -1 : 1;
    // if board is full, announce tie
    if (boardController.isBoardFull()) {
      isGameOver = true;
      UIController.announceWinner(checkWinner());
      boardController.deactivateBoard();
    } else {
      // 1 for player 1, -1 for player 2, 0 for no winner
      const winner = checkWinner();
      if (winner !== 0) {
        isGameOver = true;
        UIController.announceWinner(winner);
        boardController.deactivateBoard();
      }
    }
  }

  function makeBotMove() {
    const boardSquares = document.querySelectorAll(".board-square");
    const boardIds = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const boardState = boardController.getBoardState();
    let randomRow = Math.floor(Math.random() * 3);
    let randomColumn = Math.floor(Math.random() * 3);
    while (boardState[randomRow][randomColumn] !== 0) {
      randomRow = Math.floor(Math.random() * 3);
      randomColumn = Math.floor(Math.random() * 3);
    }
    const boardId = boardIds[randomRow][randomColumn];

    let chosenBoardSquare;
    boardSquares.forEach((boardSquare) => {
      if (parseInt(boardSquare.dataset.id, 10) === boardId) {
        chosenBoardSquare = boardSquare;
      }
    });
    return chosenBoardSquare;
  }

  function getPlayerTurn() {
    return playerTurn;
  }

  // public methods
  return {
    getIsGameOver,
    makeMove,
    getPlayerTurn,
    clearGame,
    setIsOpponentBot,
    getIsOpponentBot,
    makeBotMove,
  };
})();

// controls the state of the board and display
const boardController = (() => {
  const playerOne = {
    symbol: "X",
    color: "rgb(44, 145, 170)",
    inactiveColor: "rgba(44, 145, 170, 0.5)",
  };

  const playerTwo = {
    symbol: "O",
    color: "rgb(43, 194, 232)",
    inactiveColor: "rgba(43, 194, 232, 0.5)",
  };

  const emptyCell = {
    symbol: "",
    color: "rgba(44, 145, 170, 0.103)",
  };

  const board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  function isBoardFull() {
    const board = boardController.getBoardState();

    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        if (board[i][j] === 0) return false;
      }
    }
    return true;
  }

  function getBoardState() {
    const currentboard = board;
    return currentboard;
  }

  function setBoardState(row, column) {
    board[row][column] = gameController.getPlayerTurn();
  }

  function deactivateBoard() {
    const boardSquares = document.querySelectorAll(".board-square");
    boardSquares.forEach((boardSquare) => {
      if (boardSquare.textContent === playerOne.symbol) {
        boardSquare.style.backgroundColor = playerOne.inactiveColor;
      } else if (boardSquare.textContent === playerTwo.symbol) {
        boardSquare.style.backgroundColor = playerTwo.inactiveColor;
      }
    });
  }

  function clearBoard() {
    // reset board state array
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        board[i][j] = 0;
      }
    }

    // reset each board square to default
    const boardSquares = document.querySelectorAll(".board-square");
    boardSquares.forEach((boardSquare) => {
      boardSquare.style.backgroundColor = emptyCell.color;
      boardSquare.textContent = emptyCell.symbol;
    });
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
        console.log(gameController.getIsGameOver());
        if (!gameController.getIsGameOver()) {
          makeMove(boardSquare);
          if (gameController.getIsOpponentBot()) {
            const botBoardSquare = gameController.makeBotMove();
            setTimeout(() => {
              makeMove(botBoardSquare);
            }, 1000);
          }
        }
      });
    });
  }

  // public methods
  return { init, getBoardState, clearBoard, isBoardFull, deactivateBoard };
})();

// controls the state of the user interface
const UIController = (() => {
  const newGameButton = document.getElementById("new-game-button");
  const playerVsPlayerButton = document.getElementById("player");
  const playerVsBotButton = document.getElementById("bot");
  const clearButton = document.getElementById("clear-button");
  const restartButton = document.getElementById("restart-button");
  const startScreen = document.querySelector(".start-screen");
  const selectScreen = document.querySelector(".select-screen");

  // go back to main menu
  function showStartScreen() {
    startScreen.style.display = "flex";
  }

  // hides start screen and shows the opponent select screen
  function showSelectScreen() {
    startScreen.style.display = "none";
    selectScreen.style.display = "flex";
  }

  // starts game
  function setupGame(isBot) {
    boardController.init();
    confirmationModalController.init();
    winnerModalController.init();
    selectScreen.style.display = "none";
  }

  function announceWinner(winner) {
    // announce winner in ui here
    winnerModalController.openWinner(winner);
    const winnerName = winner === 1 ? "Player One" : "Player Two";
    console.log(winnerName);
  }

  // adds necessary listeners
  function init() {
    // start screen button
    newGameButton.addEventListener("click", () => showSelectScreen());
    playerVsBotButton.addEventListener("click", () => {
      gameController.setIsOpponentBot(true);
      setupGame();
    });

    // select screen buttons
    playerVsPlayerButton.addEventListener("click", () => {
      gameController.setIsOpponentBot(false);
      setupGame();
    });

    // game screen buttons
    clearButton.addEventListener("click", () => {
      confirmationModalController.openConfirmation("clear");
    });
    restartButton.addEventListener("click", () => {
      confirmationModalController.openConfirmation("main");
    });
  }

  // public methods
  return { init, announceWinner, showStartScreen };
})();

const confirmationModalController = (function () {
  const confirmationModal = document.querySelector(".confirmation-modal");
  const confirmationMessage = document.getElementById("confirmation-message");
  const yesButton = document.getElementById("yes-button");
  const noButton = document.getElementById("no-button");

  let buttonOption = "main";

  function setConfirmationMessage(message) {
    confirmationMessage.textContent = message;
  }

  function hideModal() {
    confirmationModal.style.display = "none";
  }

  function showModal() {
    confirmationModal.style.display = "flex";
  }

  function clear() {
    boardController.clearBoard();
    gameController.clearGame();
  }

  function mainMenu() {
    boardController.clearBoard();
    gameController.clearGame();
    UIController.showStartScreen();
  }

  function openConfirmation(option) {
    showModal();
    buttonOption = option;
    if (buttonOption === "main") {
      setConfirmationMessage("Return To Main Menu?");
    } else {
      setConfirmationMessage("Clear The Game Board?");
    }
  }

  function init() {
    yesButton.addEventListener("click", () => {
      if (buttonOption === "main") {
        mainMenu();
        hideModal();
      } else {
        clear();
        hideModal();
      }
    });
    noButton.addEventListener("click", () => {
      hideModal();
    });

    confirmationModal.addEventListener("click", (event) => {
      if (event.target === confirmationModal) {
        hideModal();
      }
    });
  }
  return { init, openConfirmation };
})();

const winnerModalController = (function () {
  const winnerModal = document.querySelector(".winner-modal");
  const winnerMessage = document.getElementById("winner-message");
  const playAgainButton = document.getElementById("play-again-button");
  const mainMenuButton = document.getElementById("main-menu-button");
  const closeButton = document.querySelector(".close-winner");

  function setWinnerMessage(message) {
    winnerMessage.textContent = message;
  }

  function hideModal() {
    winnerModal.style.display = "none";
  }

  function showModal() {
    winnerModal.style.display = "flex";
  }

  function clear() {
    boardController.clearBoard();
    gameController.clearGame();
  }

  function mainMenu() {
    boardController.clearBoard();
    gameController.clearGame();
    UIController.showStartScreen();
  }

  function openWinner(winner) {
    showModal();
    console.log(winner);
    if (winner === 1) {
      setWinnerMessage("Player One Wins!");
    } else if (winner === -1) {
      setWinnerMessage("Player Two Wins!");
    } else {
      setWinnerMessage("It's a Tie!");
    }
  }

  function init() {
    playAgainButton.addEventListener("click", () => {
      clear();
      hideModal();
    });
    mainMenuButton.addEventListener("click", () => {
      mainMenu();
      hideModal();
    });
    closeButton.addEventListener("click", () => {
      hideModal();
    });
    winnerModal.addEventListener("click", (event) => {
      if (event.target === winnerModal) {
        hideModal();
      }
    });
  }
  return { init, openWinner };
})();

UIController.init();
