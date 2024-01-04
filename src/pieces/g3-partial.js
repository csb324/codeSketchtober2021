
import p5 from 'p5';
import * as utils from '../utils';
import wiggleLine from '../utils/wiggleLine';

const pieceName = "Genuary day 3: Droste";

const CHILD_THRESHOLD = 0.5;

const SPEED = 0.005;
const ASPECT_RATIO = 1 / 0.8;

let h;
let bgColor;
let palette;

class DrosteHouse {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.aspectRatio = ASPECT_RATIO;
    this.progress = 0;

    this.figureOutFinals();
    utils.shuffleArray(palette);
    this.color = palette.pop();

    if(palette.length < 1) {
      console.log("AAAA OMG");
      console.log(palette);
    }
    this.child = false;

    this.wiggleSeed = this.x;

    this.frameThickness = random(0.03, 0.25);
  }

  figureOutFinals() {
    let longerXDistance = this.x;
    let longerYDistance = this.y;
    if(this.x < 500) {
      longerXDistance = (1000 - this.x);
    }
    if(this.y < 500) {
      longerYDistance = (1000 - this.y);
    }
    
    this.ultimateWidth = longerXDistance * 2;
    this.ultimateHeight = longerYDistance * 2;

    if(this.ultimateHeight < (this.ultimateWidth * ASPECT_RATIO)) {
      this.ultimateHeight = this.ultimateWidth * ASPECT_RATIO
    } else {
      this.ultimateWidth = this.ultimateHeight / ASPECT_RATIO;
    }
  }

  setDimensions(progress) {
    this.progress = progress;
    this.height = map(progress, 0, 1, 0, this.ultimateHeight);
    this.width = map(progress, 0, 1, 0, this.ultimateWidth);

    if(this.child) {
      this.child.setDimensions((progress - CHILD_THRESHOLD) * CHILD_THRESHOLD);
    }
  }

  update() {
    this.setDimensions(this.progress + SPEED);
    this.createChild();
  }

  createChild() {    
    if(!this.child && this.progress > CHILD_THRESHOLD) {

      const childXMin = Math.max(this.x - (this.width/2), 0);
      const childXMax = Math.min(this.x + (this.width/2), 1000);
      const childYMin = Math.max(this.y - (this.height/2), 0);
      const childYMax = Math.min(this.y + (this.height/2), 1000);

      const childXCenter = (childXMin + childXMax)/2;
      const childYCenter = (childYMin + childYMax)/2;

      this.child = new DrosteHouse(
        randomGaussian(childXCenter, 100),
        randomGaussian(childYCenter, 100)
      );
    }
  }

  handOff() {
    if(this.progress > 1.5) {
      bgColor = this.color;
      palette.push(bgColor);

      return this.child;
    } else {
      return false;
    }
  }

  draw() {
    noStroke();
    fill(this.color);

    push();
    translate(
      utils.relSize(this.x - (this.width/2)), 
      utils.relSize(this.y - (this.height/2))
    );
    // house frame
    rect(
      0, 
      0,
      utils.relSize(this.width),
      utils.relSize(this.height)
    );

    stroke(utils.penColor);
    strokeWeight(utils.relSize(3));
    noFill();

    randomSeed(this.wiggleSeed);

    const currentFrameThickness = utils.relSize(this.width * this.frameThickness);

    this.wiggleBox(0, 0, utils.relSize(this.width), utils.relSize(this.height));
    this.wiggleBox(currentFrameThickness, currentFrameThickness, 
      utils.relSize(this.width) - currentFrameThickness, utils.relSize(this.height) - currentFrameThickness);

    translate(currentFrameThickness, utils.relSize(this.height) - currentFrameThickness);
    this.wiggleBox(0, 0, utils.relSize(200) * this.progress, utils.relSize(this.height));

    pop();

    if(this.child) {
      this.child.draw();
    }
  }

  wiggleBox(x1, y1, x2, y2) {
    wiggleLine(x1, y1, x1, y2);
    wiggleLine(x1, y1, x1, y2);

    wiggleLine(x2, y1, x2, y2);
    wiggleLine(x2, y1, x2, y2);

    wiggleLine(x1, y1, x2, y1);
    wiggleLine(x1, y1, x2, y1);

    wiggleLine(x1, y2, x2, y2);
    wiggleLine(x1, y2, x2, y2);
  }
}










function setup() {  
  utils.standardCanvas();
  reset();
}

function reset() {
  palette = ["#8cbcb9","#ff0000","#f194b4","#ffb100","#ffebc6"]
  bgColor = utils.paperColor;
  h = new DrosteHouse(500, 500);

}

function draw() {
  fill(bgColor);
  rect(0, 0, utils.relSize(1000), utils.relSize(1000));

  h.update();
  h.draw();

  h = h.handOff() || h;

}


utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});  
  