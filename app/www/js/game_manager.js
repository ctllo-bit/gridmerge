function GameManager(size, InputManager, Actuator, StorageManager) {
  this.size           = size; // Size of the grid
  this.inputManager   = new InputManager;
  // this.storageManager = new StorageManager;
  this.actuator       = new Actuator;

  this.startTiles     = 2;

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  // this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

  this.setup();
}


// Restart the game
GameManager.prototype.restart = function () {
  // this.storageManager.clearGameState();
  // this.actuator.continueGame(); // Clear the game won/lost message
  // this.setup();

  console.log("sfdsffffffffffffffffff");
};


// Set up the game
GameManager.prototype.setup = function () {
  // var previousState = this.storageManager.getGameState();

  board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];


  // // Reload the game from a previous game if present
  // if (previousState) {
  //   this.grid        = new Grid(previousState.grid.size,
  //                               previousState.grid.cells); // Reload grid
  //   this.score       = previousState.score;
  //   this.over        = previousState.over;
  //   this.won         = previousState.won;
  //   this.keepPlaying = previousState.keepPlaying;
  // } else {
  this.grid        = new Grid(this.size);
  //this.score       = 0;
  //   this.over        = false;
  //   this.won         = false;
  //   this.keepPlaying = false;

  //   // Add the initial tiles
  this.addStartTiles();
  // }

  // Update the actuator
  this.actuate();
};


// Set up the initial tiles to start the game with
GameManager.prototype.addStartTiles = function () {
  for (var i = 0; i < this.startTiles; i++) {
    this.addRandomTile();
  }
};

// Adds a tile in a random position
GameManager.prototype.addRandomTile = function () {
  if (this.grid.cellsAvailable()) {
    var value = Math.random() < 0.9 ? 2 : 4;
    var tile = new Tile(this.grid.randomAvailableCell(), value);

    this.grid.insertTile(tile);
  }
};


















// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  console.log("kkkkkkkkkkkkk");
  // if (this.storageManager.getBestScore() < this.score) {
  //   this.storageManager.setBestScore(this.score);
  // }

  // // Clear the state when the game is over (game over only, not win)
  // if (this.over) {
  //   this.storageManager.clearGameState();
  // } else {
  //   this.storageManager.setGameState(this.serialize());
  // }

  this.actuator.actuate(this.grid, {
    score:      this.score,
    over:       false,
    bestScore:  1024,
    terminated: false
  });

  // 自己不碰 DOM，全权交给 actuator 处理
  //this.actuator.actuate(this.grid, { score: this.score, over: this.over });

};



// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {

  // 1. 遍历并记录所有方块的当前位置 (tile.savePosition())
  // 2. 根据你的滑动逻辑，计算新的二维数组（注意：合并时生成新的 Tile 对象）
  // 3. 更新每个方块的新坐标 (tile.updatePosition(newCell))
  // 4. 计算完毕后，呼叫渲染器，把数据丢给它去画图

  console.log("Move");

};

