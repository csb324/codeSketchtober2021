import p5 from 'p5';
import * as utils from '../../utils';
import { FlowerSquiggle } from '../../utils/Squiggle';

let f;

function preload() {
  f = loadFont('/fonts/spacemono.ttf');
}

function setup() {  
  utils.standardCanvas();
  reset();
  noLoop();
  textFont(f);
}

function reset() {
}

function draw() {
  background(utils.paperColor);
  stroke(utils.penColor);
  strokeWeight(utils.relSize(4));
  noFill();

  translate(0, utils.relSize(-100))
  utils.zoomOut(0.4);

  const f = new FlowerSquiggle();

  utils.zoomOut((1/0.4));
  // strokeWeight(utils.relSize(1));
  // rect(utils.relSize(50), utils.relSize(150), utils.relSize(900), utils.relSize(900));
  noStroke();
  textAlign('center');
  fill(utils.penColor);
  textSize(utils.relSize(20));
  f.describe(utils.relSize(500), utils.relSize(1010))
}

const pieceName = "Single Curve";

utils.attach({
  setup,
  draw,
  preload,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});
