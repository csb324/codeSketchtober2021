
import p5 from 'p5';
import * as utils from '../../utils';
import { FlowerSquiggle } from '../../utils/Squiggle';

const pieceName = "Genuary day 21: Combine two previous pieces";

let allColors = ['#de6b48','#e5b181','#f4b9b2','#7dbbc3','#7f6a93','#7ca5b8'];
let colors = [];
let settings = {
  gridSize: 10,
};


function drawSquare(x, y) {
  let xStart = (x) * settings.cellSize;
  let yStart = (y) * settings.cellSize;
  push();
  translate(xStart, yStart);
  rotate(random(TWO_PI));
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





function setup() {  
  utils.standardCanvas();
  allColors = allColors.map((c) => color(c));

  reset();
  noLoop();
}

function reset() {
  utils.shuffleArray(allColors);
  colors = allColors.slice(0, 3);

  settings.gradients = generateGradients();
  settings.shapeScaleFactor = 3;
  settings.bs = (random(1, 2));
  settings.flowerRadius = settings.bs * utils.relSize(400);

  settings.cellSize = (settings.flowerRadius*2) / settings.gridSize;
}

function drawShape(x, y) {
  x += random(-1, 1);
  y += random(-1, 1);

  drawingContext.fillStyle = random(settings.gradients);
  let f = random([drawCircle, drawSquare, drawHex, drawTriangle, drawPentagon])
  f(x, y);
}


function seaOfShapes(x, y, radius) {
  push();
  noStroke();
  translate(x - radius, y - radius);

  for (let x1 = 0; x1 < settings.gridSize; x1++) {
    for (let y1 = 0; y1 < settings.gridSize; y1++) {

      const realX = x1 * settings.cellSize - settings.flowerRadius;
      const realY = y1 * settings.cellSize - settings.flowerRadius;

      if(dist(0, 0, realX, realY) > (settings.flowerRadius * 0.85)) {
        continue;
      }
      
      drawShape(x1, y1);
    }
  }
  pop();
}

function draw() {
  background(utils.paperColor);
  push();
  utils.zoomOut(0.4);

  seaOfShapes(utils.relSize(500), utils.relSize(500), settings.flowerRadius)

  push();
    stroke('#222');
    strokeWeight(utils.relSize(5));
    fill('#444');
    blendMode(OVERLAY);
    new FlowerSquiggle({bloomScale: settings.bs});
  pop();

  utils.zoomOut((1/0.4));
  stroke(utils.penColor);
  noFill();
  strokeWeight(utils.relSize(1));
  rect(utils.relSize(50), utils.relSize(50), utils.relSize(900), utils.relSize(900))
  pop();
}

utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});  
  