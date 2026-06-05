function GameManager(size, InputManager, Actuator, StorageManager) {
  this.size           = size; // Size of the grid
  this.inputManager   = new InputManager;
  // this.storageManager = new StorageManager;
  // this.actuator       = new Actuator;

  // this.startTiles     = 2;

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  // this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

  // this.setup();
  console.log("gsfd");
}


// Restart the game
GameManager.prototype.restart = function () {
  // this.storageManager.clearGameState();
  // this.actuator.continueGame(); // Clear the game won/lost message
  // this.setup();

  console.log("sfdsffffffffffffffffff");
};







// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {

  console.log("Move");

};

