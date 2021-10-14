// a chain of blocks but not blockchain 

import p5 from 'p5';
import * as utils from '../utils';

const penColor = '#111111';
const paperColor = '#efefef';


function setup() {  
  utils.standardCanvas();
  reset();
  noLoop();
}

class MapForWalking {
  constructor(gridSize) {
    this.gridSize = gridSize;
    this.grid = this.initGrid();
    this.pointer = {
      x: floor(gridSize/2),
      y: floor(gridSize/2)
    };
    this.lastPointer = this.pointer;
    this.blocksPerChain = floor(random(2, 4))
    this.sizeVariance = random(0.01, 0.4);
  }

  initGrid() {
    let grid = [];

    for (let xIndex = 0; xIndex < this.gridSize; xIndex++) {      
      let r = [];
      for (let yIndex = 0; yIndex < this.gridSize; yIndex++) {
        r.push(false);
      }
      grid.push(r);
    }

    return grid;
  }

  isValid(pointer) {
    if(pointer.x < 0 || pointer.y < 0) {
      return false;
    }
    if(pointer.x >= this.gridSize || pointer.y >= this.gridSize) {
      return false;
    }
    console.log("checking for real now");
    console.log(pointer);

    return !this.grid[pointer.x][pointer.y];
  }

  markFilled(x, y) {
    this.grid[x][y] = true;
  }

  pointerOptions() {
    let options = [
      {
        x: this.pointer.x + 1,
        y: this.pointer.y,
        direction: 'right'
      },
      {
        x: this.pointer.x - 1,
        y: this.pointer.y,
        direction: 'left'
      },
      {
        x: this.pointer.x,
        y: this.pointer.y + 1,
        direction: 'down'
      },
      {
        x: this.pointer.x,
        y: this.pointer.y - 1,
        direction: 'up'
      }
    ];

    return options.filter((p) => {
      return this.isValid(p);
    });
  }

  setNextStep() {
    let options = this.pointerOptions();

    if(options.length == 0) {
      this.pointer = false;
      return;
    }

    this.lastPointer = this.pointer;
    this.pointer = random(options);
    this.pointer.sizeVariance = random(0.5 - this.sizeVariance, 0.5 + this.sizeVariance);
  }

  draw() {    
    while(this.pointer) {
      this.markFilled(this.pointer.x, this.pointer.y);
      // this.drawLine();
      this.drawChain();
      this.setNextStep();
    }
  }

  drawChain() {
    const blockSize = (width/this.gridSize) / this.blocksPerChain * this.lastPointer.sizeVariance;
    let nextBlockSize = blockSize;

    const next = createVector(this.pointer.x, this.pointer.y);
    next.sub(createVector(this.lastPointer.x, this.lastPointer.y));
    next.div(this.blocksPerChain);

    let x = this.lastPointer.x;
    let y = this.lastPointer.y;

    for (let i = 0; i < this.blocksPerChain; i++) {
      let miniNext = next.copy();
      if(i == (this.blocksPerChain - 1)) {
        miniNext = this.pointer;
        nextBlockSize = (width/this.gridSize) / this.blocksPerChain * this.pointer.sizeVariance;
      } else {
        miniNext.rotate(random(-0.4, 0.4));
        miniNext.add(createVector(x, y));  
      }

      // stroke(penColor);
      strokeWeight(map(this.gridSize, 0, 15, utils.relSize(4), utils.relSize(0.5)));

      // next.add(createVector(x+blockSize, y+blockSize));
      switch (this.pointer.direction) {
        case 'up':
          line(
            this.pointerToCoord(x), 
            this.pointerToCoord(y) - (blockSize / 2), 
            this.pointerToCoord(miniNext.x),
            this.pointerToCoord(miniNext.y) + (nextBlockSize / 2)
          );
          
          break;
        case 'down':
          line(
            this.pointerToCoord(x), 
            this.pointerToCoord(y) + (blockSize / 2), 
            this.pointerToCoord(miniNext.x),
            this.pointerToCoord(miniNext.y) - (nextBlockSize / 2)
          );

          break;
        case 'left':
          line(
            this.pointerToCoord(x) - (blockSize / 2), 
            this.pointerToCoord(y), 
            this.pointerToCoord(miniNext.x) + (nextBlockSize / 2),
            this.pointerToCoord(miniNext.y)
          );

          break;
        
        case 'right':
          line(
            this.pointerToCoord(x) + (blockSize / 2), 
            this.pointerToCoord(y), 
            this.pointerToCoord(miniNext.x) - (nextBlockSize / 2),
            this.pointerToCoord(miniNext.y)
          );

          break;
        
          
        default:
          line(
            this.pointerToCoord(x), 
            this.pointerToCoord(y), 
            this.pointerToCoord(miniNext.x), 
            this.pointerToCoord(miniNext.y)
          );
    
          break;
      }
      

      noFill();
      stroke(penColor);
      strokeWeight(utils.relSize(1));

      const shadow = {x: this.pointerToCoord(x) - (blockSize/8), y: this.pointerToCoord(y) + (blockSize/8)};
      rect(shadow.x, shadow.y, blockSize);

      push();
      translate(-blockSize/2, -blockSize/2);
      line(this.pointerToCoord(x), this.pointerToCoord(y), shadow.x, shadow.y);
      line(this.pointerToCoord(x), this.pointerToCoord(y) + blockSize, shadow.x, shadow.y + blockSize);
      line(this.pointerToCoord(x) + blockSize, this.pointerToCoord(y) + blockSize, shadow.x + blockSize, shadow.y + blockSize);
      pop();

      if(random() > 0.9) {
        fill(random(['#05668d', '#f49f0a', '#d10000']))
      } else {
        fill(penColor);
      }


      rect(this.pointerToCoord(x), this.pointerToCoord(y), blockSize);


      x = miniNext.x;
      y = miniNext.y;      
    }

      // if (x > width || y > height || i > 100) {
      //   keepGoing = false;
      // }
  }

  pointerToCoord(num) {
    const factor = width / this.gridSize;    
    return (num + 0.5) * factor;
  }

  drawLine() {
    stroke('green');
    line(
      this.pointerToCoord(this.lastPointer.x), 
      this.pointerToCoord(this.lastPointer.y), 
      this.pointerToCoord(this.pointer.x), 
      this.pointerToCoord(this.pointer.y), 
    );
  }
  
}



function reset() {
  rectMode(CENTER);
  // generateBlocks();
}

function draw() {
  background(paperColor);
  fill(penColor);
  stroke(penColor);
  strokeWeight(utils.relSize(3));

  utils.zoomOut(0.8);
  const m = new MapForWalking(floor(random(3, 12)));
  m.draw();

}


utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressed
});
