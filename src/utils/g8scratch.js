import p5 from 'p5';
import * as utils from '../utils';

function setup() {  
  utils.standardCanvas();
  reset();
  noLoop();
}

class CircleSquiggle {
  constructor() {
    this.points = [];

    this.colors = ['#279af1', '#f71735', '#a833b9', utils.penColor];
    this.randomnessFactor = random(0, 0.15);
    // this.randomnessFactor = 0;

    this.sortFunctions = [
      function(a, b) {
        return a.x > b.x;
      },
      function(a, b) {
        return a.y > b.y;
      },
      function(a, b) {
        return a.x+a.y > b.x+b.y;
      },
      function(a, b) {
        return (a.x - 0.5)*(a.y - 0.5) > (b.x - 0.5)*(b.y - 0.5);
      },
      function(a, b) {
        return sin(a.x * TWO_PI) > sin(b.x * TWO_PI);
      }


    ];
    this.initPoints();
    this.draw();
  }

  initPoints() {
    const howManyPoints = Math.floor(random(30, 80));
    for (let index = 0; index < howManyPoints; index++) {
      let x = random();
      this.points.push({
        x: map(cos(x * TWO_PI), -1, 1, 0.1, 0.9), 
        y: map(sin(x * TWO_PI), -1, 1, 0.1, 0.9)
      });
    }
    this.sortPoints();
  }

  sortPoints() {
    const sf = random(this.sortFunctions);
    this.points.sort((a, b) => {
      if(random() < this.randomnessFactor) {
        return -1;
      }
      if(sf(a, b)) {
        return 1;
      }
      return -1;
    });
  }

  drawPoint(p, variation) {
    const realX = utils.relSize(p.x * 1000 + random(-variation, variation));
    const realY = utils.relSize(p.y * 1000 + random(-variation, variation));
    curveVertex(realX, realY);
  }

  drawSquiggle() {

    beginShape();
    for (let index = 0; index < this.points.length; index++) {
      const element = this.points[index];
      this.drawPoint(element, 10);    
    }
    endShape();
  }

  drawShape() {
    const pointCount = Math.floor(random(3, 6));
    let shapePoints = [];
    for (let index = 0; index < pointCount; index++) {
      shapePoints.push(random(this.points));
    }

    const centerX = (shapePoints.map((p) => p.x).reduce((x, y) => x + y)) / shapePoints.length;
    const centerY = (shapePoints.map((p) => p.y).reduce((x, y) => x + y)) / shapePoints.length;


    const centerV = createVector(centerX, centerY);

    shapePoints.sort((a, b) => {
      const av = createVector(a.x, a.y);
      const bv = createVector(b.x, b.y);
      av.sub(centerV);
      bv.sub(centerV);

      if(av.heading() > bv.heading()) { return 1; }
      return -1;
    });
    // strokeWeight(utils.relSize(5));
    // point(utils.relSize(shapePoints[0].x * 1000), utils.relSize(shapePoints[0].y) * 1000);

    fill(random(this.colors));
    noStroke();
    beginShape();    
    for (let index = 0; index < shapePoints.length; index++) {
      const p = shapePoints[index];
      const realX = utils.relSize(p.x * 1000);
      const realY = utils.relSize(p.y * 1000);
      vertex(realX, realY);
    }
    endShape(CLOSE);

    // strokeWeight(5);
    // stroke(utils.penColor);
    // point(centerX * width, centerY * height);

  }

  draw() {
    let total = 20;

    push();
    while (total > 0.5) {
      let w = random(max((total)/2, 1), total);
      total = total - w;
      strokeWeight(utils.relSize(w))
      stroke(random(this.colors));
      this.drawSquiggle();
      console.log(w);
    }
    // for (let index = 0; index < squiggles; index++) {
    // }
    pop();


  }
  
}


function reset() {

}


function draw() {
  background(utils.paperColor);
  stroke(utils.penColor);
  strokeWeight(utils.relSize(1));
  noFill();
  utils.zoomOut(0.9);

  new CircleSquiggle();
  // beginShape();
  // const offset = Math.floor(random(curvePoints.length * 0.1, curvePoints.length * 0.2))
  // for (let index = 0; index < curvePoints.length * random(); index++) {
  //   const element = curvePoints[index + offset];
  //   if(element) {
  //     drawPoint(element, 10);    
  //   }
  // }
  
  // endShape();

}

const pieceName = "Single Curve";

utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});
