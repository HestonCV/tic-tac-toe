const newGameButton = document.getElementById("new-game-button");
newGameButton.addEventListener("click", () => {
  const startScreen = document.querySelector(".start-screen");
  startScreen.style.display = "none";

  const selectScreen = document.querySelector(".select-screen");
  selectScreen.style.display = "flex";
});
