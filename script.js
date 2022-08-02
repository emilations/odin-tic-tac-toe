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
  let winner = undefined;

  let init = function () {
    currentPlayerIndex = 0;
    winner = undefined;
    console.log(winner) 
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
      "update",
      "message",
      `${gameboard.players("read")[currentPlayerIndex].name} turn`
    );
  };

  let round = function (e) {
    let position = e.target.dataset.index;
    let token = gameboard.players("read")[currentPlayerIndex].token;
    gameboard.update(position, token);
    interface.displayUpdate("update", position, token);
    console.log(winner)
    checkWinner()
    if (winner) {
      interface.displayUpdate(
        "update",
        "message",
        `Winner is ${gameboard.players("read")[currentPlayerIndex].name}`
      );
      interface.removeListener("allGrid");
      return
    }
      interface.displayUpdate(
      "update",
      "message",
      `${gameboard.players("read")[currentPlayerIndex].name} turn`
    );
    currentPlayerIndex = currentPlayerIndex == 0 ? 1 : 0;
    interface.removeListener(position);
  };

  let checkWinner = function () {
    let board = gameboard.read();
    let winnerMap = ["123", "456", "789", "147", "258", "368", "159", "753"];
    for (let index in winnerMap){
      let first = board[winnerMap[index][0]-1]
      let second = board[winnerMap[index][1]-1]
      let third = board[winnerMap[index][2]-1]
      if (first == "" || second == "" || third == "") {
        continue;
      }
      if (first == second && second == third){
        winner = gameboard.players("read")[currentPlayerIndex].name
        return
      }
    }
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
    message = document.querySelector(".message");
    returnButton = document.querySelector(".return-button");
  };

  let addListener = function () {
    grid.forEach((elem) => elem.addEventListener("click", game.round));
    startButton.addEventListener("click", game.start);
    returnButton.addEventListener("click", game.init);
  };

  let removeListener = function (position) {
    if (position == "allGrid"){
      grid.forEach((elem) => elem.removeEventListener("click", game.round))
      console.log("removed all listners")
      return
    }
    grid[position].removeEventListener("click", game.round);
  };

  let displayUpdate = function (action, position, content) {
    if (action == "update") {
      if (position == "message") {
        message.innerHTML = ""
        let element = document.createElement("p");
        element.classList.add("transition");
        element.textContent = content;
        message.appendChild(element)
      } else {
        grid[position].childNodes[0].textContent = content;
        grid[position].childNodes[0].classList.add("transition");
      }
    } else if (action == "clear") {
      for (let i = 0; i < gameboard.read().length; i++) {
        let element = document.createElement("p");
        grid[i].innerHTML = '';
        grid[i].appendChild(element)
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