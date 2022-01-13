import p5 from 'p5';
import * as utils from '../utils';
// import rectanglePack from '../utils/rectanglePack';
import Cathedral from '../utils/Cathedral';

function setup() {  
  utils.standardCanvas();
  reset();
  noLoop();
}

let settings = {};
let computed = {};

function reset() {
  settings.buildingHeight = random(600, 800);
  settings.buildingWidth = random(700, 850);
  settings.entranceWidth = random(100, 200);
  settings.entranceHeight = random(500, settings.buildingHeight);

  computed.xPadding = (1000 - settings.buildingWidth)/2;
  computed.yPadding = (1000 - settings.buildingHeight)/2;
  computed.sideWidth = (settings.buildingWidth - settings.entranceWidth) / 2;
  computed.entranceStartX = (500 - (settings.entranceWidth/2));
  computed.entranceStartY = (1000 - settings.entranceHeight - computed.yPadding);
}

function draw() {
  background(utils.paperColor);
  noFill();
  stroke(utils.penColor);
  rect(utils.relSize(50), utils.relSize(50), utils.relSize(900), utils.relSize(900))
  const c = new Cathedral(settings, computed);
  utils.zoomOut(0.9);
  c.draw();
}

const pieceName = "Architecture";

utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});