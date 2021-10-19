// tiny 

import p5 from 'p5';
import * as utils from '../utils';
import { rgba } from '../utils';

let colors, colorSets, branchDark, branchLight, flowerColors;
let plantLocations = [];

function setup() {  
  utils.standardCanvas();
  noLoop();
  
  flowerColors = [
    rgba(233, 214, 207, 0.3),
    rgba(144, 139, 133, 0.3),
    rgba(161, 151, 146, 0.3),
  ];
  
  branchLight = rgba(78, 46, 28, 1.00);
  
  branchDark =  rgba(15, 9, 2, 1.00);

  const colors1 = [
    rgba(193, 176, 176, 0.05),
    rgba(233, 214, 207, 0.1),
    rgba(218, 190, 179, 0.05),
    rgba(254, 249, 244, 0.05),
    rgba(242, 155, 88, 0.05),
    rgba(194, 78, 37, 0.05),
    rgba(68, 29, 14, 0.05),
    rgba(37, 22, 17, 0.05),
    rgba(65, 53, 39, 0.05),
    rgba(40, 29, 16, 0.05),
    rgba(58, 47, 30, 0.1),
    rgba(37, 22, 17, 0.05),
    rgba(40, 29, 16, 0.05)
  ];

  colors = {
    sky: colors1,
    flowers: flowerColors,
    petals: [
      rgba(193, 176, 176, 0.05),
      rgba(233, 214, 207, 0.1),
      rgba(218, 190, 179, 0.05)
    ]
  }

  reset();

}

function reset() {
  clear();
  background(utils.paperColor);  
  plantLocations = [];
}

function getNoisedFromArray(array, query, noiseFactor) {
  let d = 0;
  for (let index = 0; index < array.length; index++) {
    d += (noise(noiseFactor, index)*2);

    if(d > query) {
      return array[index];
    }
  }
  return array[array.length - 1];
}


function drawSkyline() {
  const skylineW = utils.relSize(300);
  const skylineH = utils.relSize(200);
  ellipseMode(CENTER);

  for (let x = 0; x < skylineW; x+= utils.relSize(1)) {

    // const treeLine = map(noise(x/100), 0, 1, 0.3, 0.5) * skylineH;

    for (let y = 0; y < skylineH; y+= utils.relSize(1)) {
      const yAdjusted = (y/skylineH) * colors.sky.length;

      fill(getNoisedFromArray(colors.sky, yAdjusted, x/30));
      ellipse(x, y, map(noise((x+y)/100), 0, 1, utils.relSize(70), utils.relSize(100)));
    }
  }

  const img = get(0, 0, width/5, height/5);
  return img;
}

function drawPlant(xStart, maxHeight) {
  const pointer = createVector(xStart, height + utils.relSize(40));
  const direction = createVector(0, utils.relSize(-100));
  direction.mult(randomGaussian(1, 0.3));
  direction.rotate(random(-0.15, 0.15) * PI);

  const xOffset = utils.relSize(random(-4, 4));

  let branches = [];

  noFill();
  stroke(branchDark);
  strokeWeight(utils.relSize(random(Math.abs(xOffset), Math.abs(xOffset)*3)));

  while(pointer.y > maxHeight && branches.length < 50) {
    const segment = {x: pointer.x, y: pointer.y, x2: pointer.x + direction.x, y2: pointer.y + direction.y};
    branches.push(segment);
    if(random() > 0.5) {
      const segment2 = {
        x: pointer.x, 
        y: pointer.y, 
        x2: pointer.x + utils.relSize(random(-40, 40)), 
        y2: pointer.y - utils.relSize(random(30, 60))};
      branches.push(segment2);
      plantLocations.push(segment2);
    }   
    pointer.add(direction);
    direction.mult(randomGaussian(1, 0.1));
    direction.rotate(random(-0.15, 0.15) * PI);
  }

  branches.forEach((b) => line(b.x, b.y, b.x2, b.y2));

  push();  
  stroke(branchLight);
  translate(xOffset, 0);
  branches.forEach((b) => line(b.x, b.y, b.x2, b.y2));
  pop();
}

function drawPlants() {
  const plantCount = 30;
  const plantDensity = random(0.5);
  plantLocations = [];
  for (let index = 0; index < plantCount; index++) {
    drawPlant(width/plantCount * (index+0.5), height * random( 0.5, 1));
    drawPlant(width/plantCount * (index+0.5), height * random( 0.1, 1));
  }
  plantLocations.forEach((pl) => {
    if(random() > plantDensity) {
      return;
    };
    drawFlower(pl);
  })

}

function drawFlower(location) {
  stroke(random(colors.flowers));
  strokeWeight(utils.relSize(3));

  let r = utils.relSize(random(30, 50));

  let petalCount = 100;
  let inset = true;

  if(random() > (location.y / height)) {
    petalCount = 20;
    r = utils.relSize(random(10, 30))
    stroke(random([branchLight, branchDark]));
    strokeWeight(utils.relSize(2));
    inset = false;
  }
  let w = r;
  let h = r * random(0.85, 1.1);

  for (let index = 0; index < petalCount; index++) {
    // rotate(random(2*PI));
    const angle = random(2*PI);    
    const xElement = w * random(0.9, 1.1) * cos(angle);
    const yElement = h * random(0.9, 1.1) * sin(angle);

    if(inset) {
      line(location.x + xElement * random(0.1, 0.4) + random(-5, 5),  random(-5, 5) + location.y + yElement * random(0.3), location.x + xElement, location.y + yElement);
    } else {
      line(location.x, location.y, location.x + xElement, location.y + yElement);
    }
  }
  if(inset) {
    noStroke();  
    for (let index = 0; index < 10; index++) {
      fill(random(colors.petals));
      ellipse(location.x, location.y, w * random(0.9, 1.9), h * random(0.9, 1.9));      
    }
  
  }
}

function drawVignette() {
  blendMode(MULTIPLY);
  const g = utils.createRadialGradient(['#ffffff', '#ffffff', 'rgba(140, 128, 136, 1.00)'], width);
  drawingContext.fillStyle = g;
  translate(width/2, height/2);
  rect(-width/2, -height/2, width, height);
}

function draw() {
  blendMode(BLEND);
  background(utils.paperColor);
  noStroke();

  const skyline = drawSkyline();
  clear();

  push();
  const s = 0.6;
  scale(s, s);
  rotate(0.1);  

  drawPlants();

  const p = get(0, 0, width*s, height*s);

  pop();
  image(skyline, 0, 0, width, height);
  image(p, 0, 0, width, height);  

  drawPlants();
  drawVignette();
}

utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressed
});
