
import p5 from 'p5';
import * as utils from '../utils';
import wiggleLine from '../utils/wiggleLine';

const pieceName = "Genuary day 5: Vera Molnar";

class PlottedScribble {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.straight = (random() > 0.8);

    const padding = 20;

    this.squareSize = utils.relSize(gridDistance - padding);
    this.xStart = utils.relSize(gridDistance) * (this.x) + utils.relSize(padding / 2);
    this.yStart = utils.relSize(gridDistance) * (this.y) + utils.relSize(padding / 2);

    this.segments = floor(random(4, 10));
  }

  draw() {

    noFill();

    // rect(
    //   this.xStart, this.yStart,      
    //   this.squareSize
    // )

    push();
    if(random() > 0.8) {
      translate(this.xStart + (this.squareSize/2), this.yStart + (this.squareSize/2));
      rotate(randomGaussian(0, (PI/42)));
      translate(-this.xStart - (this.squareSize/2), -this.yStart - (this.squareSize/2));
    }

    wiggleLine(this.xStart, this.yStart, this.xStart + this.squareSize, this.yStart, false, 5);
    wiggleLine(this.xStart, this.yStart + this.squareSize, this.xStart + this.squareSize, this.yStart  + this.squareSize, false, 5);
    wiggleLine(this.xStart, this.yStart, this.xStart, this.yStart + this.squareSize, false, 5);
    wiggleLine(this.xStart + this.squareSize, this.yStart, this.xStart + this.squareSize, this.yStart + this.squareSize, false, 5);


    if(this.straight) {
      this.drawLines();
    } else {
      this.drawWiggles();
    }

    pop();

  }
  
  drawLines() {

    for (let i = 0; i < this.segments; i++) {
      wiggleLine(
        this.xStart, this.yStart + (this.squareSize * (i+0.5) / this.segments), 
        this.xStart + this.squareSize,  
        this.yStart + (this.squareSize * (i+0.5) / this.segments),
        false,
        wiggleFactor)
    }
  }


  drawWiggles() {

    for (let i = 0; i < this.segments/2; i++) {

      wiggleLine(
        this.xStart, this.yStart + (this.squareSize * (floor(random(this.segments))+0.5) / this.segments), 
        this.xStart + this.squareSize,  
        this.yStart + (this.squareSize * (floor(random(this.segments))+0.5) / this.segments),
        false,
        wiggleFactor)
    }
  }
}

let gridSize = 15;
let gridDistance = 1000/gridSize;

let wiggleFactor;

function setup() {  
  utils.standardCanvas();
  reset();
  noLoop();
}

let squares = [];

function reset() {
  gridSize = Math.floor(random(4, 8));
  gridDistance = 1000/gridSize;
  wiggleFactor = random([0.5, 1, 1, 5]);

  squares = [];

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      squares.push(new PlottedScribble(x, y))
    }
  }

}

function draw() {

  fill(utils.paperColor);
  rect(0, 0, utils.relSize(1000))

  push();
  translate(utils.relSize(500),utils.relSize(500));
  scale(0.9);
  translate(utils.relSize(-500),utils.relSize(-500));

  squares.forEach(dot => {
    dot.draw();
  });
  pop();
}


utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});  
  