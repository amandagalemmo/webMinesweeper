// Initializations______________________________________________________________
var canvas = document.getElementById('gameBoard');
var ctx = canvas.getContext('2d');

const TILEDIM = 24;
const ROWS = 9;
const COLS = 9;
const numMines = 10;
const numTiles = ROWS * COLS;
var playerInit = getRandomInt(numTiles);
var playerR = Math.floor(playerInit / ROWS);
var playerC = playerInit - playerR * ROWS;

var bLeft = new Array();
var bRight = new Array();
for (let i = 0; i < numTiles; i+=COLS) {bLeft.push(i);} // ew ish hacky fix
for (let i = COLS-1; i < numTiles; i+=COLS) {bRight.push(i);}

var boardInit = initializeBoard();

var mineLocations = boardInit.mineLoc,
    hints = boardInit.hints;

// Palette
var colors = {
  hidden: '#355070',
  borderDistant: '#6d597a',
  seenDistant: '#b56578',
  borderNear: '#e56b6f',
  seenNear: '#eaac8b',
  player: '#a3d6c8' //403130?
}

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
      hint: hints[tileNum],
      color = colors.hidden
    };
    if (tileNum === playerInit) {
      tiles[r][c].visited = true;  // change to viewable?
    }
    tileNum++;
  }
}

// UI___________________________________________________________________________

document.addEventListener('keydown', keyDownHandler, {once: true});

function keyDownHandler(e) {
  console.log('keydown');
  if (e.key === "Right" || e.key === "ArrowRight" || e.key === 'A') {
    if (playerC < COLS - 1) playerC++;
  } else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === 'D') {
    if (playerC > 0) playerC--;
  } else if (e.key === "Down" || e.key === "ArrowDown" || e.key === 'S') {
    if (playerR < ROWS  - 1) playerR++;
  } else if (e.key === "Up" || e.key === "ArrowUp" || e.key === 'W') {
    if (playerR > 0) playerR--;
  } //else if (e.key === "Esc" || e.key === "Escape") {
  // } else if (e.key === "Spacebar" || e.key === " ") {
  // }

  setTimeout(function() {document.addEventListener('keydown', 
                                    keyDownHandler, {once: true})}, 250);
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
      if (i === playerInit || mineLoc[i]) {
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
      }
      
      tiles[r][c].x = (c * (TILEDIM));
      tiles[r][c].y = (r * (TILEDIM));
      
      ctx.beginPath();
      ctx.rect(tiles[r][c].x, tiles[r][c].y, TILEDIM, TILEDIM);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
    }
  }
}

function drawPlayer() {
  ctx.beginPath();
  ctx.rect(tiles[playerR][playerC].x, tiles[playerR][playerC].y, 
           TILEDIM, TILEDIM);
  ctx.fillStyle = colors['player'];
  ctx.fill();
  ctx.closePath();
}

function drawHints() {
  ctx.font = '12px Arial';
  ctx.fillStyle = 'white';
  for (var r = 0; r < ROWS; r++) {
    for (var c = 0; c < COLS; c++) {
      ctx.fillText(`${tiles[r][c].hint}`, 
                    tiles[r][c].x + 8, tiles[r][c].y + 16, TILEDIM);
      /*ctx.fillText(`${tiles[r][c].num}`, 
      tiles[r][c].x + 8, tiles[r][c].y + 16, TILEDIM);*/
    }
  }
}

// Running this thing__________________________________________________________
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  
  drawHints();
  drawPlayer();

  // once event is triggered, run draw and delay event listener .5sec, 
  // but continue to draw. maybe idle enemy animations. dont have to worry 
  // at the minute though.
  
  //setTimeout(function() {requestAnimationFrame(draw)}, 500);
  requestAnimationFrame(draw);
}
//trigger draw on successful keydown
draw();
