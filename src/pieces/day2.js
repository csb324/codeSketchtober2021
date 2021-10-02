import p5 from 'p5';
import * as utils from '../utils';

const colors = [
  "#7692fa",
  "#5355d3",
  "#9ad9ff",
  "#2685be",
  "#85d6d6",

  "#f7b81a",
  "#f98234",
  "#ea4cd5",
  "#e1444e",
  "#f892d8"
];


function setup() {  
  utils.standardCanvas();
  reset();
  noStroke();
  noLoop();
}

let skyGradient;
let cloudColor;
let midSkyColor;

function reset() {
  // lightColor = color(random(colors));
  const color1index = floor(random(colors.length - 1));
  const color2index = color1index + 1;

  midSkyColor = lerpColor(color(colors[color1index]), color(colors[color2index]), 0.5)

  skyGradient = drawingContext.createLinearGradient(0, 0, width, 0);
  skyGradient.addColorStop(0, colors[color1index]);
  skyGradient.addColorStop(1, midSkyColor);

  cloudColor = color(colors[color2index]);

  // highlightColor = color(random(highlightColors));
  // shadowColor = color(random(shadowColors));

}

function drawPlanet(p) {
  let planetLayers = floor(random(2, 5));
  const planetR = utils.relSize(random(200, 400));

  let planetColors = [random(colors), random(colors), random(colors)];

  strokeWeight(random(utils.relSize(40), planetR/planetLayers));
  strokeCap(SQUARE);
  drawingContext.setLineDash([4, random(10, 30)]);

  for (let index = planetLayers; index > 0; index--) {
    fill(random(planetColors));
    if (index == planetLayers) {
      noStroke();
    } else {
      stroke(random(planetColors));
    }
    ellipse(p.x, p.y, planetR * (index/planetLayers));
  }
}

function drawPlanets(frameWidth, frameHeight, offset) {
  push();
  let planetCenters = [];
  const boxHeight = frameHeight - (frameWidth/2);

  planetCenters.push({x: (width - frameWidth)/2 - offset, y: height - random(boxHeight)})
  planetCenters.push({x: width/2 + frameWidth/2 + offset, y: height - random(boxHeight)})

  let v = createVector(0, frameWidth/2);
  v.rotate(random(PI*0.5, PI * 1.5));

  planetCenters.push({x: v.x + width/2, y: v.y + (height - boxHeight)});

  for (let index = 0; index < planetCenters.length; index++) {
    // const planet = planetCenters[index];
    drawPlanet(planetCenters[index]);
  }
  pop();
}

function drawSky() {
  push();

  const frameWidth = random(0.6, 0.8) * width;
  const frameHeight = random(0.85, 0.99) * height;
  const boxHeight = frameHeight - (frameWidth/2);
  const offset = (width-frameWidth) * 0.15;

  drawPlanets(frameWidth, frameHeight, offset);

  translate((width - frameWidth) / 2, height-frameHeight);

  fill('white');
  push();
  translate(offset, 0);
  rect(0, frameHeight, frameWidth, -boxHeight);
  ellipse(frameWidth/2, frameWidth/2, frameWidth, frameWidth);
  rect(frameWidth/2 - offset, 0, offset, offset);

  translate(-offset * 2, 0);
  fill(random(colors));
  rect(0, frameHeight, frameWidth, -boxHeight);
  ellipse(frameWidth/2, frameWidth/2, frameWidth, frameWidth);
  rect(frameWidth/2 , 0, offset, offset);

  pop();


  drawingContext.fillStyle = skyGradient;

  rect(0, frameHeight, frameWidth, -boxHeight);
  ellipse(frameWidth/2, frameWidth/2, frameWidth, frameWidth);

  pop();

}

function drawCloud(cloudHeight) {
  const r = random(100);
  push();
  cloudColor.setAlpha(5)
  stroke(cloudColor);
  strokeWeight(height*0.08);
  noFill();
  const cloudMagnitude = random(height*0.2, height*0.4);
  const cloudMargin = width / 5;
  
  for (let index = 0; index < 30; index++) {
    beginShape();
    curveVertex(-20, cloudHeight);
    for (let x = -cloudMargin; x <= width + cloudMargin; x+= (width/4)) {
      let lift = (noise(x/400, r) - 0.5)*cloudMagnitude * 2;
      lift += noise(x/100, index + r) * cloudMagnitude * 0.5;
      let xOffset = (noise(x/20, index) * cloudMagnitude / 2) - 0.5;

      curveVertex(
        x + xOffset, 
        cloudHeight + lift )
    }
    curveVertex(width, cloudHeight);

    endShape();
  }
  pop();
}

function drawWithShadow(drawFunction, offsetX, offsetY, c, shadowC) {
  push();
  fill(shadowC);
  drawFunction();
  translate(offsetX, offsetY);
  fill(c);
  drawFunction();
  pop();
}

function drawBuilding(distanceAway) {
  const xPosition = random(width * 0.6) + width*0.2;
  cloudColor.setAlpha(255);

  const sizeFactor = 1 - distanceAway;

  const offsetX = random(utils.relSize(3), utils.relSize(8));
  const poleWidth = random(utils.relSize(9), utils.relSize(20)) * (sizeFactor);

  const w = utils.relSize(random(250, 400)) * sizeFactor;
  const h = w * random(0.1, 0.3);

  const baseHeight = map(distanceAway, 0, 1, height*0.4, height * 0.9);

  const hc = lerpColor(color('white'), midSkyColor, distanceAway);
  const sc = lerpColor(color('black'), midSkyColor, distanceAway);

  push();
  translate(xPosition, 0);

  for (let index = 5; index >= 0; index--) {
    const yPos = baseHeight - index*h/2;
    drawWithShadow(() => {
      ellipse(poleWidth/2, yPos, w * (index/13 + 1), h* (index/13 + 1));
    }, 0, offsetX, sc, hc);
  }

  drawWithShadow(() => {
    rect(0, baseHeight, poleWidth, height);
  }, offsetX, 0, hc, sc);
  
  pop();
}

function drawGrid() {
  const squares = floor(random(10, 30));
  const squareSize = width / squares;
  push();
  stroke('#dddddd');
  strokeWeight(utils.relSize(1));

  for (let x = 0; x < squares; x++) {
    line(0, (x+0.5) * squareSize, width, (x+0.5) * squareSize);
    line((x+0.5) * squareSize, 0, (x+0.5) * squareSize, height);

  }
  pop();
}

function draw() {
  background('#111111');

  drawGrid();

  drawSky();

  blendMode(OVERLAY);
  drawCloud(height * random(0.3));
  drawCloud(height * random(0.3, 0.7));
  drawCloud(height * random(0.7, 1));
  blendMode(BLEND);
  drawBuilding(random(0.8, 1));
  drawBuilding(random(0.8, 1));
  drawBuilding(random(0.8, 1));
  drawBuilding(random(0.6, 0.8));
  drawBuilding(random(0.4, 0.6));
  drawBuilding(random(0.1, 0.4));

}


utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressed
});
