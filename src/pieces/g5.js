
import p5 from 'p5';
import * as utils from '../utils';
import wiggleLine from '../utils/wiggleLine';

const pieceName = "Genuary day 5: Vera Molnar";
const padding = 20;

class PlottedScribble {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.straight = (random() > 0.8);

    this.squareSize = utils.relSize(gridDistance - padding);
    this.xStart = utils.relSize(gridDistance) * (this.x) + utils.relSize(padding / 2);
    this.yStart = utils.relSize(gridDistance) * (this.y) + utils.relSize(padding / 2);

    this.segments = floor(random(4, 10));

    this.currentStrokeWeight = 1;
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

    this.drawBox();
    this.drawInterior();
    pop();

  }

  drawBox() {
    const boxSmoothness = 6;

    push();

    translate(this.xStart, this.yStart);

    wiggleLine(0, 0, this.squareSize, 0, false, boxSmoothness);
    wiggleLine(0, this.squareSize, this.squareSize, this.squareSize, false, boxSmoothness);
    wiggleLine(0, 0, 0, this.squareSize, false, boxSmoothness);
    wiggleLine(this.squareSize, 0, this.squareSize, this.squareSize, false, boxSmoothness);

    pop();
  }

  drawNothing() {
    return;
  }

  drawTarget() {
    const iterations = random(3, 10);
    for (let index = 0; index < iterations; index++) {

      const offsetX = this.xStart + (this.squareSize/2) + randomGaussian(0, utils.relSize(0));
      const offsetY = this.yStart + (this.squareSize/2) + randomGaussian(0, utils.relSize(0));

      const scaleFactor = random(0.65, 0.9)

      translate(offsetX, offsetY);
      scale(scaleFactor)
      this.currentStrokeWeight = (this.currentStrokeWeight / scaleFactor);
      translate(-offsetX, -offsetY);
      strokeWeight(this.currentStrokeWeight)

      this.drawBox();
    }
    return;
  }

  drawMoreSquares() {

    const iterations = random(3, 10);
    for (let index = 0; index < iterations; index++) {

      const offsetX = this.xStart + (this.squareSize/2) + randomGaussian(0, utils.relSize(20));
      const offsetY = this.yStart + (this.squareSize/2) + randomGaussian(0, utils.relSize(20));

      translate(offsetX, offsetY);
      rotate(randomGaussian(0, (PI/24)));
      translate(-offsetX, -offsetY);

      this.drawBox();
    }
    return;
  }

  drawInterior() {

    const interiors = [
      this.drawHorizontalLines.bind(this),
      this.drawVerticalLines.bind(this),
      this.drawWiggles.bind(this),
      this.drawWiggles.bind(this),
      this.drawMoreSquares.bind(this),
      this.drawMoreSquares.bind(this),
      this.drawTarget.bind(this),
    ];
    const thisTime = random(interiors);

    thisTime();
  }
  
  drawHorizontalLines() {

    for (let i = 0; i < this.segments; i++) {
      wiggleLine(
        this.xStart, this.yStart + (this.squareSize * (i+0.5) / this.segments), 
        this.xStart + this.squareSize,  
        this.yStart + (this.squareSize * (i+0.5) / this.segments),
        false,
        wiggleFactor)
    }
  }


  drawVerticalLines() {

    for (let i = 0; i < this.segments; i++) {
      wiggleLine(
        this.xStart + (this.squareSize * (i+0.5) / this.segments), 
        this.yStart, 
        this.xStart + (this.squareSize * (i+0.5) / this.segments),
        this.yStart + this.squareSize,
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
  