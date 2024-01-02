import p5 from 'p5';
import * as utils from '../../utils';

let r;

function setup() {  
  utils.standardCanvas();
  reset();
  noLoop();
  r = color('red')
  r.setAlpha(50);
  rectMode(RADIUS);
}

let t = 0;
let settings = {};
const colorOptions = ["#02A5FF"," #FF3300","#66cc33","#ffcc00"];

function flowAngle(x, y) {
  return map(noise(x / settings.noiseDepth, y / settings.noiseDepth, frameCount/100), 0, 1, -PI, PI);
}
function flowVector(x, y) {
  return p5.Vector.fromAngle(flowAngle(x, y)).setMag(settings.flowMag);
}


function distortionVector(x, y) {
  let v = flowVector(x, y);

  for (let index = 0; index < settings.distortionZones.length; index++) {
    const zone = settings.distortionZones[index];
    const d = dist(x, y, zone.x, zone.y);
    if(d < Math.abs(zone.power)) {

      const towardZone = createVector(x, y).sub(createVector(zone.x, zone.y));
      towardZone.setMag(map(d, 0, Math.abs(zone.power), settings.flowMag*2, 0));
      if(zone.power > 0) {
        towardZone.mult(-1);
      }
      // line(utils.relSize(x), utils.relSize(y), utils.relSize(x - towardZone.x), utils.relSize(y - towardZone.y))
      v.add(towardZone);
    }
  }

  return v;
}

function randomColorChange() {
  const minX  = random(0, 1000);
  const maxX = random(minX, min(1000, minX + 200));
  const yInstead = random([true, false]);
  const c = random(colorOptions);

  return {
    condition: function(x, y) {
      if (yInstead) {
        return (y > minX && y < maxX);        
      }
      return (x > minX && x < maxX);
    },
    effect: function(x, y) {
      fill(c);
    }
  }
}
function randomShiftSection() {
  const minX  = random(0, 1000);
  const maxX = random(minX, min(1000, minX + 200));
  const yInstead = random([true, false]);
  const withOrAgainst = random([true, false]);
  const amount = random(-0.4, 0.4);

  return {
    condition: function(x, y) {
      if (yInstead) {
        return (y > minX && y < maxX);        
      }
      return (x > minX && x < maxX);
    },
    effect: function(x, y) {
      if(withOrAgainst) {
        return translate(width * amount, 0);
      }
      return translate(0, width * amount);

    }
  }
}

function randomDistortionZone() {
  return {
    x: random(1000),
    y: random(1000),
    power: random(500, 1000) * random([1, -1])
  }
}

function reset() {
  t = 0;
  noiseSeed(random(100000));
  settings.stepsAway = random(4, 10);
  settings.flowMag = random(5, 10);
  settings.noiseDepth = random(300, 600);

  const colorChanges = random(1, 8);
  settings.colorChanges = [randomColorChange()];
  for (let index = 0; index < colorChanges; index++) {
    settings.colorChanges.push(randomColorChange());  
  }

  settings.increment = random(5, 10);

  const shifts = random(1, 8);
  settings.shifts = [];
  for (let index = 0; index < shifts; index++) {
    settings.shifts.push(randomShiftSection());  
  }

  const zones = random(0, 4);
  settings.distortionZones = [];
  for (let index = 0; index < zones; index++) {
    settings.distortionZones.push(randomDistortionZone());  
  }

  settings.miscSquareCount = random(7, 30);
  settings.mods = [...settings.shifts, ...settings.colorChanges];

  console.log(settings);

  // settings
}


function drawPoint(vector, originalX, originalY) {
  push();
  let x = vector.x;
  let y = vector.y;
  
  for (let index = 0; index < settings.mods.length; index++) {
    const mod = settings.mods[index];
    if(mod.condition(originalX, originalY)) {
      mod.effect(originalX, originalY);
    }
  }
  noStroke();


  square(utils.relSize(x), utils.relSize(y), utils.relSize(settings.increment * 0.33));


  pop();
}

function drawSquare() {

  for (let x = 0; x < 1000; x+= settings.increment) {
    for (let y = 0; y < 1000; y+= settings.increment) {
      let dot = createVector(x, y);

      for (let i = 0; i < settings.stepsAway; i++) {
        let d = distortionVector(dot.x, dot.y);
        
        dot.add(d);
      }

      drawPoint(dot, x, y);
    }
  }

}

function draw() {
  background(utils.paperColor);
  fill(utils.penColor);
  noStroke();
  // stroke(utils.penColor);
  utils.zoomOut(0.5);

  t++;

  drawSolids();
  drawSquare();
}

function drawSolids() {

  push();
  // blendMode(SCREEN)
  for (let index = 0; index < settings.miscSquareCount; index++) {
    let c = color(random(colorOptions));
    c.setAlpha(100);
    let x = random(0, 1000);
    let y = random(0, 1000);
    fill(c);
    square(utils.relSize(x), utils.relSize(y), utils.relSize(settings.increment * random(1, 5)));    
  }
  pop();

}

const pieceName = "Destroy a square";

utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});
