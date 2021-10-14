// capital R romantic

import p5 from 'p5';
import * as utils from '../utils';
import Rock from '../utils/Rock';

let colors = [];
let waterColors = [];
let rockColors = [];

let horizon;
let waterHeight;

function rgba(r, g, b, aPercent) {
  return color(r, g, b, aPercent * 255);
}

function setup() {  
  utils.standardCanvas();
  noLoop();

  colors = [
    rgba(188, 178, 197, 0.2),
    rgba(149, 122, 101, 0.2),
    rgba(234, 215, 189, 0.2),
    rgba(144, 109, 102, 0.2),
    rgba(164, 136, 128, 0.2),
    rgba(216, 196, 184, 0.2),
    rgba(185, 192, 208, 0.2),
    rgba(168, 138, 138, 0.2),
    rgba(131, 83, 64, 0.2),
    rgba(62, 44, 38, 0.2),
    rgba(234, 215, 189, 0.2),
  ];


  waterColors = [
    rgba(115, 104, 79, 0.5),
    rgba(111, 97, 67, 0.5),
    rgba(101, 96, 71, 0.5),
    rgba(108, 101, 72, 0.5),
    rgba(124, 119, 103, 0.5),
  ]

  rockColors = [
    rgba(16, 8, 7, 0.15),
    rgba(43, 26, 23, 0.15),
    rgba(67, 51, 51, 0.15),
    rgba(52, 42, 36, 0.15),
    rgba(54, 37, 33, 0.15)
  ]

  reset();

}


function flowAngle(x, y) {
  return map(noise(x, y), 0, 1, 0, 2*PI);
}

function reset() {
  horizon = random(0.6, 0.7); 
  blendMode(BLEND)
}


function smoothColor(colorList, value) {
  const strokeColorIndex = map(value, 0, 1, 0, colorList.length);
  const startColor = colorList[floor(strokeColorIndex)];
  let endColor = colorList[ceil(strokeColorIndex)];
  if(strokeColorIndex > colorList.length - 1) {
    endColor = colorList[0];
  }
  return lerpColor(startColor, endColor, fract(strokeColorIndex));
}

function drawSky() {
  noFill();
  noiseDetail(4, 0.6);
  const factor = 0.02;
  for (let y = 0; y < height*horizon + 40; y+= random(4, 12)) {
    for (let x = 0; x < width + 40; x+= random(4, 12)) {

      const nValue = noise(x*factor * 0.3, y*factor * 0.3);
      const strokeColor = smoothColor(colors, nValue);
      stroke(strokeColor);
      strokeWeight(utils.relSize(20 * (colors.length * nValue)));

      beginShape();
      vertex(x, y);
      curveVertex(x, y);
      const v = createVector(20, 0);
      v.rotate(flowAngle(x*factor * 0.5, y*factor));
      const xNext = x + v.x;
      const yNext = y + v.y;
      curveVertex(xNext, yNext);
      const v2 = createVector(20, 0);
      v2.rotate(flowAngle(xNext*factor* 0.5, yNext*factor));
      curveVertex(xNext + v2.x, yNext + v2.y);
      vertex(xNext + v2.x, yNext + v2.y);
      endShape();
    }    
  }
}

class RomanticRock extends Rock {
  setColor() {
    fill(random(rockColors));
  }
}

function drawRocks() {
  blendMode(OVERLAY);
  waterHeight = (1 - horizon) * height;
  for (let index = -utils.relSize(100); index < width; index+= utils.relSize(random(40, 200))) {
    const h = random(0.4, 1.2) * waterHeight;
    const r = new RomanticRock(index, height - (h/2), random(100, 300), h);
    r.draw();
  }
}

function drawWaterLine(index, variation) {
  const weirdness = random(1000);

  const strokeColor = smoothColor(waterColors, noise(index * 0.1))
  stroke(strokeColor);
  strokeWeight(utils.relSize(5));

  beginShape();
  curveVertex(0, index);
  for (let x = 0; x < width; x+= utils.relSize(random(50, 100))) {
    curveVertex(x, index + ((noise((x+weirdness) / 100) - 0.5) * variation))
  }

  curveVertex(width, index);
  curveVertex(width, index);
  endShape();
}

function drawWaterLines() {
  const startX = height * (2*horizon);
  fill(random(waterColors));
  let variation = 20;
  for (let index = startX; index < height * 2; index+= utils.relSize(random(10, 50))) {
    if(random() > (index*0.5/height) || index == startX) {
      drawWaterLine(index, variation);
      variation += random(5, 10);
    }
  }
}

function draw() {
  background(utils.paperColor);
  drawSky();

  const i = get();
  const zFactor = 2.4;
  const rFactor = 0.02;

  push();
  utils.zoomOut(zFactor);
  rotate(PI * rFactor);
  image(i, 0, 0);
  pop();

  const i2 = get();  
  scale(1, -1);
  image(i2, 0, -height, width, height*(1-horizon));
  scale(1, -1);
  // reflection!

  scale(1, 0.5);
  push();
  translate(0, (horizon*2 - 1)*height);
  drawRocks();
  drawRocks();
  pop();

  blendMode(SCREEN);

  drawWaterLines();
}

utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressed
});
