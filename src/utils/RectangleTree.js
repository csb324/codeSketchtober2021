import utils from ".";

class RectangleTree {
  constructor() {
    this.branches = [];
    this.iterations = Math.floor(random(6, 16));

    const startingPoint = createVector(random(width), height * random([0.05, 0.95]));
    const centerPoint = createVector(width/2, height/2);

    const startingDirection = (centerPoint.sub(startingPoint)).mult((2 / this.iterations));

    this.branchEnds = [
      {
        pointer: startingPoint,
        direction: startingDirection
      }  
    ];
    this.build();
  }

  newBranch({pointer, direction}, index) {
    let d = direction.copy();
    d.setMag(Math.abs(randomGaussian(d.mag(), width/50)));
    d.rotate(random(-0.2, 0.2));

    let end = {
      pointer: createVector(pointer.x + d.x, pointer.y + d.y),
      direction: d
    };

    let b = {
      x: pointer.x,
      y: pointer.y,
      w: d.mag(),
      h: index,
      angle: d.heading()
    }

    return {b, end};
  }

  build() {
    for (let index = this.iterations; index > 0; index--) {
      let newBranchEnds = [];
      let breakThreshold = 0.8;
      if(this.branchEnds.length == 1) {
        breakThreshold = 0.5
      }
      this.branchEnds.forEach((v) => {
        if(random() > breakThreshold) {
          const rotationAmount = random(0, PI/12);
          v.direction.rotate(rotationAmount);
          const {b, end} = this.newBranch(v, index);
          this.branches.push(b);
          newBranchEnds.push(end);        

          v.direction.rotate(-rotationAmount);
          v.direction.rotate(random(0, -PI/12));
          const nb = this.newBranch(v, index);
          this.branches.push(nb.b);
          newBranchEnds.push(nb.end);        

          console.log("I split here.");
          console.log(this.branches);
          console.log(rotationAmount);

        } else {
          const {b, end} = this.newBranch(v, index);
          this.branches.push(b);
          newBranchEnds.push(end);        
        }
      })
      this.branchEnds = newBranchEnds;
    }
  };

  drawBranch(r) {
    push();
    translate(r.x, r.y);
    rotate(r.angle);
    rect(0, 0, r.w, r.h);
    pop();
  }

  draw() {
    // rectMode(CENTER);
    noStroke();
    fill(utils.paperColor);
    this.branches.forEach((b) => this.drawBranch(b));
  };

}

export default RectangleTree;