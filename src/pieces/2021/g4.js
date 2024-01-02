import p5, { Color } from 'p5';
import * as utils from '../../utils';

const increment = 10;
let settings = {
  density: 1,
  iterations: 1,
  ratio: 0.2,
  pebbleSlices: 60,
  hold: false
};

let colorStack;
const colorSets = [
  {
    background: '#12100E',
    stack: ["#ddd5d0", "#cfc0bd", "#b8b8aa", "#7f9183", "#586f6b", "#a30b37", "#704e2e"]
  },
  {
    background: '#00100b',
    stack: ["#92dce5", "#ff66d8", "#f8f7f9", "#925e78", "#f05365", "#fabc2a",  "#f7ec59" ]
  },
  {
    background: '#00100b',
    stack: ["#7d4e57", "#b55340", "#f1a77f", "#eeca86", "#70b2a1", "#5f7470" ]
  }

]

function resetSettings() {
  if (settings.hold) {
    return;
  }
  settings.seed = random(1, 100000000);

  settings.density = Math.floor(random(1, 5));
  settings.iterations = Math.floor(random(1, 2));
  if(settings.density == 1) {
    settings.iterations = 1
  }

  settings.ratio = settings.density / 4.0;

  settings.pebbleSlices = random(30, 80);
  settings.flowImpact = random(0.001, 0.05);
  settings.spacing = random(2, 7);
}

function setup() {  
  utils.standardCanvas();
  reset();
  // noLoop();
}


function flowAngle(x, y) {
  return map(noise(x / 400, y / 400, sin(frameCount / 100)/5), 0, 1, -PI, PI);
}

function flowVector(x, y) {
  const a = flowAngle(x, y);
  const v = createVector(1, 0);
  v.rotate(a);
  return v;
}

function flowField() {
  // noStroke();
  for (let x = (increment/2); x < 1000; x+= increment) {
    for (let y = (increment/2); y < 1000; y+= increment) {
      const v = flowVector(x, y);
      const xNext = x + v.x;
      const yNext = y + v.y;
      line(x, y, xNext, yNext);
    }  
  }
}

class Drip {
  constructor(startY, force = 5) {
    this.position = createVector(utils.relSize(0), utils.relSize(startY));
    this.direction = createVector(utils.relSize(increment * force), 0);
  }

  draw() {
    noFill();
    beginShape();

    vertex(this.position.x, this.position.y);
    vertex(this.position.x, this.position.y);

    let i = 0;

    while(i < 10000 && this.position.x < width && this.position.y < width && (this.position.x * this.position.y) >= 0) {
      this.update();
      i++;
    }

    this.update();
    this.update();

    endShape();
  }

  update() {
    // const a = flowAngle(this.position.x, this.position.y);
    this.direction.rotate(flowAngle(this.position.x, this.position.y) / 10);
    this.position.add(this.direction);

    curveVertex(this.position.x, this.position.y);
  }
}

const DEBUG = false;
function debugVector(v) {
  if (!DEBUG) { return };

  push();
  fill('black');
  stroke('black');
  strokeWeight(5);
  point(v.x, v.y);
  pop();  
}

class Pebble {
  constructor(startX, startY, r, stepsOut) {
    this.position = createVector(utils.relSize(startX), utils.relSize(startY));    
    // this.direction = createVector(0, utils.relSize(-increment * stepsOut));
    // this.direction.rotate(TWO_PI / (pebbleSlices*2));

    this.stepsOut = stepsOut;
    this.distanceMoved = 0;
    this.radius = utils.relSize(r);
  }

  getPointFromAngle(angle) {
    const radiusVector = createVector(this.radius, 0);
    radiusVector.setHeading(angle);
    // debugVector(radiusVector); 

    for (let index = 0; index < this.stepsOut; index++) {
      let flowImpact = flowVector(radiusVector.x + this.position.x, radiusVector.y + this.position.y);
      flowImpact.setMag(this.radius * settings.flowImpact);
      radiusVector.add(flowImpact);
    }
    debugVector(radiusVector); 

    const p = this.position.copy();
    p.add(radiusVector);

    return p;
  }

  draw() {
    noFill();
    beginShape();

    const start = this.getPointFromAngle(0);
    vertex(start.x, start.y);

    const amountToRotate = TWO_PI / settings.pebbleSlices;
    for (let d = 0; d < TWO_PI; d+= amountToRotate) {
      const p = this.getPointFromAngle(d);
      curveVertex(p.x, p.y);
    }
    vertex(start.x, start.y);

    endShape(CLOSE);
  }
}

function flowLines(xPos, yPos) {
  push();
  let lastW = 0;

  for (let loopIndex = 0; loopIndex < 4; loopIndex++) {
    for (let x = 0; x < colorStack.length; x++) {
      let v = (x + loopIndex * 6);

      const w = random(1, 10 + v/2);
      // strokeWeight(utils.relSize(w));
      const r = random(lastW - (w*2), lastW);
      if(isDrawable(loopIndex, r)) { 
        const c = semiRandomColor(x);
        // c.setAlpha(100);
        stroke(c);
        noFill();
        strokeWeight(utils.relSize(w))
        const d = new Pebble(xPos, yPos, r, v);
        d.draw();
      }
      lastW += w*settings.spacing;
    }
  }

  pop();
}

function changeSettings(newSettings) {
  settings = {...settings, ...newSettings};

  draw();
}

function semiRandomColor(x) {
  let colorIndex = Math.floor(x + random(-1, 1));
  if (colorIndex == colorStack.length) {
    colorIndex = 0;
  }
  if (colorIndex < 0) {
    colorIndex = 0;
  }

  return color(colorStack[colorIndex]);
}

function isDrawable(loopIndex, r) {
  // if(loopIndex < 1) {
  //   return false;
  // }
  if (r < 100) {
    return false;
  }
  if(settings.iterations > 1) {
    return true
  }

  return (random() < settings.ratio);
}

function reset() {
  resetSettings();
  const colorSet = random(colorSets);
  colorStack = colorSet.stack;  
  settings.bg = colorSet.background;
}

function draw() {
  randomSeed(settings.seed)
  background(settings.bg);
  for (let index = 0; index < settings.iterations; index++) {
    flowLines(500, 500);    
  }
}

window.changeSettings = changeSettings;

utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressed
});
