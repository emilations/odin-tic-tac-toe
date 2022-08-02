// gameboard memory module
let gameboard = (function () {
  let memory;
  let playersMem = [];

  let init = function () {
    memory = ["", "", "", "", "", "", "", "", ""];
  };

  let read = function () {
    return [...memory];
  };

  let update = function (position, content) {
    memory[position] = content;
  };

  let players = function (action, name, token) {
    if (action == "set") {
      playersMem.push({ name, token });
    } else if (action == "read") {
      return playersMem;
    } else if (action == "clear") {
      playersMem = [];
    }
  };

  return {
    init,
    read,
    update,
    players,
  };
})();

// game module
let game = (function () {
  let currentPlayerIndex;

  let init = function () {
    currentPlayerIndex = 0;
    gameboard.init();
    gameboard.players("clear");
    interface.cacheDOM();
    interface.addListener();
    interface.displayShow("intro");
  };

  let start = function () {
    interface.getNames();
    interface.displayShow("board");
    interface.displayUpdate("clear");
    interface.displayUpdate(
      "message",
      `${gameboard.players("read")[currentPlayerIndex].name} turn`
    );
  };

  let round = function (e) {
    let position = e.target.dataset.index;
    let token = gameboard.players("read")[currentPlayerIndex].token;
    gameboard.update(position, token);
    interface.displayUpdate("update", position, token);
    currentPlayerIndex = currentPlayerIndex == 0 ? 1 : 0;
    interface.displayUpdate(
      "message",
      `${gameboard.players("read")[currentPlayerIndex].name} turn`
    );
    interface.removeListener(position);
  };

  return {
    init,
    start,
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
  let message;
  let returnButton;

  let cacheDOM = function () {
    intro = document.querySelector(".intro");
    board = document.querySelector(".board");
    outro = document.querySelector(".outro");
    grid = document.querySelectorAll(".grid");
    startButton = document.querySelector(".start-button");
    message = document.querySelector(".message p");
    returnButton = document.querySelector(".return-button");
  };

  let addListener = function () {
    grid.forEach((elem) => elem.addEventListener("click", game.round));
    startButton.addEventListener("click", game.start);
    returnButton.addEventListener("click", game.init);
  };

  let removeListener = function (position) {
    grid[position].removeEventListener("click", game.round);
  };

  let displayUpdate = function (action, position, content) {
    if (action == "update") {
      if (position == "message") {
        message.textContent = content;
      } else {
        grid[position].textContent = content;
      }
    } else if (action == "clear") {
      for (let i = 0; i < gameboard.read().length; i++) {
        grid[i].textContent = "";
      }
    }
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
      playerOneName = "Player One";
    }
    if (!playerTwoName) {
      playerTwoName = "Player Two";
    }
    gameboard.players("set", playerOneName, "X");
    gameboard.players("set", playerTwoName, "O");
  };

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

game.init();
