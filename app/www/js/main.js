var board;
var score = 0;
const rows = 4, columns = 4;

// 缓存DOM
let gridContainer;
let scoreElement;
let gameOverOverlay;

window.onload = function() {
    gridContainer = document.querySelector(".grid-container");
    scoreElement  = document.querySelector(".score-value");
    gameOverOverlay = document.getElementById("gameOverOverlay");

    let inputManager = new KeyboardInputManager();

    // 响应移动（键盘或滑动）
    inputManager.on("move", function (direction) {
        if (gameOverOverlay.style.display === "flex") {
            return; 
        }

        // 映射方向函数
        const slideActions = [slideUp, slideRight, slideDown, slideLeft];
        slideActions[direction](); 
        
        setTwo(); // 移动后生成新方块
        scoreElement.innerText = score;

        if (checkGameOver()) {
            gameOverOverlay.style.display = "flex";
        }
    });

    // 响应重开（无论是点按钮还是按 R 键，统一此处处理）
    inputManager.on("restart", resetGame);

    setGame();// 初始化游戏棋盘
}

function setGame() {
    // board = [
    //     [2, 2, 2, 2],
    //     [2, 2, 2, 2],
    //     [4, 4, 8, 8],
    //     [4, 4, 8, 8]
    // ];

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            //<div id="0-0"></div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            gridContainer.append(tile);
        }
    }
    //create 2 to begin the game
    setTwo();
    setTwo();

}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; //clear the classList
    tile.classList.add("cell");
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("tile-"+num.toString());
        } else {
            tile.classList.add("tile-8192");
        }                
    }
}

function filterZero(row){
    return row.filter(num => num != 0); //create new array of all nums != 0
}

function slide(row) {
    //[0, 2, 2, 2] 
    row = filterZero(row); //[2, 2, 2]
    for (let i = 0; i < row.length-1; i++){
        if (row[i] == row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    } //[4, 0, 2]
    row = filterZero(row); //[4, 2]
    //add zeroes
    while (row.length < columns) {
        row.push(0);
    } //[4, 2, 0, 0]
    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];         //[0, 2, 2, 2]
        row.reverse();              //[2, 2, 2, 0]
        row = slide(row)            //[4, 2, 0, 0]
        board[r] = row.reverse();   //[0, 0, 2, 4];
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        //find random row and column to place a 2 in
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("tile-2");
            found = true;
        }
    }
}

function hasEmptyTile() {
    let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) { //at least one zero in the board
                return true;
            }
        }
    }
    return false;
}

// 判定游戏是否结束
function checkGameOver() {
    // 1. 如果还有空位，说明还能继续生成数字，游戏未结束
    if (hasEmptyTile()) {
        return false;
    }

    // 2. 检查是否有相邻且相同的数字（可合并）
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let current = board[r][c];
            // 检查右侧相邻
            if (c < columns - 1 && current === board[r][c + 1]) {
                return false; 
            }
            // 检查下方相邻
            if (r < rows - 1 && current === board[r + 1][c]) {
                return false;
            }
        }
    }
    // 既没有空位，也没有可合并的数字，判定为结束
    return true;
}

// 重新开始游戏
function resetGame() {
    // 隐藏结束遮罩层
    gameOverOverlay.style.display = "none";
    
    // 重置分数
    score = 0;
    scoreElement.innerText = score;

    // 清空棋盘数据并更新UI
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            board[r][c] = 0;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, 0);
        }
    }
    
    // 重新生成开局的两个数字
    setTwo();
    setTwo();
}

