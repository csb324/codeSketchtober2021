
let gridSize;
let cubes = [];
let heightScale = 10;

const SQRT_3 = Math.sqrt(3);

class Cube {
  constructor(right, left, z) {
    this.right = right;
    this.left = left;
    this.z = z; 
    this.sideLength = width / gridSize / 2;

    // this.color = color('#9DA9A0');
    cubes.push(this);
  }

  draw() {
    const x = (width/2) + (this.right - this.left) * SQRT_3 * this.sideLength;
    const y = this.sideLength * heightScale + (this.right + this.left) * this.sideLength - (this.sideLength * this.z*2);

    if(x > width || x < -this.sideLength) {
      return;
    }

    // fill('#BAD9B5');
    // fill("#eFF7CF")
    fill('#bcd7e7');
    stroke(utils.paperColor);

    beginShape();    
    vertex(x, y); // top back corner
    vertex(x + (SQRT_3 * this.sideLength), y + this.sideLength); // top right
    vertex(x, y + this.sideLength*2); // top front
    vertex(x - (SQRT_3 * this.sideLength), y + this.sideLength); // top left
    endShape(CLOSE);

    noStroke();

    fill('#94bbd5');
    beginShape();
    vertex(x + (SQRT_3 * this.sideLength), y + this.sideLength); // top right
    vertex(x, y + this.sideLength*2); // top front
    vertex(x, y + this.sideLength * (4 + this.z)); // bottom front
    vertex(x + (SQRT_3 * this.sideLength), y + this.sideLength * (3 + this.z)); // bototm right
    endShape(CLOSE);

    fill('#6b9ec3');
    beginShape();
    vertex(x - (SQRT_3 * this.sideLength), y + this.sideLength); // top left
    vertex(x, y + this.sideLength*2); // top front
    vertex(x, y + this.sideLength * (4 + this.z)); // bottom front
    vertex(x - (SQRT_3 * this.sideLength), y + this.sideLength * (3 + this.z)); // bototm left
    endShape(CLOSE);
    
    // beginShape();

  }
}
