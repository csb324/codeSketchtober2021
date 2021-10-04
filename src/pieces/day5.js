import p5 from 'p5';
import * as utils from '../utils';

let leafColors = [];
let squares, squareSize;
let t = 0;
let maxDistance;
let vines;
let bgColor;
let shouldRegrow;

function preload() {
}

function setup() {  
  utils.standardCanvas();


  leafColors = [  'rgba(157, 155, 180, 0.2)',
    'rgba(178, 137, 97,  0.2)',
    'rgba(187, 185, 177,  0.2)',
    'rgba(190, 171, 155,  0.2)'
  ].map((c) => {
    return color(c);
  })

  bgColor = color('#0f0f0f');
  bgColor.setAlpha(1);

  squares = floor(random(8, 12));

  squareSize = width / (squares + 2);
  maxDistance = utils.relSize(20);

  reset();
}

let startingVine;
let shouldRotate = false;
function swirl() {
  shouldRotate = true;
}

function reset() {
  clear();

  background('#0f0f0f');
  shouldRegrow = true;
  noStroke();
  startingVine = {x: height/2, y: squareSize};

  vines = [];
  vines.push(new Vine(startingVine.x, startingVine.y));
}

function drawGridOld() {
  push();
  translate(squareSize/2, squareSize/2);
  stroke(bgColor);
  strokeWeight(utils.relSize(1));
  for (let x = 0; x < squares; x++) {
    line(0, (x+0.5) * squareSize, width, (x+0.5) * squareSize);
    line((x+0.5) * squareSize, 0, (x+0.5) * squareSize, height);
  }
  pop();
}

function getGridXY(x, y) {
  if(y % 2) {
    return {x: squareSize*x, y: squareSize*y};
  } else {
    x+= 1;
    return {x: squareSize*x, y: squareSize*y};
  }
}

function drawGrid() {
  fill('red');
  for(let x = 0; x < squares; x++) {
    for(let y = 0; y < squares; y++) {
      const p = getGridXY(x, y);
      ellipse(p.x, p.y, 5, 5);      
    }
  }
}

class Vine {
  constructor(x, y) {
    this.cursor = createVector(x, y);

    this.target = this.cursor.copy();

    this.colorIndex = -1;
    this.color = random(leafColors);
    this.toDelete = false;
    this.myIndex = vines.length;
  }

  createTarget() {
    const r = random();
    let newDirection = createVector(0, squareSize);

    if(r < 0.1) {
      newDirection.setMag(createVector(squareSize, squareSize).mag());
      newDirection.rotate(random([0, PI/2, PI, PI*1.5]));
    } else if (r < 0.55) {
      newDirection.rotate(PI * random([0.25, 0.75, 1.25, 1.75]));
      newDirection.mult(floor(random(squares/2)));
    }
    
    this.target = newDirection.copy().add(this.cursor);
    if(this.target.x > width || this.target.y > height || this.target.x < 0 || this.target.y < 0) {
      this.target.sub(newDirection);
      this.target.sub(newDirection);
    }
  }


  setUpTarget() {
    if(this.target.dist(this.cursor) < maxDistance) {
      this.colorIndex += 1;
      if(this.colorIndex == leafColors.length) {
        this.toDelete = true;
        return;
      } else {
        this.color = leafColors[this.colorIndex];
      }
      this.createTarget();
      if(shouldRegrow && random() > 0.7) {
        vines.push(new Vine(this.cursor.x, this.cursor.y));
      }
    }
  }

  draw() {
    const maxRotation = 0.05; 
    this.setUpTarget();
    let direction = this.target.copy();
    direction.sub(this.cursor);
    direction.setMag(maxDistance * random());
    direction.rotate(randomGaussian(0, maxRotation) * PI);
    this.drawLeaf(direction);

  }

  drawLeaf(direction) {
    push();
    stroke(this.color);

    // vine
    strokeWeight(utils.relSize(5));
    line(this.cursor.x, this.cursor.y, this.cursor.x + direction.x, this.cursor.y + direction.y);
    this.cursor.add(direction);

    // leaf
    strokeWeight(utils.relSize(random(10)));
    line(this.cursor.x, this.cursor.y, this.cursor.x + (direction.x * random()), this.cursor.y + (direction.y * random()));

    pop();
  }
}

let lastFrame;
const scaleFactor = 0.9994;
function drawLast() {
  if (lastFrame) {
    if(frameCount % 4 == 0) {
      translate(width/2, height/2);
      translate(0, utils.relSize(1));
      scale(scaleFactor, scaleFactor)
      rotate((noise(frameCount/100) - 0.5) / 500);
    
  
      if(shouldRotate) {
        shouldRotate = false;
        rotate(PI/2);
      }
      image(lastFrame, -width/2, -height/2);
      translate(-width/2, -height/2);
  
    }
  }
}

function draw() {
  lastFrame = get();
  drawLast();

  push();
  // drawGrid();
  blendMode(SCREEN);
  vines.forEach((v) => v.draw());
  vines = vines.filter((v) => !v.toDelete);  
  vines = vines.slice(0, 10); // just so there aren't too many 
  if(vines.length == 0) {
    if (shouldRegrow) {
      vines.push(new Vine(startingVine.x, startingVine.y));
    } else {
      frameRate(0);
    }  
  }

  pop();

}

function keyPressed() {
  if(key == 'd' || key == 'D') {
    shouldRegrow = false;
  }
  utils.standardKeyPressed();  
}

utils.attach({
  setup,
  preload,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(swirl),
  keyPressed: keyPressed
});
