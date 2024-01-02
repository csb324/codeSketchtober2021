
import p5 from 'p5';
import * as utils from '../../utils';
import RectangleTree from '../../utils/RectangleTree';

const pieceName = "Genuary day 30: Organic looking, rectangles only";
// let allColors = [

let allColors = ['#a1b5d8','#cdc392','#1d1e2c','#5c6f68','#27474e','#003b36','#482728','#772e25','#b15e6c','#d36135','#36462b','#514e1c','#785b23','#c2803e','#f0c58a'];
let selectedColors;

let mainCanvas, d, dotFactor;

const smallCanvasSize = 100;
const largeCanvasSize = 1000;

const highAlpha = 110;
const lowAlpha = 60;

function setup() {  
  utils.standardCanvas();
  d = createGraphics(smallCanvasSize, smallCanvasSize);
  d.noLoop();
  mainCanvas = createGraphics(largeCanvasSize, largeCanvasSize);
  mainCanvas.noLoop();
  reset();
  noLoop();
}

function reset() {
  allColors = allColors.map((c) => color(c));
  utils.shuffleArray(allColors);
  selectedColors = allColors.slice(0, random(3, 6));

  dotFactor = random(0.05, 0.2);
}

function getColor(x, y, canvasWidth, highA, lowA) {
  let cIndex = map(y + noise(x+y), 0, canvasWidth + 1, 0, selectedColors.length - 1);
  let c = selectedColors[Math.floor(cIndex)];
  let newColor;

  if(random() < 0.02) {
    newColor = random(selectedColors);
    newColor.setAlpha(highA);
  } else if(random() > 0.8) {
    newColor = c.levels.slice(0, 3);
    newColor = newColor.map((level) => randomGaussian(level, 2));
    newColor = color(newColor);
    newColor.setAlpha(lowA);  
  } else {
    let secondColor;
    if(Math.floor(cIndex) == selectedColors.length - 1) {
      secondColor = c;
    } else {
      secondColor = selectedColors[Math.ceil(cIndex)];
    }

    newColor = lerpColor(c, secondColor, fract(cIndex) + ( noise(x+y) - 0.5));
    newColor.setAlpha(highA);
  }

  return newColor;
}

function setUpArea(c) {
  c.noStroke();
  c.rectMode(CENTER);
  c.translate(c.width/2, c.height/2);
  c.scale(0.7);
  c.translate(-c.width/2, -c.height/2);
}

function drawLayer(canvas, factor, previousImage = false) {
  canvas.push();
  canvas.background(utils.paperColor);
  console.log(previousImage);
  if(previousImage) {
    canvas.image(previousImage, 0, 0, canvas.height, canvas.width);
  }
  setUpArea(canvas);
  drawBlobs(canvas, factor);
  canvas.pop();
  return canvas.get();
}

function drawBackLayer() {
  return drawLayer(d, 1);
}

function drawMiddleLayer(backLayer) {
  return drawLayer(mainCanvas, dotFactor, backLayer);
}

function drawRectangleTree() {
  const t = new RectangleTree();
  t.draw();
}

function draw() {
  background(utils.paperColor);
  let img = drawBackLayer();
  img = drawMiddleLayer(img);

  utils.zoomOut(0.9);
  image(img, 0, 0, width, height);

  drawRectangleTree();
  if(random() < 0.1) {
    drawRectangleTree();
  }

}

function drawBlobs(canvas, ratioToDraw) {

  console.log(canvas.width);

  const rects = [];
  const rectDistance = canvas.width / 25;

  let hA = map(ratioToDraw, 0, 1, 200, highAlpha);
  let lA = map(ratioToDraw, 0, 1, highAlpha, lowAlpha);

  for (let x = 0; x < canvas.width; x+= rectDistance) {
    for (let y = 0; y < canvas.width; y+= rectDistance) {
      let w = noise(x, y/10, ratioToDraw);
      let h = noise(y + 1000, x/10, ratioToDraw);
      w = map(w, 0, 1, rectDistance*2, rectDistance*8);
      h = map(h, 0, 1, rectDistance*2, rectDistance*8);

      let a = map(noise(x/y, y+x, rectDistance), 0, 1, 0, TWO_PI);

      let c = getColor(x, y, canvas.width, hA, lA);

      if(ratioToDraw < 1) {
        w *= ratioToDraw * random(0.5, 1);
        h *= ratioToDraw * random(0.5, 1);
      }

      rects.push({x, y, w, h, c, a});
    }
  }

  utils.shuffleArray(rects);

  rects.forEach((r) => {
    if(random() < ratioToDraw) {
      canvas.fill(r.c);
      if(ratioToDraw < 1) {
        canvas.push();
        canvas.translate(r.x, r.y);
        canvas.rotate(r.a);
        canvas.rect(0, 0, r.w, r.h);
        canvas.pop();

      } else {
        canvas.rect(r.x, r.y, r.w, r.h);  

      }
    }
  })

}


utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});  
  