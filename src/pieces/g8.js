import p5 from 'p5';
import * as utils from '../utils';
import { FlowerSquiggle } from '../utils/Squiggle';

function setup() {  
  utils.standardCanvas();
  reset();
  noLoop();
}



function reset() {
}


function draw() {
  background(utils.paperColor);
  stroke(utils.penColor);
  strokeWeight(utils.relSize(2));
  noFill();

  translate(0, utils.relSize(-100))
  utils.zoomOut(0.4);
  new FlowerSquiggle();
  utils.zoomOut((1/0.4));
  strokeWeight(utils.relSize(1));
  rect(utils.relSize(50), utils.relSize(150), utils.relSize(900), utils.relSize(900))
}

const pieceName = "Single Curve";

utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});
