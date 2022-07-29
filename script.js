// gameboard memory module
let gameboard = (function () {
  let memory = ["", "", "", "", "", "", "", "", ""];
  let read = function () {
    return [...memory];
  };
  let update = function (position, content) {
    memory[position] = content;
  };
  let reset = function () {
    memory = ["", "", "", "", "", "", "", "", ""];
  };

  return {
    read,
    update,
    reset,
  };
})();

// game module
let game = (function () {
  let players = [];
  let currentPlayerIndex = 0;
  let start = function () {
    interface.getNames();
    interface.displayShow("board");
    
  };
  let setPlayer = function (name, token) {
    players.push({ name, token });
  };
  let readPlayer = function () {
    console.log(players);
  };
  let round = function (e) {
    let position = e.target.dataset.index;
    let token = players[currentPlayerIndex].token;
    gameboard.update(position, token);
    interface.displayUpdate(position, token);
    currentPlayerIndex = currentPlayerIndex == 0 ? 1 : 0;
    interface.removeListener(position);
  };

  return {
    start,
    setPlayer,
    readPlayer,
    round,
  };
})();

// interface controller module
let interface = (function () {
  let intro;
  let board;
  let outro;
  let grid;
  let startButton;

  let cacheDOM = function () {
    intro = document.querySelector(".intro");
    board = document.querySelector(".board");
    outro = document.querySelector(".outro");
    grid = document.querySelectorAll(".grid");
    startButton = document.querySelector(".start");
  };
  let addListener = function () {
    grid.forEach((elem) => elem.addEventListener("click", game.round));
    startButton.addEventListener("click", game.start);
  };
  let displayUpdate = function (position, content) {
    grid[position].textContent = content;
  };
  let removeListener = function (position) {
    grid[position].removeEventListener("click", game.round);
  };
  let displayShow = function (ui) {
    if (ui == "intro") {
      intro.classList.remove("hidden");
      board.classList.add("hidden");
      outro.classList.add("hidden");
    } else if (ui == "board") {
      board.classList.remove("hidden");
      intro.classList.add("hidden");
      outro.classList.add("hidden");
    } else if (ui == "outro") {
      outro.classList.remove("hidden");
      board.classList.add("hidden");
      intro.classList.add("hidden");
    }
  };
  let getNames = function () {
    let playerOneName = document.querySelector("#playerOne").value;
    let playerTwoName = document.querySelector("#playerTwo").value;
    if (!playerOneName) {
      playerOneName = "Player One"
    }
    if (!playerTwoName) {
      playerTwoName = "Player Two"
    }

    game.setPlayer(playerOneName, "X");
    game.setPlayer(playerTwoName, "O");
  };

  cacheDOM();
  addListener();

  return {
    cacheDOM,
    addListener,
    displayUpdate,
    removeListener,
    displayShow,
    getNames,
  };
})();

// factory for player
function player(name, token) {
  return { name, token };
}
