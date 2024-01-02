
import p5 from 'p5';
import * as utils from '../utils';

const pieceName = "#WCCChallenge: Arabesque";

function setup() {  
  utils.standardCanvas();
  reset();
  noLoop();
}

function reset() {
  background(utils.paperColor);
  fill(random(55) + 100);    
}

class Curl {
  constructor(mag, angle, startPoint, level = 0) {
    this.cursor = createVector(startPoint.x, startPoint.y);
    this.mag = mag;
    this.magFactor = random(0.8, 0.95);
    this.angleFactor = random(0.4, 0.6);
    this.angle = angle;
    this.level = level;
    this.anglePolarity = (level % 2 == 0) ? 1 : -1;
  }

  draw() {
    stroke(utils.penColor);
    fill(utils.paperColor);
    strokeWeight(utils.relSize(1));
    
    beginShape();
    vertex(this.cursor.x, this.cursor.y);
    const children = [];

    const points = 10 * (7 - this.level);
    for (let index = 0; index < points; index++) {
      let step = this.drawStep();
      if(step) {
        children.push(step);
      }
    }
    endShape();

    children.forEach((c) => c.draw());
  }

  drawStep() {
    curveVertex(this.cursor.x, this.cursor.y);

    let newCurl = false;
    if(random() > 0.9 && this.level < 3) {
      newCurl = new Curl(this.mag * (random(0.95, 1.2)), this.angle - (2 * this.angleFactor * this.anglePolarity), this.cursor, this.level + 1);
    }

    const newDirection = createVector(1, 0);
    newDirection.setMag(this.mag);
    newDirection.setHeading(this.angle);
    this.cursor.add(newDirection);
    
    this.mag *= 0.9;
    this.angle += (this.angleFactor * this.anglePolarity);

    return newCurl;
  }
}

function draw() {
  utils.zoomOut(0.8);
  const c = new Curl(height/2, 0, {x: -width/4, y: -height/4});
  c.draw();
}


utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});  
  