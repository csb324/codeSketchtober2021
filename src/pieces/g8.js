import p5 from 'p5';
import * as utils from '../utils';

function setup() {  
  utils.standardCanvas();
  reset();
  noLoop();
}

class Squiggle {
  constructor() {
    this.points = [];
    this.addColors();
    this.addVariables();
    this.initPoints();
    this.draw();
  }

  addVariables() {};

  addColors() {
    this.colors = ['#279af1', '#f71735', '#a833b9', utils.penColor];
  }

  initPoints() {
    const howManyPoints = Math.floor(random(30, 80));
    for (let index = 0; index < howManyPoints; index++) {
      let x = index / howManyPoints;
      this.points.push({
        x: map(cos(x * TWO_PI), -1, 1, 0.1, 0.9), 
        y: map(sin(x * TWO_PI), -1, 1, 0.1, 0.9)
      });
    }
    // this.sortPoints();
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


  draw() {
    let total = 20;
    push();
    while (total > 0.5) {
      let w = random(max((total)/2, 1), total);
      total = total - w;
      strokeWeight(utils.relSize(w))
      stroke(random(this.colors));
      this.drawSquiggle();
    }
    pop();
  }  

}

class FlowerSquiggle extends Squiggle {

  addColors() {
    const c = color(utils.penColor);
    c.setAlpha(200);
    this.colors = [c];
  }

  addVariables() {
    const possibleCenters = [
      {x: 0.5, y:0.5},
      {x: 0.5, y:0.8},
      {x: random(0.4, 0.6), y:0.5},
      {x: random(0.4, 0.6), y:0.5},
      {x: random(0.4, 0.6), y:0.5},
      {x: random(0.4, 0.6), y:0.5},
      {x: random(0.4, 0.6), y: random(0.5, 0.8)},
      {x: random(0.4, 0.6), y: random(0.5, 0.8)},
      {x: random(0.4, 0.6), y: random(0.5, 0.8)},
      {x: random(0.4, 0.6), y: random(0.5, 0.8)}      
    ]
    this.center = random(possibleCenters);

  }

  addFlower() {
    const howManyPoints = Math.floor(random(15, 40));

    for (let index = 0; index < howManyPoints; index++) {
      let x = random(0.9, 1.1) * (index/howManyPoints);
      this.points.push({
        x: map(cos(x * TWO_PI), -1, 1, 0.1, 0.9), 
        y: map(sin(x * TWO_PI), -1, 1, 0.1, 0.9)
      });

      if(random() > 0.6) {
        this.points.push(this.center)
      }
    }

  }

  initPoints() {
    this.points.push(this.center)
    this.addFlower();
    this.addStem();

    const reversed = [...this.points].reverse();
    // console.log(this.points.length);
    this.points = this.points.concat(reversed);
    // console.log(this.points.length);
    this.addFlower();


    // this.points = this.points.concat(this.points);
  }
  addStem() {
    this.points.push(this.center)
    this.points.push({
      x: random(0.4, 0.6), y: random(0.5, 1.3)
    })
    this.points.push({x: 0.5, y:1.5})
    this.points.push({x: 0.5, y:1.5})
    // this.points.push({x: 0.5, y:2})
  }

  addBorder() {
    this.points.push({x: -0.5, y: 1.5});
    this.points.push({x: -0.5, y: 1.5});
    this.points.push({x: -0.5, y: -0.5});
    this.points.push({x: -0.5, y: -0.5});
    
    this.points.push({x: 1.5, y: -0.5});
    this.points.push({x: 1.5, y: 1.5});
    
    this.points.push({x: -0.5, y: 1.5});
  }

  draw() {
    this.drawSquiggle();

    // let total = 20;
    // push();
    // while (total > 0.5) {
      for (let index = 0; index < 4; index++) {
      }
      // let w = random(max((total)/2, 1), total);
      // total = total - w;
      // strokeWeight(utils.relSize(w))
      // stroke(random(this.colors));
    // }
    // pop();
  }  

}

class CircleSquiggle extends Squiggle {
  constructor() {
    super();
  }

  addVariables() {
    this.randomnessFactor = random(0, 0.15);
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


}



function reset() {
}


function draw() {
  background(utils.paperColor);
  stroke(utils.penColor);
  strokeWeight(utils.relSize(1));
  noFill();
  translate(0, utils.relSize(-100))
  utils.zoomOut(0.4);
  new FlowerSquiggle();
  utils.zoomOut((1/0.4));
  // strokeWeight(utils.relSize(10));
  rect(utils.relSize(50), utils.relSize(150), utils.relSize(900), utils.relSize(900), 4)
}

const pieceName = "Single Curve";

utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});
