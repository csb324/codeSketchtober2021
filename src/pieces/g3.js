
import p5 from 'p5';
import * as utils from '../utils';

const pieceName = "Genuary day 3: Droste";

const CHILD_THRESHOLD = 0.5;
const SPEED = 0.005;
const CHILD_TO_PARENT = 8;

let h;
let bgColor = utils.paperColor;

let palette = ["#8cbcb9","#ff0000","#f194b4","#ffb100","#ffebc6"]

class DrosteHouse {

  constructor(x, y, width = 0, height = 0) {

    console.log("created with: ", x, y);
    this.xStart = x;
    this.yStart = y;
    this.x = this.xStart;
    this.y = this.yStart;
    this.setStartDimensions(width, height);
    
    this.progress = 0;
    this.color = random(palette);

    this.ultimateHeight = random(750, 900);
    this.ultimateWidth = random(500, 750);

    this.ultimateBottom = 950;
    this.ultimateTop = this.ultimateBottom - this.ultimateHeight;
    this.ultimateLeft = (1000 - this.ultimateWidth) / 2;
    this.ultimateRight = 1000 - this.ultimateLeft;

    this.child = false;
  }

  setStartDimensions(width, height) {
    this.widthStart = width;
    this.heightStart = height;

    this.xStart = this.x;
    this.yStart = this.y;
  }

  setRatio(parentWidth, parentHeight) {
    this.xRatio = this.widthStart / parentWidth;
    this.yRatio = this.heightStart / parentHeight;
  }

  update() {
    this.progress += SPEED;

    this.setDimensions();
    this.createChild();
  }

  updateTo(w, h) {
    this.width = this.xRatio * w;
    this.height = this.yRatio * h;

    this.x = this.xStart - (this.width/2);
    this.y = this.yStart - this.height/2;
  }

  createChild() {    
    if(!this.child && this.progress > CHILD_THRESHOLD) {
      this.child = new DrosteHouse(
        random(this.width) + this.x, 
        random(this.height) + this.y, 
        random(this.width/CHILD_TO_PARENT), 
        random(this.height/CHILD_TO_PARENT)
      );

      this.child.setRatio(this.width, this.height);
    }
  }

  coversWholeScreen() {
    return (this.y + this.height > 1000 && this.x + this.width > 1000 && this.x < 0 && this.y < 0)
  }

  handOff() {
    if(this.coversWholeScreen()) {
      bgColor = this.color;

      this.child.setStartDimensions(this.child.width, this.child.height);

      return this.child;
    } else {
      return false;
    }
  }

  setDimensions() {
    this.height = map(this.progress, 0, 1, this.heightStart, this.ultimateHeight);
    this.width = map(this.progress, 0, 1, this.widthStart, this.ultimateWidth);

    // this.x = this.xStart - (this.width/2);
    // this.y = this.yStart - this.height/2;

    this.x = map(this.progress, 0, 1, this.xStart, this.ultimateLeft);
    this.y = map(this.progress, 0, 1, this.yStart, this.ultimateTop);
  }

  draw() {
    fill(this.color);

    rect(
      utils.relSize(this.x),
      utils.relSize(this.y),
      utils.relSize(this.width),
      utils.relSize(this.height)
    );

    if(this.child) {
      this.child.updateTo(this.width, this.height);
      this.child.draw();
    }
  }
}

function setup() {  
  utils.standardCanvas();
  h = new DrosteHouse(500, 500);
  reset();
}

function reset() {
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
  