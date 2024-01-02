
import p5 from 'p5';
import * as utils from '../utils';

const pieceName = "#WCCChallenge: Instrument";

function setup() {  
  utils.standardCanvas();
  reset();
  noLoop();
}

function reset() {
  fill(random(55) + 100);    
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
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});  
  