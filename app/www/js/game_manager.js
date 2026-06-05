function GameManager(size, InputManager, Actuator, StorageManager) {
  this.size           = size; // Size of the grid
  this.inputManager   = new InputManager;
  // this.storageManager = new StorageManager;
  this.actuator       = new Actuator;

  // this.startTiles     = 2;

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
  //   this.addStartTiles();
  // }

  // Update the actuator
  this.actuate();
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

};



// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {

  console.log("Move");

};

