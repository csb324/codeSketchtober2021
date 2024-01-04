
import p5 from 'p5';
import * as utils from '../utils';
const pieceName = "Genuary day 4: Pixel";
const channelColors = ['#f00', '#0f0', '#00f'];

class Dot {
  constructor(x, y, channel) {
    this.x = x;
    this.y = y;
    this.channelColor = channelColors[channel];
    this.channel = (channel + 1) * 41;
    this.size = gridDistance * 0.8;
  }

  draw() {
    let xAdjuster = (noise(
      (frameCount + this.x)/100, 
      this.y,
      this.channel * 100
    ) - 0.5);
    
    let yAdjuster = (noise(
      (frameCount - this.y)/100,
      this.x + 10000,
      this.channel * 234
    ) - 0.5);

    let sizeAdjuster = (noise(
      frameCount/100, 
      this.y + 1000, 
      this.channel / this.x
    ) - 0.5);
    
    let realX = this.x + (xAdjuster * adjustment);
    let realY = this.y + yAdjuster * adjustment;
    let realSize = this.size + sizeAdjuster * adjustment * 2;

    if(sizeAdjuster > 0.3) {
      realSize = 2*realSize;
    }

    if(sizeAdjuster < -0.35) {
      return;
    }

    push();
    blendMode(SCREEN)
    fill(this.channelColor);
    noStroke();
    rect(utils.relSize(gridDistance) * (realX), utils.relSize(gridDistance) * (realY), utils.relSize(realSize))
    pop();
  }
}

let dots;

let gridSize = 15;
let gridDistance = 1000/gridSize;
let adjustment = 3;

function setup() {  
  utils.standardCanvas();
  reset();
}

function reset() {
  gridSize = random(9, 45);
  gridDistance = 1000/gridSize;
  adjustment = random(2, 6);

  dots = [];

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      [0, 1, 2].forEach((channel) => {
        dots.push(new Dot(x, y, channel))
      })
    }
  }

}

function draw() {

  fill(utils.penColor);
  rect(0, 0, utils.relSize(1000))

  translate(utils.relSize(500),utils.relSize(500))
  scale(0.8);
  translate(utils.relSize(-500),utils.relSize(-500))

  dots.forEach(dot => {
    dot.draw();
  });
}


utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});  
  