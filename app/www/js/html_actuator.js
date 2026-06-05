// html_actuator.js
function HTMLActuator() {
  this.tileContainer = document.querySelector(".tile-container");
  this.scoreContainer = document.querySelector(".score-value");
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  // 1. 每次渲染前，清空旧的方块 DOM
  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    // 2. 遍历网格里的每一个方块实体
    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    // 3. 更新分数等 UI
    self.scoreContainer.innerText = metadata.score;
  });
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