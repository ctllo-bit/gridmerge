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
    // 清空上一帧留下的所有旧方块 DOM
    self.clearContainer(self.tileContainer);

    // 重新遍历二维网格，发现哪里有方块实体，就画到页面上
    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if(cell){
          self.addTile(cell);
        }
      });
    });

    // 刷新分数板
    self.scoreValue.innerText = metadata.score;
    self.bestValue.innerText  = metadata.bestScore;

    // 判断并处理游戏结束状态
    if (metadata.terminated) {
      self.gameOverOverlay.style.display = "flex"; // 显示游戏结束
    }
  });
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

// 核心方法：动态构建方块 DOM 并插入页面 (支持丝滑滑动与合并动画)
HTMLActuator.prototype.addTile = function (tile) {
  const wrapper = document.createElement("div"); // 外层管位移 (transform: translate)
  const inner   = document.createElement("div"); // 内层管缩放 (transform: scale)

  // 1. 确定初始渲染位置 (为了让滑行动画生效，必须先渲染在旧位置)
  const position = tile.previousPosition || { x: tile.x, y: tile.y };
  let positionClass = `tile-position-${position.x}-${position.y}`;

  // 2. 组装基础类名
  const classes = ["tile", `tile-${tile.value}`, positionClass];
  if (tile.value > 2048) {
    classes.push("tile-super");
  }

  // 3. 核心动画状态机
  if (tile.previousPosition) {
    // 【滑行分支】：先以旧位置渲染，然后在下一帧立即变成新位置，从而触发 CSS 过渡滑行动画
    wrapper.className = classes.join(" ");
    window.requestAnimationFrame(() => {
      // 优雅替代：通过替换数组元素直接更新位置类名
      classes[2] = `tile-position-${tile.x}-${tile.y}`;
      wrapper.className = classes.join(" "); 
    });
  } else if (tile.mergedFrom) {
    // 【合并分支】：加上弹跳动画类，并递归渲染那两个向中间靠拢并消失的旧方块
    classes.push("tile-merged");
    wrapper.className = classes.join(" ");
    
    // 使用箭头函数，完美抛弃了老的 var self = this;
    tile.mergedFrom.forEach(merged => this.addTile(merged));
  } else {
    // 【新生分支】：新生成的方块，触发渐显和放大动画
    classes.push("tile-new");
    wrapper.className = classes.join(" ");
  }

  // 4. 组装并渲染 DOM
  inner.className = "tile-inner";
  inner.textContent = tile.value; // 用 textContent 代替 innerText，性能更好且避免回流

  wrapper.appendChild(inner);
  this.tileContainer.appendChild(wrapper);
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

