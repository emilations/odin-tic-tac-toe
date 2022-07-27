let gameboard = {
  memory: ["", "", "", "", "", "", "", "", ""],
  modify: function (position, content) {
    this.memory[position] = content;
  },
  clear: function () {
    this.memory = ["", "", "", "", "", "", "", "", ""];
  },
}

let gameInterface = {
  init: function () {
    this.cacheDOM();
    this.addListener();
    this.displayRefresh();
  },
  cacheDOM: function () {
    this.boxes = document.querySelectorAll(".box");
  },
  addListener: function () {
    this.boxes.forEach((box) => box.addEventListener("click", game.round));
  },
  removeListener: function() {

  },
  displayRefresh: function () {
    for (let position in this.boxes)
      this.boxes[position].innerHTML = gameboard.memory[position];
  },
};

let game = {
  playerTurn: "",
  winner: "",
  init: function () {
    gameboard.clear()
    gameInterface.init();
  },
  round: function(e) {
    let index = e.target.dataset.index;
    gameboard.modify(index, playerOne.mark);
    gameInterface.displayRefresh();
  },
  setSelection: function(e) {
    playerOne.mark = e.target.value;
  }
};

game.init();
let playerOne = player("X", "Yolo")


// factory for player
function player (mark, name) {
  return {name,
          mark,
  }
}