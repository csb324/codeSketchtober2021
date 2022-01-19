
import p5 from 'p5';
import * as utils from '../utils';

const pieceName = "Genuary day 18: VHS";
let vhsShader;
let lastFrame;
let squares;
let offsets = {
  r: 0,
  g: 0,
  b: 0
}


function preload() {
  vhsShader = loadShader('/shaders/g2.vert', '/shaders/g18.frag');
}

function setup() {  
  canvas = utils.standardCanvas({ renderer: WEBGL });
  frameRate(24);
  reset();
}

function resetOffsets() {
  let r = random(1, 100);
  offsets = {
    r: r,
    g: r,
    b: r
  };
}

function reset() {
  // squareSize = width / resolution;
  background('black');
  lastFrame = get();
  squares = random(40, 100);
  resetOffsets();
  noStroke();
  fill('black');
}

function draw() {
  clear();
  rect(0, 0, width, height);
  vhsShader.setUniform('tex0', lastFrame);
  vhsShader.setUniform('time', frameCount);
  vhsShader.setUniform('redFactor', offsets.r);
  vhsShader.setUniform('greenFactor', offsets.g);
  vhsShader.setUniform('blueFactor', offsets.b);
  vhsShader.setUniform('xFactor', map(noise(frameCount/100), 0, 1, 0.5, 1.5));
  vhsShader.setUniform('squares', squares);  

  if(random() < 0.01) {
    resetOffsets();
  }
  offsets.r += randomGaussian(0, 0.01);
  offsets.g += randomGaussian(0, 0.01);
  offsets.b += randomGaussian(0, 0.01);

  shader(vhsShader);
  lastFrame = get();
}




utils.attach({
  setup,
  draw,
  preload,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});  
  