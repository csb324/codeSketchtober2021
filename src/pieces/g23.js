import p5 from 'p5';
import * as utils from '../utils';

const pieceName = "Genuary day 23: Abstract vegetation";

let greens = [utils.penColor, '#1E311A', '#2D4925', '#5b7553', '#6d7157', '#dddbcb', '#f5f1e3']
let pinks =  [utils.penColor, '#751836', '#D81E5B', '#EE4266', '#717068'];
let browns = [utils.penColor, '#393122','#615132','#806a52','#9e8272']
let lemons = [utils.penColor, '#32351d','#525829','#65663e','#787453']

let allColors;
let succulentGradient;
let texture;
function preload() {
  texture = loadImage('/texture-canvas.jpg');
}

let colorSettings = {};

function setup() {  
  utils.standardCanvas();

  reset();
  noLoop();
}

function setColorScheme(cardWidth = width/4) {
  allColors = random([greens, lemons, browns]);
  allColors = allColors.map((c) => color(c));

  colorSettings = {
    borderColor: allColors[random([1, 2, 3, 4])],
    decorColor:  allColors[random([1, 2, 3, 4])]
  };

  succulentGradient = drawingContext.createLinearGradient(
    0, 0, cardWidth/1.9, 0);
    succulentGradient.addColorStop(0, allColors[0]);
    succulentGradient.addColorStop(0.6, allColors[1]);
    succulentGradient.addColorStop(0.65, allColors[2]);
    succulentGradient.addColorStop(0.72, allColors[3]);
}
function reset() {
  setColorScheme();
}

function drawSucculent(w, h, padding) {
  const strands = random(10, 20);
  const strandLength = (w - padding*4) * 0.4;

  push();

  translate(w/2, h/2);  
  drawingContext.fillStyle = succulentGradient;
  noStroke();

  for (let loopNo = 1; loopNo <= 4; loopNo++) {
    push()
    const sf = map(loopNo, 1, 4, 1, 0.25);
    scale(sf, sf);
    const strandCount = strands * sf;
    const rotationAmount = TWO_PI / strandCount;
    const leafL = map(loopNo, 1, 4, strandLength * 0.9, strandLength);

    for (let index = 0; index < strandCount; index++) {
      rotate(randomGaussian(rotationAmount, rotationAmount/20));
      const leafW = randomGaussian(strandLength/(strandCount/2), strandCount/4);
      drawSingleStrand(leafL, leafW);
    }
    pop();
  }

    // let indexJitter = randomGaussian(index, 0.1);

    // let leafLength = map(indexJitter, 0, strands, strandLength,  strandLength/2);
    // const leafThickness = map(indexJitter, 0, strands, leafLength / 2, leafLength / 8)
    // const rotationAmount = map(indexJitter, 0, strands, 0, PI*8);

    // push();
    // rotate(rotationAmount);
    // drawSingleStrand(leafLength, leafThickness);

    // pop();


  pop();

}

function drawSingleStrand(leafLength, leafThickness) {
  beginShape();
  vertex(0, 0);
  vertex(0, leafThickness);
  
  curveVertex(leafLength/2, randomGaussian(leafThickness, utils.relSize(2)))
  vertex(leafLength, 0);    
  curveVertex(leafLength/2, randomGaussian(-leafThickness, utils.relSize(2)))

  vertex(0, 0);
  vertex(0, 0);
  
  endShape();
}

function drawLeaf(x, y, width, length, angle) {

  const strands = 20;
  const strandLength = width * 0.5;

  push();
  translate(x, y);  
  translate(strandLength, 0);
  rotate(angle);

  fill(lerpColor(allColors[0], allColors[1], 0.5));

  noStroke();
  push();
  rotate(PI/2);
  drawSingleStrand(length, length * 0.01);
  pop();
  
  for (let index = 0; index < strands; index++) {

    let indexJitter = randomGaussian(index, 0.1);

    let y = map(indexJitter, 0, strands, 0, length);
    let leafLength = map(indexJitter, 0, strands, strandLength,  strandLength/2);
    const leafThickness = map(indexJitter, 0, strands, (length/strands) / 2, (length/strands) / 8)
    const rotationAmount = map(indexJitter, 0, strands, PI/40, PI/2.1);

    fill(lerpColor(allColors[0], allColors[1], (indexJitter/strands)*2));
    if(indexJitter/strands > 0.5) {
      fill(lerpColor(allColors[1], allColors[2], (indexJitter/strands)*2 - 1));
    }

    push();
    translate(0, y);
    rotate(rotationAmount);

    drawSingleStrand(leafLength, leafThickness);
    rotate(-(rotationAmount*2));
    drawSingleStrand(-leafLength, leafThickness);

    pop();
  }


  pop();
}

function drawOutline(cardWidth, cardHeight, cardPadding) {
  stroke(colorSettings.borderColor);
  noFill();
  strokeWeight(utils.relSize(1));
  rect(utils.relSize(1), utils.relSize(1), cardWidth - utils.relSize(2), cardHeight - utils.relSize(2));
}

function drawTwoLeaves(cardWidth, cardHeight, cardPadding) {

  push();
  
  translate(cardPadding, cardPadding);
  cardWidth -= (2*cardPadding);
  cardHeight -= (2*cardPadding);  

  const leafWidth = cardWidth * 0.6;
  const leafHeight = cardHeight * 0.85;

  drawLeaf(0, 0, leafWidth, leafHeight, 0);
  drawLeaf(cardWidth - leafWidth, cardHeight, leafWidth, leafHeight, PI);
  pop();
}

function drawCardOrnaments(w, h, p) {
  stroke(colorSettings.decorColor);

  strokeWeight(utils.relSize(1));
  line(0, p*2, w, p*2); // top
  line(p*2, 0, p*2, h); // left
  line(0, h - p*2, w, h - p*2); // bottom
  line(w - p*2, 0, w - p*2, h); // right

  // top right corner needs something

  push();
  translate(0, h);
  translate(2*p, -2*p);
  rotate(-PI/2);

  const linesCount = 7;
  for (let index = 0; index < linesCount; index++) {
    rotate((1/linesCount) * PI/2)
    line(0, 0, p*(random(7, 12)), 0);    
  }  
  pop();

  // bottom left corner needs something
  push();
  translate(w, 0);
  translate(-2*p, 2*p);
  rotate(PI/2);

  for (let index = 0; index < linesCount; index++) {
    rotate((1/linesCount) * PI/2)
    line(0, 0, p*(random(7, 12)), 0);    
  }  
  pop();


}

function drawCard(x, y, w) {
  push();

  translate(x, y);

  const rFactor = random();
  if(rFactor > 0.75) {
    translate(w, 0);
    rotate(0.5 * PI);
  } else if (rFactor > 0.5) {
    translate(0, w);
    rotate(-0.5 * PI);
  }
  
  let cardWidth = w;
  let cardHeight = w;
  // let cardHeight = cardWidth * 1.25992; // cube root of two? sure.
  const heightToReturn = cardHeight;
  const cardPadding = cardWidth * 0.02;


  if(random() > 0.5) {
    drawTwoLeaves(cardWidth, cardHeight, cardPadding);
  } else {
    drawSucculent(cardWidth, cardHeight, cardPadding);
  }


  drawOutline(cardWidth, cardHeight, cardPadding);
  drawCardOrnaments(cardWidth, cardHeight, cardPadding);

  pop();
  return heightToReturn;
}

function draw() {
  background(allColors[0]);

  let y = 0;
  let offset = 0;
  const cardWidth = width/random([2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5]);

  while(y < height) {
    for (let x = 0; x < width; x+= cardWidth) {
      setColorScheme(cardWidth)
      offset = drawCard(x, y, cardWidth);
    }
    y += offset;  
  }
  
  addTexture();
}

function addTexture() {
  push();
  blendMode(OVERLAY);
  translate(width/2, height/2);
  rotate(random([0, PI/2, PI, 3*PI/2]));
  translate(-width/2, -height/2);

  image(texture, 0, 0, width, height);
  // image(texture, 0, 0, width, height);
  pop();
}

utils.attach({
  preload,
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});  
  