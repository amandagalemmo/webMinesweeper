var canvas = document.getElementById('gameBoard');
var ctx = canvas.getContext('2d');

var tileDim = 40;
var tilePadding = 1;
var x = canvas.width/2;
var y = canvas.height/2;

var boardRowCount = 9;
var boardColCount = 9;


var numMines = 10;
var numTiles = boardRowCount * boardColCount;
var middle = Math.floor(numTiles/2);
console.log(middle);

var mineLocations = populateBoard();

var tiles = [];
for (var r = 0; r < boardRowCount; r++) {
  tiles[r] = [];
  for (var c = 0; c < boardColCount; c++) {
    tiles[r][c] = {
      x : 0,
      y: 0,
      visited: false,
      mine: mineLocations[boardRowCount * r + c]
    };
    if (r === 4 && c === 4) {
      tiles[r][c].visited = true;
    }
  }
}

function getRandomInt(numTiles) {
  return Math.floor(Math.random() * numTiles);
}

function populateBoard() {
  board = new Array(numTiles).fill(false);
  let m = 0;
  while (m < numMines) {
    let i = getRandomInt(numTiles);
    // @TODO: refactor this
    while (true) {
      if (i === middle || board[i]) {
        console.log('line 48; i = ' + i);
        i = getRandomInt(numTiles);
        console.log(`new i: ${i}`);
      } else {break;}
    }
    console.log(`${i} : ${board[i]}`);
    board[i] = true;
    m++;
  }
  return board;
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
        color = '#e64539';
      } else if (!tiles[r][c].visited) {
        color = '#403130';
      } else {color = '#a3d6c8';}
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
  ctx.font = '20px Arial';
  ctx.fillStyle = 'white';
  let tileNum = 0;
  for (var r = 0; r < boardRowCount; r++) {
    for (var c = 0; c < boardColCount; c++) {
      ctx.fillText(`${tileNum}`, tiles[r][c].x + tileDim/4, tiles[r][c].y + tileDim - 15, 40);
      tileNum++;
    }
  }
}

console.log(prettyPrint(tiles));
drawBoard();
drawHints();
