import utils from './index';

// DOOR FUNCTIONS
function doorSquare() {
  const knobHeight = random();
  const knobCloseness = random(0.05, 0.2);
  return function(w, h) {
    w = utils.relSize(w);
    h = utils.relSize(h);

    rect(0, 0, w/2, h);
    rect(w/2, 0, w/2, h);

    line(w * (0.5-knobCloseness), h*knobHeight, w * (0.5-knobCloseness), h * knobHeight * knobHeight);
    line(w * (0.5+knobCloseness), h*knobHeight, w * (0.5+knobCloseness), h * knobHeight * knobHeight);
  }
}

function doNothing() {
  return function() {};
}

function steeple() {
  return function(w, h) {
    w = utils.relSize(w);
    h = utils.relSize(h);

    beginShape();
    vertex(0, h);
    vertex(w/2, h*-0.5);
    vertex(w, h);
    endShape();
  }
}

function manySteeple() {
  const subHeight = random(0.4, 1);

  return function(w, h) {
    fill(utils.paperColor);
    steeple()(w, h);

    w = utils.relSize(w);
    h = utils.relSize(h);

    w = w/2;
    let sh = subHeight * h;

    beginShape();
    vertex(0, h);
    vertex(w/2, h - sh);
    vertex(w, h);
    endShape();

    beginShape();
    vertex(w, h);
    vertex(w*1.5, h - sh);
    vertex(w*2, h);
    endShape();
    
  }
}

const roofFunctions = [doNothing, steeple, manySteeple];

export default roofFunctions;