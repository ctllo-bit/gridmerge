function HTMLActuator() {
  this.tileContainer = document.querySelector(".tile-container");
  this.scoreValue    = document.querySelector(".score-value");
  this.bestValue     = document.querySelector(".best-value");
  this.gameOverOverlay = document.querySelector(".game-over");

  this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    // 1. 每次渲染前，清空旧的方块 DOM
    self.clearContainer(self.tileContainer);

    // 2. 遍历网格里的每一个方块实体
    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        console.log(cell);
    //     if (cell) {
    //       console.log("666666666666666666666666666666");
    //       self.addTile(cell);
    //     }
      });
    });

// 3. 更新分数等 UI
  //self.updateScore(metadata.score);
  //   self.updateBestScore(metadata.bestScore);

  //   if (metadata.terminated) {
  //     if (metadata.over) {
  //       self.message(false); // You lose
  //     } else if (metadata.won) {
  //       self.message(true); // You win!
  //     }
  //   }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var wrapper = document.createElement("div");
  var inner   = document.createElement("div");

  // 将方块的当前坐标转换为 CSS 类名（触发移动动画的关键）
  var positionClass = "tile-position-" + tile.x + "-" + tile.y;

  // 基本样式
  var classes = ["tile", "tile-" + tile.value, positionClass];

  // 如果它是一个新生成的方块，加上出现动画类名
  if (tile.previousPosition === null && !tile.mergedFrom) {
    classes.push("tile-new");
  } 
  // 如果是合并出来的，加上弹跳动画类名
  else if (tile.mergedFrom) {
    classes.push("tile-merged");
  }

  // 拼接类名并渲染到屏幕上
  wrapper.className = classes.join(" ");
  inner.className = "tile-inner";
  inner.innerText = tile.value;

  wrapper.appendChild(inner);
  this.tileContainer.appendChild(wrapper);
};


// HTMLActuator.prototype.addTile = function (tile) {

//   console.log("wwwwffffffffffffff");

//   var self = this;

//   var wrapper   = document.createElement("div");
//   var inner     = document.createElement("div");
//   var position  = tile.previousPosition || { x: tile.x, y: tile.y };
//   var positionClass = this.positionClass(position);

//   // We can't use classlist because it somehow glitches when replacing classes
//   var classes = ["tile", "tile-" + tile.value, positionClass];

//   if (tile.value > 2048) classes.push("tile-super");

//   this.applyClasses(wrapper, classes);

//   inner.classList.add("tile-inner");
//   inner.textContent = tile.value;

//   if (tile.previousPosition) {
//     // Make sure that the tile gets rendered in the previous position first
//     window.requestAnimationFrame(function () {
//       classes[2] = self.positionClass({ x: tile.x, y: tile.y });
//       self.applyClasses(wrapper, classes); // Update the position
//     });
//   } else if (tile.mergedFrom) {
//     classes.push("tile-merged");
//     this.applyClasses(wrapper, classes);

//     // Render the tiles that merged
//     tile.mergedFrom.forEach(function (merged) {
//       self.addTile(merged);
//     });
//   } else {
//     classes.push("tile-new");
//     this.applyClasses(wrapper, classes);
//   }

//   // Add the inner part of the tile to the wrapper
//   wrapper.appendChild(inner);

//   // Put the tile on the board
//   this.tileContainer.appendChild(wrapper);
// };

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!";

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};
