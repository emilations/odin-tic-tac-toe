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
  let start = function () {};
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
    interface.removeListener(position)
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
  let grid;
  let cacheDOM = function () {
    grid = document.querySelectorAll(".grid");
  };
  let addListener = function () {
    grid.forEach((elem) => elem.addEventListener("click", game.round));
  };
  let displayUpdate = function (position, content) {
    grid[position].textContent = content;
  };
  let removeListener = function (position){
    grid[position].removeEventListener("click", game.round);
  }
  cacheDOM();
  addListener();

  return {
    cacheDOM,
    addListener,
    displayUpdate,
    removeListener,
  };
})();

// factory for player
function player(name, token) {
  return { name, token };
}

game.setPlayer("Sofia", "O");
game.setPlayer("Emile", "X");