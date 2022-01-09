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

const doorFunctions = [doorSquare];

export default doorFunctions;