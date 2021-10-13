import p5 from 'p5';
import * as utils from '../utils';

function setup() {  
  utils.standardCanvas();
  reset();
  // noLoop();
}

let seed;

function reset() {
  noFill();
  stroke(255);
  seed = random(10000);
}

const increment = 30;

function drawCurve(i) {
  // noStroke();
  beginShape();
  // fill(random(0, 14), random(0, 100), random(100, 255));
  for (let index = -200; index <= 1200; index+= increment) {
    const x = index + Math.sin((frameCount + i) / 60) * 150;
    const yNoise = (noise(
      (index + frameCount)/40
    )+ 1.5);
    
    let yWobble = Math.sin((600 - index)/random(120, 200));
    yWobble = map(yWobble, -1, 1, 78, 80);

    const yMod = noise(index / 100, i / 600) 
      * yNoise 
      * yWobble

    const y = i - yMod;


    curveVertex(
      utils.relSize(x), 
      utils.relSize(y)
    );    
  }

  vertex(width, height * 1.5);
  vertex(0, height * 1.5);
  endShape(CLOSE);
}

function draw() {
  background(0);
  randomSeed(seed);

  for (let index = 0; index < 1500; index += increment) {

    drawCurve(index);    
  }
}


utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressed
});
