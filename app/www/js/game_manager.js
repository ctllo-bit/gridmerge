class GameManager {
  constructor(size, InputManager, Actuator, StorageManager) {
    this.size           = size;
    this.inputManager   = new InputManager();
    this.storageManager = new StorageManager();
    this.actuator       = new Actuator();
    this.soundEnabled   = false;
    this.audioContext   = null;
    this.startTiles     = 2;

    this.inputManager.on("move", this.move.bind(this));
    this.inputManager.on("restart", this.restart.bind(this));
    this.inputManager.on("toggleSound", this.toggleSound.bind(this));

    this.setup();
  }

  restart() {
    this.storageManager.clearGameState();
    this.actuator.continueGame();
    this.setup();
  }

  setup() {
    const previousState = this.storageManager.getGameState();

    if (previousState) {
      this.grid  = new Grid(previousState.grid.size, previousState.grid.cells);
      this.score = previousState.score;
      this.over  = previousState.over;
    } else {
      this.grid  = new Grid(this.size);
      this.score = 0;
      this.over  = false;
      this.addStartTiles();
    }
    this.actuate();
  }

  addStartTiles() {
    for (let i = 0; i < this.startTiles; i++) {
      this.addRandomTile();
    }
  }

  addRandomTile() {
    if (this.grid.cellsAvailable()) {
      const value = Math.random() < 0.9 ? 2 : 4;
      const tile = new Tile(this.grid.randomAvailableCell(), value);
      this.grid.insertTile(tile);
    }
  }

  actuate() {
    if (this.storageManager.getBestScore() < this.score) {
      this.storageManager.setBestScore(this.score);
    }

    if (this.over) {
      this.storageManager.clearGameState();
    } else {
      this.storageManager.setGameState(this.serialize());
    }

    this.actuator.actuate(this.grid, {
      score:      this.score,
      bestScore:  this.storageManager.getBestScore(),
      terminated: this.over
    });
  }

  serialize() {
    return {
      grid:  this.grid.serialize(),
      score: this.score,
      over:  this.over
    };
  }

  prepareTiles() {
    this.grid.eachCell(function (x, y, tile) {
      if (tile) {
        tile.mergedFrom = null;
        tile.savePosition();
      }
    });
  }

  moveTile(tile, cell) {
    this.grid.cells[tile.x][tile.y] = null;
    this.grid.cells[cell.x][cell.y] = tile;
    tile.updatePosition(cell);
  }

  getVector(direction) {
    const map = {
      0: { x: -1, y: 0 },  // 向上
      1: { x: 0,  y: 1 },  // 向右
      2: { x: 1,  y: 0 },  // 向下
      3: { x: 0,  y: -1 }  // 向左
    };
    return map[direction];
  }

  buildTraversals(vector) {
    const traversals = { x: [], y: [] };
    for (let pos = 0; pos < this.size; pos++) {
      traversals.x.push(pos);
      traversals.y.push(pos);
    }
    if (vector.x === 1) traversals.x.reverse();
    if (vector.y === 1) traversals.y.reverse();
    return traversals;
  }

  findFarthestPosition(cell, vector) {
    let previous;
    // 解构赋值简化代码
    do {
      previous = cell;
      cell = { x: previous.x + vector.x, y: previous.y + vector.y };
    } while (this.grid.withinBounds(cell) && this.grid.cellAvailable(cell));

    return { farthest: previous, next: cell };
  }

  move(direction) {
    if (this.over) return;

    const vector     = this.getVector(direction);
    const traversals = this.buildTraversals(vector);
    let moved      = false;
    let points = 0;

    this.prepareTiles();

    // 优化：使用箭头函数，彻底移除了 let self = this;
    traversals.x.forEach(x => {
      traversals.y.forEach(y => {
        const cell = { x, y }; // ES6 对象简写
        const tile = this.grid.cellContent(cell);

        if (tile) {
          const { farthest, next: nextPos } = this.findFarthestPosition(cell, vector);
          const nextTile = this.grid.cellContent(nextPos);

          if (nextTile && nextTile.value === tile.value && !nextTile.mergedFrom) {
            const merged = new Tile(nextPos, tile.value * 2);
            merged.mergedFrom = [tile, nextTile];

            this.grid.insertTile(merged);
            this.grid.removeTile(tile);
            tile.updatePosition(nextPos);

            this.score += merged.value;
            points += merged.value;
          } else {
            this.moveTile(tile, farthest);
          }

          if (cell.x !== tile.x || cell.y !== tile.y) {
            moved = true;
          }
        }
      });
    });

    if (moved) {
      this.addRandomTile();
      if (!this.movesAvailable()) {
        this.over = true;
      }

      this.playSound(points > 0 ? "merge" : "move");

      if (this.over) {
        this.playSound("lose");
      }
      this.actuate();
    }
  }

  movesAvailable() {
    return this.grid.cellsAvailable() || this.tileMatchesAvailable();
  }

  // 借鉴了第二段代码的精简思路：只需要向右和向下查，避免重复计算
  tileMatchesAvailable() {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        const tile = this.grid.cellContent({ x, y });
        if (tile) {
          // 只检查右侧 (x, y+1) 和下方 (x+1, y)
          const rightTile = this.grid.cellContent({ x, y: y + 1 });
          const downTile  = this.grid.cellContent({ x: x + 1, y });

          if ((rightTile && rightTile.value === tile.value) || 
              (downTile && downTile.value === tile.value)) {
            return true; 
          }
        }
      }
    }
    return false;
  }


  toggleSound() {
    const button = document.querySelector(".btn-sound");
    this.soundEnabled = !this.soundEnabled;
    button.textContent = this.soundEnabled ? "音效:开" : "音效:关";
    if (this.soundEnabled) {
      this.playSound("move");
    }
  }

  ensureAudio() {
    if (!this.soundEnabled) return null;
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.audioContext;
  }

  tone(frequency, start, duration, type, gain) {
    const context = this.ensureAudio();
    if (!context) return;

    const oscillator = context.createOscillator();
    const volume = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    volume.gain.setValueAtTime(0.0001, start);
    volume.gain.exponentialRampToValueAtTime(gain, start + 0.01);
    volume.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(volume).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  playSound(type) {
    const context = this.ensureAudio();
    if (!context) return;

    const now = context.currentTime;

    if (type === "move") {
      this.tone(220, now, 0.055, "triangle", 0.025);
    }

    if (type === "merge") {
      this.tone(330, now, 0.08, "sine", 0.04);
      this.tone(495, now + 0.045, 0.08, "sine", 0.035);
    }

    if (type === "win") {
      [392, 523, 659, 784].forEach(function (note, index) {
        this.tone(note, now + index * 0.08, 0.13, "sine", 0.04);
      }, this);
    }

    if (type === "lose") {
      [220, 165, 123].forEach(function (note, index) {
        this.tone(note, now + index * 0.09, 0.16, "sawtooth", 0.022);
      }, this);
    }
  }

}