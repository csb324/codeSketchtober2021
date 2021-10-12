import p5 from 'p5';
import * as utils from '../utils';

let r;
let t = 0;

class SmallBoi {
  constructor(startingAngle, radius, criminal = false) {
    this.criminal = criminal;
    this.angle = startingAngle;
    this.radius = randomGaussian(radius, 10);
    this.atTimes = {};
    this.criminal = criminal;

    if(criminal) {
      this.xSeed = random(2*PI);
      this.ySeed = random(2*PI);
      this.counter = 0;
      this.setFactors();
    }
  }

  draw(time) {
    if(this.criminal) {
      this.drawCrime(time);      
    } else {
      this.drawNormal(time);
    }
  }

  setFactors() {
    this.xFactor = ceil(noise(this.counter/4) * 4);
    this.yFactor = ceil(noise(10, this.counter/4) * 4);  
  }

  drawCrime(time) {

    if(time == 0) {
      this.counter++
      this.setFactors();
    } 

    const v = createVector(0, this.radius * 0.7);
    v.rotate(this.angle + time);
    // fill('green');
    rect(v.x * (Math.cos(time*this.xFactor) + 1), v.y * (Math.sin(time*this.yFactor) + 1), utils.relSize(4), utils.relSize(4));
  }

  drawNormal(time) {
    const cached = this.atTimes[time];
    // fill(0);
    if(!cached) {
      const v = createVector(0, this.radius);
      v.rotate(this.angle + time);
      this.atTimes[time] = v;
    }

    rect(this.atTimes[time].x, this.atTimes[time].y, utils.relSize(4), utils.relSize(4));
  }
}

let bois = [];
let bgColor;

function setup() {  
  utils.standardCanvas();
  r = utils.relSize(300);

  // noLoop();
  bgColor = color(255, 255, 255, 40);
  frameRate(60);
  reset();

}

function reset() {
  background(255);

  noStroke();
  fill(0);  
  bois = [];
  bois.push(new SmallBoi(0, r, true));
  for (let index = 0.1; index < 2*PI; index+= 0.1) {
    bois.push(new SmallBoi(index, r));
  }
}

function draw() {
  background(bgColor);

  translate(width/2, height/2);
  t += 0.02;

  if(t > 2*PI) {
    t = 0;
  }

  bois.forEach((b) => b.draw(t));
}


utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressed
});
