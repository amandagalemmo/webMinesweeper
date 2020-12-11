// Initializations______________________________________________________________
var canvas = document.getElementById('gameBoard');
var ctx = canvas.getContext('2d');

const TILEDIM = 24;
const ROWS = 16;
const COLS = 30;
const numMines = 99;
const numTiles = ROWS * COLS;
var playerPos = getRandomInt(numTiles);

var bLeft = new Array();
var bRight = new Array();
for (let i = 0; i < numTiles; i+=COLS) {bLeft.push(i);}
for (let i = COLS-1; i < numTiles; i+=COLS) {bRight.push(i);}

var boardInit = initializeBoard();

var mineLocations = boardInit.mineLoc,
    hints = boardInit.hints;

var tiles = [];
var tileNum = 0;
for (var r = 0; r < ROWS; r++) {
  tiles[r] = [];
  for (var c = 0; c < COLS; c++) {
    tiles[r][c] = {
      x : 0,
      y: 0,
      num: tileNum,
      visited: false,
      mine: mineLocations[tileNum],
      hint: hints[tileNum]
    };
    if (tileNum === playerPos) {
      tiles[r][c].visited = true;
    }
    tileNum++;
  }
}

// Palette______________________________________________________________________
var colors = {
  hidden: '#355070',
  borderDistant: '#6d597a',
  seenDistant: '#b56578',
  borderNear: '#e56b6f',
  seenNear: '#eaac8b',
  player: '#a3d6c8' //403130?
}

// UI___________________________________________________________________________
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var escapePressed = false;
var spacePressed = false;

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
  console.log('keydown');
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

// Helper functions_____________________________________________________________
function getRandomInt(numTiles) {
  return Math.floor(Math.random() * numTiles);
}

function initializeBoard() {
  let mineLoc = new Array(numTiles).fill(false);
  let hints = new Array(numTiles).fill(0);
  let m = 0;

  while (m < numMines) {
    let i = getRandomInt(numTiles);
    // @TODO: do not like that it's a while loop
    while (true) {
      if (i === playerPos || mineLoc[i]) {
        i = getRandomInt(numTiles);
      } else {break;}
    }
    mineLoc[i] = true;
    for (let y = -COLS; y <= COLS; y += COLS) {
      if (i + y < 0 || i + y >= numTiles) {continue;}
      for (let x = -1; x < 2; x++) {
        if (i + x < 0 || i + x >= numTiles) {continue;}
        else if (bLeft.includes(i) && x === -1) {continue;}
        else if (bRight.includes(i) && x === 1) {continue;}
        j = i + x + y;
        if (mineLoc[j]) {
          hints[j] = '*';
        } else {
          hints[j]++;
        }
      }
    }
    m++;
  }
  return {mineLoc, hints};
}

function prettyPrint() {
  str = [];
  for (var r = 0; r < ROWS; r++) {
    for (var c = 0; c < COLS; c++) {
      str.push(tiles[r][c].hint);
    }
    str.push('\n')
  }
  return str.join('');
}

function drawBoard() {
  for (var r = 0; r < ROWS; r++) {
    for (var c = 0; c < COLS; c++) {
      if (tiles[r][c].mine) {
        color = colors['seenNear'];
      } else if (!tiles[r][c].visited) {
        color = colors['hidden'];
      } else {color = colors['player'];}
      var tileX = (c * (TILEDIM));
      var tileY = (r * (TILEDIM));
      tiles[r][c].x = tileX;
      tiles[r][c].y = tileY;
      ctx.beginPath();
      ctx.rect(tileX, tileY, TILEDIM, TILEDIM);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
    }
  }
}

function drawHints() {
  ctx.font = '12px Arial';
  ctx.fillStyle = 'white';
  for (var r = 0; r < ROWS; r++) {
    for (var c = 0; c < COLS; c++) {
      ctx.fillText(`${tiles[r][c].hint}`, tiles[r][c].x + 8, tiles[r][c].y + 16, TILEDIM);
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  drawHints();
}
//trigger draw on successful keydown
draw();
