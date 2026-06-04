function KeyboardInputManager() {
  this.events = {};
  this.listen();
}

KeyboardInputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

KeyboardInputManager.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(callback => callback(data));
  }
};

KeyboardInputManager.prototype.listen = function () {
  var self = this;

  // 映射按键：0:上, 1:右, 2:下, 3:左
  var map = {
    38: 0, 39: 1, 40: 2, 37: 3, // 方向键(Up, Right, Left)
    75: 0, 76: 1, 74: 2, 72: 3, // Vim (K, L, J, H)
    87: 0, 68: 1, 83: 2, 65: 3  // W, D, S, A
  };

  // 键盘监听
  document.addEventListener("keydown", function (event) {
    var modifiers = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
    var mapped    = map[event.which];

    if (!modifiers) {
      if (mapped !== undefined) {
        event.preventDefault();
        self.emit("move", mapped);
      }
    }

    if (!modifiers && event.which === 82) { // R 键重开
      self.emit("restart");
    }
  });

  // 自动绑定 HTML 按钮点击
  this.bindButtonPress(".btn-new", this.restart);
  this.bindButtonPress(".btn-restart", this.restart);
  // this.bindButtonPress(".keep-playing-button", this.keepPlaying);

  // 移动端滑动监听
  var touchStartStatus = { x: 0, y: 0 };
  var gameContainer = document.querySelector(".game-container");

  gameContainer.addEventListener("touchstart", function (event) {
    if (event.touches.length > 1) return; // 忽略多指触控
    touchStartStatus.x = event.touches[0].clientX;
    touchStartStatus.y = event.touches[0].clientY;
    event.preventDefault();
  }, { passive: false });

  gameContainer.addEventListener("touchmove", event => event.preventDefault(), { passive: false });

  gameContainer.addEventListener("touchend", function (event) {
    if (event.touches.length > 0) return;

    var dx = event.changedTouches[0].clientX - touchStartStatus.x;
    var dy = event.changedTouches[0].clientY - touchStartStatus.y;
    var absDx = Math.abs(dx), absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 10) {
      // 核心算法：判断滑动方向并派发
      self.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
    }
  });
};

KeyboardInputManager.prototype.restart = function (event) {
  event.preventDefault();
  this.emit("restart");
};

// KeyboardInputManager.prototype.keepPlaying = function (event) {
//   event.preventDefault();
//   this.emit("keepPlaying");
// };

KeyboardInputManager.prototype.bindButtonPress = function (selector, fn) {
  var button = document.querySelector(selector);

  // 加上这个 if 判断！只有当按钮真的存在时，才去绑定事件
  if (button) {
    button.addEventListener("click", fn.bind(this));
    button.addEventListener("touchend", fn.bind(this));
  }
};
