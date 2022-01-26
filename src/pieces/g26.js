
import p5 from 'p5';
import * as utils from '../utils';
import threadColors from '../utils/threadColors';

const pieceName = "Genuary day 26: Airport carpet";

// lets use the threadcolors again
let allColors = [...threadColors];
let c;

function setup() {  
  utils.standardCanvas();
  reset();
  noLoop();
}

class CarpetStitch {
  constructor(x, y, parent, c) {
    this.x = x;
    this.y = y;
    this.square = parent;
    this.color = c;

    this.size = parent.size / 12;

  }

  getColor() {
    return random(this.square.carpet.modifiedColors[this.color]);
  }
  
  draw() {
    push();
    translate(this.x * this.size + this.square.xOffset, this.y * this.size + this.square.yOffset);
    fill(this.getColor());
    noStroke();
    rect(0, 0, this.size+utils.relSize(1), this.size+utils.relSize(1));

    const strokeSize = utils.relSize(1.5);
    strokeWeight(strokeSize);
    for (let index = 0; index < this.size; index+= strokeSize) {
      stroke(this.getColor());

      let x1 = randomGaussian(0, this.size/4);
      let x2 =  randomGaussian(this.size, this.size/4);
      let y1 = index;
      let y2 = index;

      if(random() < 0.1) {
        x1 = index;
        x2 = index;
        y1 = randomGaussian(0, this.size/4);
        y2 =  randomGaussian(this.size, this.size/4);
  
      }

      line(x1, y1, x2, y2);
    }

    // rect(0, 0, this.size + 0.5);

    pop();
  }
}

const tubeSquares = [
  [10, 0],
  [11, 0],
  [9, 1],
  [10, 1],
  [11, 1],
  [8, 2],
  [9, 2],
  [10, 2],
  [7, 3],
  [8, 3],
  [9, 3],
  [6, 4],
  [7, 4],
  [8, 4],
  [5, 5],
  [6, 5],
  [7, 5],
  [4, 6],
  [5, 6],
  [6, 6],
  [3, 7],
  [4, 7],
  [5, 7],
  [2, 8],
  [3, 8],
  [4, 8],
  [3, 9]
];

class CarpetSquare {
  constructor(gridX, gridY, parent) {
    this.x = gridX;
    this.y = gridY;
    this.size = parent.squareSize;

    this.xOffset = this.x * this.size;
    this.yOffset = this.y * this.size;

    this.carpet = parent;
    this.colors = [...parent.colors];


    this.stitches = new Array(12);
    utils.shuffleArray(this.colors);
  }

  addStitch(x, y, c) {
    if(!this.stitches[x]) {
      this.stitches[x] = new Array(12);
    }

    this.stitches[x][y] = new CarpetStitch(x, y, this, c);
  }

  drawPlane() {
    this.drawTube(this.colors[1]);
    this.drawWings(this.colors[1]);
  }

  drawBackground() {
    for (let _x = 0; _x < this.stitches.length; _x++) {
      let row = this.stitches[_x];
      if(!row) {
        row = new Array(12);
      }
      this.stitches[_x] = [...row].map((s, _y) => {
        if(s) {
          return s;
        }
        return new CarpetStitch(_x, _y, this, this.colors[0]);
      })      
    }

  }

  _drawShape(bigArrayOfPoints, c) {
    bigArrayOfPoints.forEach((pair) => {
      this.addStitch(pair[0] - 1, pair[1] + 1, c);
    })
  }

  _drawShapeFlipped(bigArrayOfPoints, c) {
    bigArrayOfPoints.forEach((pair) => {
      this.addStitch(12 - pair[0], pair[1] + 1, c);
    })
  }

  drawFlippedTube(c) {
    this._drawShapeFlipped(tubeSquares, c);
  }
  drawTube(c) {

    this._drawShape(tubeSquares, c);
  }

  getWingSquares() {
    const wingSquares = [];
    for (let i = 0; i < 10; i++) {
      for (let y = 0; y < i; y++) {
        wingSquares.push([i, y+2]);
      }      
    }
    return wingSquares;
  }

  drawWings(c) {
    let wingSquares = this.getWingSquares();
    this._drawShape(wingSquares, c);
  }

  drawFlippedWings(c){
    this._drawShapeFlipped(this.getWingSquares(), c)
  }

  draw() {
    let f = random(['wings', 'tube', 'plane', 'flipTube', 'flipWings', 'flipPlane']);

    switch (f) {
      case 'wings':
        this.drawWings(this.colors[random([1, 2])])
        break;
      case 'flipWings':
        this.drawFlippedWings(this.colors[random([1, 2])])
        break;
  
      case 'tube':
        this.drawTube(this.colors[random([1, 2])])
        break;
      
      case 'flipTube': 
        this.drawFlippedTube(this.colors[1]);
        break;
      case 'flipPlane':
        this.drawFlippedTube(this.colors[1]);
        this.drawFlippedWings(this.colors[1]);
        break;
      default:
        this.drawPlane();
        break;
    }

    this.drawBackground();
  }

}
class Carpet {
  constructor() {
    this.stitchLength = utils.relSize(10);
    utils.shuffleArray(allColors);
    const maxColors = random([3, 3, 4, 5]);
    this.colors = allColors.slice(0, maxColors);

    this.modifiedColors = {};
    this.colors.forEach((c) => {
      this.modifiedColors[c] = this.modifyColor(c);
    });

    this.squareCount = Math.floor(random(6, 15));
    this.squareSize = width / this.squareCount;

    this.squares = [];

    for (let x = 0; x < this.squareCount; x++) {
      for (let y = 0; y < this.squareCount; y++) {
        this.squares.push(this.addSquare(x, y));
      }
    }
  }

  modifyColor(c) {
    c = color(c);
    const r = c._getRed();
    const g = c._getGreen();
    const b = c._getBlue();

    const numOptions = 10;
    let options = [];
    let v = random(10, 20);

    for (let index = 0; index < numOptions; index++) {
      let r1 = r + random(-v, v);
      let g1 = g + random(-v, v);
      let b1 = b + random(-v, v);
      options.push([r1, g1, b1]); 
    }

    return options
  }

  addSquare(x, y) {
    return new CarpetSquare(x, y, this);
  } 

  drawByStitch() {
    let stitches = [];
    this.squares.forEach((s) => {

      s.draw();
      stitches = stitches.concat(s.stitches.flat());
    });
    utils.shuffleArray(stitches);

    noStroke();
    stitches.forEach((s) => {
      if (s) {
        s.draw()
      }
    });
  }

  draw() {
    this.drawByStitch();
    // this.squares.forEach((s) => {
    //   s.drawPlane();
    // })
  }

}

function reset() {
  clear();
  c = new Carpet();
}

function draw() {
  background(utils.paperColor);
  utils.zoomOut(0.9);
  c.draw();
}

utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});  
  