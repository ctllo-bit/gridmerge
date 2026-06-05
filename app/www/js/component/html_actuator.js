function HTMLActuator() {
  this.tileContainer = document.querySelector(".tile-container");
  this.scoreValue    = document.querySelector(".score-value");
  this.bestValue     = document.querySelector(".best-value");
  this.gameOverOverlay = document.querySelector(".game-over");

  this.score = 0;
}

// 核心渲染主网关：GameManager 每次算完棋盘都会调用它
HTMLActuator.prototype.actuate = function (grid, metadata) {
  let self = this;

  // 使用 requestAnimationFrame 确保在浏览器最佳绘制时机渲染，防止动画卡顿
  window.requestAnimationFrame(function () {
    // 1. 清空上一帧留下的所有旧方块 DOM
    self.clearContainer(self.tileContainer);

    // 2. 重新遍历二维网格，发现哪里有方块实体，就画到页面上
    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if(cell){
          self.addTile(cell);
        }
      });
    });

    // // 3. 刷新分数板
    self.scoreValue.innerText = metadata.score;
    self.bestValue.innerText  = metadata.bestScore;

    // 4. 判断并处理游戏结束状态
    if (metadata.terminated) {
      self.gameOverOverlay.style.display = "flex"; // 显示游戏结束
    }

// 3. 更新分数等 UI
 // self.updateScore(metadata.score);


  //   self.updateBestScore(metadata.bestScore);

  //   if (metadata.terminated) {
  //     if (metadata.over) {
  //       self.message(false); // You lose
  //     } else if (metadata.won) {
  //       self.message(true); // You win!
  //     }
  // }


  });
};


HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

// 核心方法：动态构建方块 DOM 并插入页面
HTMLActuator.prototype.addTile = function (tile) {
  console.log('ffffffffffffffffffffffffffff');

  var wrapper = document.createElement("div");//外层（wrapper） 只用来管一件事：移动（transform: translate）。
  var inner   = document.createElement("div");//内层（inner） 只用来管一件事：缩放（transform: scale）。

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

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  this.gameOverOverlay.style.display = "none"; 
};