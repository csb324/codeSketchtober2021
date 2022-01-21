import p5 from 'p5';
import * as utils from '../utils';

const pieceName = "Genuary day 20: Sea of shapes";

// let allColors = ['#22577a','#38a3a5','#57cc99','#80ed99','#c7f9cc','#131200'];
let allColors = ['#131200','#143c2d','#1b353d',
  '#22577a','#03b5aa','#83781b','#81a352',
  '#63E2C6','#3E885B'];
let colors = [];

let settings = {
  gridSize: 10,
};

function setup() {  
  utils.standardCanvas();

  allColors = allColors.map((c) => color(c));
  // inks = allColors.map((c) => new InkJar(c));
  noLoop();
  // frameRate(6);
  reset();
}

function generateGradients() {
  let gradients = [];

  for (let i = 0; i < 40; i++) {
    let xChange = random(0.4, 1);
    let yChange = random(0.4, 1);

    let color1 = random(colors);
    let color2 = random(colors);

    color1.setAlpha(random(0, 100));
    color2.setAlpha(random(100, 200));

    gradients.push(
      utils.createGradient(
        color1,
        color2,
        xChange / 10, 
        yChange / 10
      )
    )
  }
  return gradients;
}

function reset() {
  utils.shuffleArray(allColors);
  colors = allColors.slice(0, 3);
  
  settings.cellSize = width / settings.gridSize;
  settings.gradients = generateGradients();
  settings.shapeScaleFactor = 6;
  settings.getGradient = random([_getFrom1dNoise, _getFrom2dNoise, _getRandomG]);
  // settings.getGradient = _getFrom2dNoise;
}

function _getFrom1dNoise(x, y) {
  let gIndex = noise(y/10) * settings.gradients.length;
  return settings.gradients[Math.floor(gIndex)];
}
function _getFrom2dNoise(x, y) {
  let gIndex = noise(x/20, y/10) * settings.gradients.length;
  return settings.gradients[Math.floor(gIndex)];
}

function _getRandomG(x, y) {
  return random(settings.gradients);
}


function drawSquare(x, y) {
  let xStart = (x) * settings.cellSize;
  let yStart = (y) * settings.cellSize;

  push();
  rotate(random(TWO_PI));

  translate(xStart, yStart);

  rect(0, 0, settings.cellSize * settings.shapeScaleFactor);
  pop();
}

function drawHex(x, y) {
  drawPolygon(x, y, 6);
}
function drawTriangle(x, y) {
  drawPolygon(x, y, 3);
}
function drawPentagon(x, y) {
  drawPolygon(x, y, 5);
}


function drawPolygon(x, y, n) {
  push();
  let xp = (x + 0.5) * settings.cellSize;
  let yp = (y + 0.5) * settings.cellSize;
  translate(xp, yp);
  rotate(random(TWO_PI));

  let pointer = createVector(settings.cellSize * settings.shapeScaleFactor, 0);
  beginShape();
  for (let a = 0; a <= TWO_PI; a += (TWO_PI / n)) {
    pointer.setHeading(a);
    vertex(pointer.x, pointer.y);
  }
  endShape(CLOSE);

  pop();
}

function drawCircle(x, y) {
  push();
  let xp = (x + 0.5) *settings.cellSize;
  let yp = (y + 0.5) * settings.cellSize;
  translate(xp, yp);
  rotate(random(TWO_PI));
  ellipse(0, 0, settings.cellSize * settings.shapeScaleFactor);
  pop();
}

function drawShape(x, y) {
  x += random(-1, 1);
  y += random(-1, 1);

  drawingContext.fillStyle = settings.getGradient(x, y);
  

  let f = random([drawCircle, drawSquare, drawHex, drawTriangle, drawPentagon])
  f(x, y);
}

function draw() {
  let bg = color('#131200');
  bg.setAlpha(255)
  background(bg);

  clear();
  noStroke();

  let xNumbers =  Array.from(Array(settings.gridSize), (_,i) => i+1);
  let yNumbers =  Array.from(Array(settings.gridSize), (_,i) => i+1);

  utils.shuffleArray(xNumbers);
  utils.shuffleArray(yNumbers);

  const shapeScaleCutoff = 0.5;

  while (settings.shapeScaleFactor > shapeScaleCutoff) {
    settings.shapeScaleFactor *= random(0.4, 0.9);

    if(settings.shapeScaleFactor < shapeScaleCutoff) {
      settings.shapeScaleFactor *= random(0.4, 0.9);
      stroke('rgba(255, 255, 255, 0.3)');
    }

    for (let y = 0; y < settings.gridSize; y++) {
      for (let x = 0; x < settings.gridSize; x++) {
        drawShape(xNumbers[x]-1, yNumbers[y]-1);
      }
    }

  }

  settings.shapeScaleFactor = 6;


}


utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});  
  