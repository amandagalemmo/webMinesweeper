var canvas = document.getElementById('gameBoard');
var ctx = canvas.getContext('2d');

var tileDim = 24;

var boardRowCount = 9;
var boardColCount = 9;


var numMines = 15;
var numTiles = boardRowCount * boardColCount;
var playerPos = getRandomInt(numTiles);
console.log(playerPos);

var mineLocations = populateBoard();

var tiles = [];
var tileNum = 0;
for (var r = 0; r < boardRowCount; r++) {
  tiles[r] = [];
  for (var c = 0; c < boardColCount; c++) {
    tiles[r][c] = {
      x : 0,
      y: 0,
      num: tileNum,
      visited: false,
      mine: mineLocations[boardRowCount * r + c],
      hint: 0
    };
    if (tileNum === playerPos) {
      tiles[r][c].visited = true;
    }
    tileNum++;
  }
}

// Palette
var colors = {
  hidden: '#355070',
  borderDistant: '#6d597a',
  seenDistant: '#b56578',
  borderNear: '#e56b6f',
  seenNear: '#eaac8b',
  player: '#a3d6c8' //403130?
}

// UI
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var escapePressed = false;
var spacePressed = false;

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight" || e.key === 'A') {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === 'D') {
    leftPressed = true;
  } else if (e.key === "Down" || e.key === "ArrowDown" || e.key === 'S') {
    downPressed = true;
  } else if (e.key === "Up" || e.key === "ArrowUp" || e.key === 'W') {
    upPressed = true;
  } else if (e.key === "Esc" || e.key === "Escape") {
    escapePressed = true;
  } else if (e.key === "Spacebar" || e.key === " ") {
    spacePressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight" || e.key === 'A') {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === 'D') {
    leftPressed = false;
  } else if (e.key === "Down" || e.key === "ArrowDown" || e.key === 'S') {
    downPressed = false;
  } else if (e.key === "Up" || e.key === "ArrowUp" || e.key === 'W') {
    upPressed = false;
  } else if (e.key === "Esc" || e.key === "Escape") {
    escapePressed = false;
  } else if (e.key === "Spacebar" || e.key === " ") {
    spacePressed = false;
  }
}

function getRandomInt(numTiles) {
  return Math.floor(Math.random() * numTiles);
}

// @TODO: still prints over start tile for some reason
//          seems to do ok on smaller boards? 
function populateBoard() {
  board = new Array(numTiles).fill(false);
  let m = 0;
  while (m < numMines) {
    let i = getRandomInt(numTiles);
    //console.log(`start tile: ${playerPos}`);
    // @TODO: refactor this
    while (true) {
      if (i === playerPos || board[i]) {
        console.log('line 51, i = ' + i);
        i = getRandomInt(numTiles);
        console.log('new i = ' + i);
      } else {break;}
    }
    board[i] = true;
    m++;
  }
  return board;
}

// generate hints. heat map
function analyzeBoard(board) {
  let curTile = 0;
  for (var r = 0; r < boardRowCount; r++) {
    for (var c = 0; c < boardColCount; c++) {

      if (mineLocations[curTile]) {
        tiles[r][c].hint = '*';
        curTile++;
      } 
      else if (tiles[r][c].tileNum === playerPos) {
        tiles[r][c].hint = 'x';
        curTile++;
      } 
      else {
        let neighbors = 0;
        if ((r > 0 && c > 0) && (r < boardRowCount-1 && c < boardColCount-1) ) {
          for (let _r = r - 1; _r <= r + 1; r++) {
            for (let _c = c - 1; _c <= c + 1; c++) {
              if (tiles[r][c].mine) {
                neighbors++;
              }
            }
          }
          tiles[r][c].hint = neighbors;
        } 
        else {
          if (r === 0) {
            
          }
        }
      }
}

function prettyPrint(board) {
  str = [];
  for (var r = 0; r < boardRowCount; r++) {
    for (var c = 0; c < boardColCount; c++) {
      if (board[r][c].mine) {
        str.push('*');
      } else {
        str.push('0');
      }
    }
    str.push('\n')
  }
  return str.join('');
}

function drawBoard() {
  for (var r = 0; r < boardRowCount; r++) {
    for (var c = 0; c < boardColCount; c++) {
      if (tiles[r][c].mine) {
        color = colors['seenNear'];
      } else if (!tiles[r][c].visited) {
        color = colors['hidden'];
      } else {color = colors['player'];}
      var tileX = (c * (tileDim));
      var tileY = (r * (tileDim));
      tiles[r][c].x = tileX;
      tiles[r][c].y = tileY;
      ctx.beginPath();
      ctx.rect(tileX, tileY, tileDim, tileDim);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
    }
  }
}

function drawHints() {
  ctx.font = '12px Arial';
  ctx.fillStyle = 'white';
  for (var r = 0; r < boardRowCount; r++) {
    for (var c = 0; c < boardColCount; c++) {
      ctx.fillText(`${tiles[r][c].num}`, tiles[r][c].x, tiles[r][c].y + tileDim, 40);
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  drawHints();

  if (rightPressed) {

  }
}

console.log(prettyPrint(tiles));
drawBoard();
drawHints();
