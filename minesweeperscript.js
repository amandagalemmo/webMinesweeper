/*@TODO:
    - create a newGame method 
    - allow map to resize with window? this is a stretch goal*/

// Initializations______________________________________________________________
var canvas = document.getElementById('gameBoard');
var ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const TILEDIM = 24;                                   // Dimensions of each tile
//const ROWS = Math.floor(ctx.canvas.height / TILEDIM); // might not always be a constant
//const COLS = Math.floor(ctx.canvas.width / TILEDIM); // might not always be a constant

const ROWS = 5;
const COLS = 5;

const numTiles = ROWS * COLS;
const numMines = Math.ceil(numTiles * .125);

var leftPadding = Math.ceil((ctx.canvas.width - (COLS * TILEDIM)) / 2);
var topPadding = Math.ceil((ctx.canvas.height - (ROWS * TILEDIM)) / 2);

var playerInit = getRandomInt(numTiles);              // player initial location
var playerR = Math.floor(playerInit / COLS);          // player initial R coord
var playerC = playerInit - playerR * COLS;            // player initial C coord

var adjacent = initializeBoard();

var score = 0;

// Palette
var colors = {
  hidden: '#355070',
  borderDistant: '#6d597a',
  seenDistant: '#b56578',
  borderNear: '#e56b6f',
  seenNear: '#eaac8b',
  player: '#a3d6c8'
}

var tiles = [];
for (var r = 0; r < ROWS; r++) {
  tiles[r] = [];
  for (var c = 0; c < COLS; c++) {
    tiles[r][c] = {
      cX : c * TILEDIM,      //coords for canvas
      cY: r * TILEDIM,       //coords for canvas
      num: (r * COLS + c),
      visited: false,
      neighbors: adjacent[(r * COLS + c)],
      color: colors.hidden
    };
  }
}

// UI___________________________________________________________________________
window.addEventListener('resize', reportWindowSize);
document.addEventListener('keydown', keyDownHandler, {once: true});

function reportWindowSize() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    leftPadding = Math.ceil((ctx.canvas.width - (COLS * TILEDIM)) / 2);
    topPadding = Math.ceil((ctx.canvas.height - (ROWS * TILEDIM)) / 2);
    draw();
}

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight" || e.key === 'A') {
    if (playerC < COLS - 1) playerC++;
  } else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === 'D') {
    if (playerC > 0) playerC--;
  } else if (e.key === "Down" || e.key === "ArrowDown" || e.key === 'S') {
    if (playerR < ROWS  - 1) playerR++;
  } else if (e.key === "Up" || e.key === "ArrowUp" || e.key === 'W') {
    if (playerR > 0) playerR--;
  }

  setTimeout(function() {
    move();
    draw();
    document.addEventListener('keydown', keyDownHandler, {once: true});}, 250);
}

// Helper functions_____________________________________________________________
function getRandomInt(numTiles) {
  return Math.floor(Math.random() * numTiles);
}

// @TODO: must refactor this
function initializeBoard() {
  let adjacent = new Array(numTiles).fill(0);
  let m = 0;
  // The following is a hacky way to establish borders when counting adjacency
  var bLeft = new Array();
  var bRight = new Array();
  for (let i = 0; i < numTiles; i+=COLS) {bLeft.push(i);}
  for (let i = COLS-1; i < numTiles; i+=COLS) {bRight.push(i);}

  while (m < numMines) {
    let i = getRandomInt(numTiles);
    // @TODO: do not like that it's a while loop
    while (true) {
      if (i === playerInit || adjacent[i] === 9) {
        i = getRandomInt(numTiles);
      } else {break;}
    }
    adjacent[i] = 9;
    for (let y = -COLS; y <= COLS; y += COLS) {
      if (i + y < 0 || i + y >= numTiles) {continue;}
      for (let x = -1; x < 2; x++) {
        if (i + x < 0 || i + x >= numTiles) {continue;}
        else if (bLeft.includes(i) && x === -1) {continue;}
        else if (bRight.includes(i) && x === 1) {continue;}
        j = i + x + y;
        if (adjacent[j] < 9) {
          adjacent[j]++;
        }
      }
    }
    m++;
  }
  return adjacent;
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
      drawTile(r,c);
      drawHint(r,c);
      //if (tiles[r][c].visited) {drawHint(r,c)};
    }
  }
}

function drawTile(r, c) {
  ctx.beginPath();
  ctx.rect(tiles[r][c].cX + leftPadding, tiles[r][c].cY + topPadding, 
    TILEDIM, TILEDIM);
  ctx.fillStyle = tiles[r][c].color;
  ctx.fill();
  ctx.closePath();
}

function drawPlayer() {
  ctx.beginPath();
  ctx.rect(tiles[playerR][playerC].cX + leftPadding, tiles[playerR][playerC].cY + topPadding, 
           TILEDIM, TILEDIM);
  ctx.fillStyle = colors['player'];
  ctx.fill();
  ctx.closePath();
}

function drawHint(r, c) {
  ctx.font = '12px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText(tiles[r][c].neighbors>0 ? `${tiles[r][c].neighbors}` : ' ', 
    tiles[r][c].cX + 8 + leftPadding, tiles[r][c].cY + 16+ topPadding, TILEDIM);
  /*ctx.fillText(`${tiles[r][c].num}`, 
      tiles[r][c].cX + 8, tiles[r][c].cY + 16, TILEDIM);*/
}

function move() {
  if (tiles[playerR][playerC].neighbors === 9) {    // if tile is mine
    gameOver();
  } 
  // if the tile we just moved to hasn't been visited...
  if (!tiles[playerR][playerC].visited) {
    tiles[playerR][playerC].visited = true;
    //console.log(`[[${playerR},${playerC}]]`);
    
    let exposeQ = [];
    let currQueue = new Set();
    exposeQ.push(tiles[playerR][playerC]);
    while (exposeQ.length > 0 && exposeQ[0] !== null) {
      console.log('exposeQ ' + exposeQ + ' len: ' + exposeQ.length);
      let currNode = exposeQ.shift();
      console.log('currNode: ' + currNode.cY + ' ' + currNode.cX);
      //handles current tile, returns list of exposure-ready neighbors
      let result = handleTile(currNode.cY / TILEDIM, currNode.cX / TILEDIM);
      if (result !== null) {
        console.log('result: ' + result + ' result length: ' + result.length);
        console.log(result[0] === result[1]);
        for (let r of result) {
          console.log(`\t[${r.cY/TILEDIM}][${r.cX/TILEDIM}]`);
          currQueue.add(r);
        }
        console.log(currQueue.size);
        exposeQ = [...currQueue];
      }
    }
  }
}

function handleTile(r, c) {
  try {
    assignColor(tiles[r][c]);
  } catch (error) {
    console.error(error);
    console.log(r + ' ' + c);
    return;
  }
  let blocked = 0;
  let toQueue = [];
  let zero = false;
  tiles[r][c].visited = true;
  for (i = -1; i <= 1; i += 2) {
    console.log(i);
    if (r + i > 0 && r + i < ROWS-1) {
      console.log(`\t[${r + i}][${c}]`);
      if (!tiles[r + i][c].visited) {
        if (tiles[r + i][c].neighbors > 0) {
          blocked++;
          if (tiles[r + i][c].neighbors < 9) {
            toQueue.push(tiles[r + i][c]);
          }
        } else {
          zero = true;
          toQueue.push(tiles[r + i][c]);
        }
      }
    } 
    if (c + i > 0 && c + i < COLS-1) {
      if (!tiles[r][c + i].visited) {
        if (tiles[r][c + i].neighbors > 0) {
          blocked++;
          if (tiles[r][c + i].neighbors < 9) {
            toQueue.push(tiles[r][c + i]);
          }
        } else {
          zero = true;
          toQueue.push(tiles[r][c + i])
        }
      }
    }
  }
  if (blocked === 4 || !zero) {
    console.log('blocked');
    return null;
  }
  return toQueue;
}

function gameOver() {
  console.log('GAME OVER!')
}

function assignColor(tile) {
  if (tile.neighbors === 0) {
    tile.color = colors.seenNear;
  } else if (tile.neighbors === 9) {
    return;
  } else {
    tile.color = colors.borderNear;
  }
}

// Running this thing__________________________________________________________
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  drawPlayer();
}
move();
draw();