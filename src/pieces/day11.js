import p5 from 'p5';
import utils, { rgba } from '../utils';

let flames;
let ground;

const timerMin = 10;

function wobblyLine(x1, y1, x2, y2, steps, jFactor) {
  const v = createVector(x2-x1, y2-y1);
  let subVector = v.copy().mult(1/(steps+1));


  let x = x1;
  let y = y1;
  beginShape();

  vertex(x, y);
  vertex(x, y);
  for (let i = 0; i < steps; i++) {
    const rotated = subVector.copy().rotate(map(noise(i, jFactor), 0, 1, -PI/4, PI/4));      
    x+= rotated.x;
    y+= rotated.y;
    curveVertex(x, y);
  }
  curveVertex(x2, y2);
  vertex(x2, y2);

  endShape();
}

class Flame {
  constructor(x, startWidth, startHeight) {
    this.x = x;
    this.width = startWidth;
    this.height = startHeight;
    this.maxHeight = this.height + utils.relSize(random(30, 100));
    this.minHeight = this.height - utils.relSize(random(30, 100));    
    this.growAmount = utils.relSize(2);
    this.j = random(100);
    this.jTimer = 0;

    this.decrease = utils.relSize(random(80, 200));

  }

  increment() {
    this.height += this.growAmount;
    if(this.height > this.maxHeight) {
      this.growAmount = utils.relSize(random(-5, -1));
    } else if(this.height < this.minHeight) {
      this.growAmount = utils.relSize(random(1, 3));
    }

    this.jTimer++;
    if(random() > 0 && this.jTimer > timerMin) {
      this.j+= 0.1;
      this.jTimer = 0;
    }
  }

  draw() {
    this.increment();
    noFill();
    // fill(utils.paperColor);
    // noStroke();
    stroke(utils.penColor);    

    let startX = this.x - (this.width/2);
    let topY = ground - this.height;
    let flameWidth = this.width;
    const steps = 5;    

    while(flameWidth > utils.relSize(40)) {

      wobblyLine(startX, ground, this.x, topY, steps, this.j);
      wobblyLine(startX + flameWidth, ground, this.x, topY,  steps, this.j);


      flameWidth -= this.decrease;
      startX = this.x - (flameWidth/2);
      topY += (this.decrease * this.width) / this.height;
      topY = min(topY, ground);
    }

  }
}



function setup() {  
  utils.standardCanvas();
  reset();
  // noLoop();
}

let squareSize;

function reset() {
  squareSize = 800; 
  ground = (1000-squareSize)/2 + squareSize;
  ground = utils.relSize(ground);

  background(utils.paperColor);
  flames = [
    new Flame(utils.relSize(500), utils.relSize(random(200, 400)), utils.relSize(500)),
    new Flame(utils.relSize(700), utils.relSize(random(150, 300)), utils.relSize(300)),
    new Flame(utils.relSize(300), utils.relSize(random(150, 300)), utils.relSize(300)),
    
  ];
}

function draw() {
  clear();
  background(utils.paperColor);
  // fill(utils.penColor);
  rect(utils.relSize((1000-squareSize)/2), utils.relSize((1000-squareSize)/2), utils.relSize(squareSize));
  flames.forEach((f) => f.draw());
}


utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressed
});
