import p5 from 'p5';
import * as utils from '../utils';

// we are straight up starting over.

function setup() {  
  utils.standardCanvas();
  reset();
  noLoop();
}

function reset() {
  clear();
}

function draw() {
  rect(0, 0, width, height);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(20);
  text("coming soon", width/2, height/2);
}


utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressed
});
