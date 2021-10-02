import p5 from 'p5';
import * as utils from '../utils';

const penColor = '#111111';
const paperColor = '#efefef';
let canvas;
function setup() {  
  canvas = utils.standardCanvas();
  reset();
  noLoop();
  strokeJoin(ROUND);
  strokeCap(ROUND);
}

let horizonLine, mountainTop, rangeHeight, sunHeight, sunSize;

function reset() {
  horizonLine = random(height* 0.65, height * 0.9);
  rangeHeight = random(height * 0.1, height * 0.4);
  mountainTop = horizonLine - rangeHeight;
  sunHeight = random(height * 0.15, horizonLine * 0.7);
  sunSize = random(100, min(sunHeight, 200));
}

function generateLineDashes() {
  const dots = [1, 7, 1, 7, 1, 7]; // sum = 24
  const lines = [10, 7, 13, 7]; // sum = 34
  const patterns = [dots, lines, [100, 2], [112, 2], lines, [118, 2.5], [1, 5, 1, 7, 1, 6], [30, 6]]; // got bored

  let dashes = [];
  return dashes
    .concat(random(patterns))
    .concat(random(patterns))
    .concat(random(patterns))
    .concat(random(patterns))
    .concat(random(patterns)); // until it's suitably random
}

function drawSky() {
  fill(penColor)
  rect(0, 0, width/2, height);

  drawSunLines();
  drawStars();

  stroke(penColor);
  ellipse(width/2, sunHeight, sunSize, sunSize);
}

function drawStars() {
  fill(paperColor);
  stroke(paperColor);

  const gridSize = width/40;

  const nf = (1/70); // nf for noiseFactor

  for (let x = 0; x < width/2; x+= gridSize) {
    for (let y = 0; y < height; y+= gridSize) {
      const r = random(0.5);
      let x1 = x + random(gridSize);
      let y1 = y + random(gridSize);
      if(r > noise(x * nf, y * nf)) {
        if(r < 0.3) { // sometimes its big stars
          beginShape();
          vertex(x1, y1 + (r*10));
          vertex(x1 + (r*10), y1);
          vertex(x1, y1 - (r*10));
          vertex(x1 - (r*10), y1);
          endShape(CLOSE);
        } else {
          point(x1, y1);
        }
      }
    }    
  }
}

function drawSunLines() {
  fill(paperColor);
  stroke(penColor);
  strokeWeight(2);

  push();
  translate(width/2, sunHeight)
  const rotationAmount = TWO_PI / (random(15, 30));
  rotate(rotationAmount/2);    
  for (let angle = 0; angle < TWO_PI; angle+= rotationAmount) {
    drawingContext.setLineDash(generateLineDashes());
    line(0, 0, 0, width);    
    rotate(rotationAmount);
  }
  pop();
}

function drawMountain(x, y) {
  let mountainsToDraw = [];
  const mountainHeight = horizonLine - y;
  const baseSize = random(mountainHeight, width/2);
  const segments = 10;
  const dx = baseSize / segments;
  const dy = mountainHeight / segments;

  const mVariation = random(0.1, 0.2) * dx;

  let vertices = [];

  beginShape();
  vertex(x + baseSize, horizonLine);
  
  for (let upStep = 0.5; upStep < segments; upStep++) {
    let newX = x + baseSize - (upStep*dx);
    newX = randomGaussian(newX, mVariation);    
    let newY = horizonLine - upStep*dy;
    newY = randomGaussian(newY, mVariation);
    vertex(newX, newY);
    vertices.push({x: newX, y: newY});
    if(random() > 0.7) {
      mountainsToDraw.push({x: newX, y: newY});
    }
  }

  vertex(x, y);

  for (let downStep = 0.5; downStep < segments; downStep++) {
    let newX = x - downStep*dx;
    newX = randomGaussian(newX, mVariation);
    let newY = y + downStep*dy;
    newY = randomGaussian(newY, mVariation);
    vertex(newX, newY);
    vertices.push({x: newX, y: newY});

    if(random() > 0.7) {
      mountainsToDraw.push({x: newX, y: newY});
    }
  }

  vertex(x - baseSize, horizonLine);
  endShape(CLOSE);
  return mountainsToDraw;
}

function drawMountainRange() {
  const howManyMountainPeaks = floor(random(1, 3));

  fill(paperColor);
  stroke(penColor);
  const distanceBetween = width / howManyMountainPeaks;
  
  strokeWeight(2);

  for (let index = 0; index <= howManyMountainPeaks; index++) {
    const peak = distanceBetween * index;
    drawMountain(peak, mountainTop);
  }
}

function drawSea() {

  fill(paperColor);
  stroke(penColor);
  
  rect(0, horizonLine, width, height);
  strokeWeight(2.2);

  const distanceBetweenStrokes = 1;

  for (let y = horizonLine; y <= height+3; y+= distanceBetweenStrokes) {
    const reflectionWidth =  map(noise(y/100), 0, 1, sunSize* 0.1, sunSize * 1.2);
    push();

    const dashes = generateLineDashes();
    const dashSum = dashes.reduce((prev, current) =>  prev + current)

    drawingContext.setLineDash(dashes);
    drawingContext.lineDashOffset = random(dashSum);

    line(0, y, (width/2 - randomGaussian(reflectionWidth, width*0.02)), y);
    line(width, y, (width/2 + randomGaussian(reflectionWidth, width*0.02)), y);

    pop();
  }

}

function draw() {
  background(paperColor);

  const scaleAmount = random(0.75, 0.9);
  const paddingAmount = (1 - scaleAmount) / 2;

  push();
  translate(width/2, height/2);
  scale(scaleAmount, scaleAmount);
  translate(-width/2, -height/2);
  drawSky();
  drawMountainRange();
  drawSea();
  pop();

  fill(paperColor);
  noStroke();
  // rotate(random(0.3) * PI)

  rect(0, 0, paddingAmount*width, height);
  rect((1 - paddingAmount)*width, 0, paddingAmount*width, height);
  rect(0, 0, width, paddingAmount * height);
  rect(0, (1 - paddingAmount)*height, width, paddingAmount*height);

  noFill();
  stroke(penColor);

  rect(paddingAmount*width, paddingAmount*height, scaleAmount*width, scaleAmount * height);

}

utils.attach({
  setup,
  draw,
  canvas,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressed,
});
