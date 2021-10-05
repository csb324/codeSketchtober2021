import p5 from 'p5';
import * as utils from '../utils';

// we are straight up starting over.
const penColor = '#111111';
const paperColor = '#efefef';
let upVector;
let trees = [];
let TREE_STEPS = 40;
let gridSize;
let padding;

function setup() {  
  utils.standardCanvas();
  padding = utils.relSize(50);


  reset();
  noLoop();

}

function reset() {
  clear();
  background(paperColor);
  gridSize = floor(random(1, 4));

  TREE_STEPS = 80 / gridSize;

  const h = height - padding;
  const w = width - padding;  
  upVector = createVector(0, -1);
  upVector.setMag(h / TREE_STEPS / gridSize);
  upVector.mult(0.75);

  trees = [];
  // trees.push(new Tree(width/2, height - padding, upVector, 0));

  for (let x = 0; x < gridSize; x++) {
    const xDimension = (x+0.5) * (w/gridSize) + (padding / 2);

    for (let y = 0; y < gridSize; y++) {
      const yDimension = (y+1) * (h/gridSize);
      trees.push(new Tree(xDimension, yDimension, upVector, 0));
    
    }
  }

}


class Tree {
  constructor(x, y, startVector, depth) {
    this.rootX = x;
    this.rootY = y;

    const startHeading = startVector.heading();
    let newHeading = startHeading - (PI/2);
    newHeading /= 2;

    this.startVector = startVector.copy().setHeading(newHeading);

    this.depth = depth;
    this.cursor = createVector(x, y);
    this.children = [];

  }

  draw() {
    strokeWeight(utils.relSize(1));
    const r = random(10);
    const rotationRange = PI/2;
   
    console.log(upVector.heading());
    console.log(this.startVector.heading());
    for (let index = TREE_STEPS; index > 0; index--) {
      let direction = this.startVector.copy();
      const a = direction.angleBetween(upVector);

      const leftRotation = a + rotationRange;
      const rightRotation = a - rotationRange;

      direction.rotate(
        map(
          noise(index/80, r + this.depth), 
          0, 1, 
          leftRotation, rightRotation
        )        
      );


      line(this.cursor.x, this.cursor.y, this.cursor.x+direction.x, this.cursor.y + direction.y)
      this.moveForward(direction);
      this.branch(direction, index);
    }

    if(this.children.length) {
      this.children.forEach((c) => c.draw());
    }
  }

  moveForward(direction) {
    this.cursor.add(direction);
  }

  branch(direction, index) {
    let threshold = (this.depth + this.children.length > 1) ? 0.98 : 0.9;

    if(this.children.length > 4 || this.depth > 3) {
      threshold = 1;
    }

    if(random() > threshold) {
      let newTree = new Tree(
        this.cursor.x, this.cursor.y,
        direction.copy().mult(index/TREE_STEPS).mult(random(0.8, 1.2)),
        this.depth + 1
      );
      this.children.push(newTree);
    }
  }
}


function draw() {
  fill(paperColor);
  translate(width/2, height/2);
  scale(0.9, 0.9);
  translate(-width/2, -height/2);

  rect(0, 0, width, height);
  trees.forEach((t) => {
    t.draw();
  })
}


utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressed
});
