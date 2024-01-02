
import p5 from 'p5';
import * as utils from '../../utils';

const pieceName = "Genuary day 27: #2E294E #541388 #F1E9DA #FFD400 #D90368";


let colors = ['#F1E9DA','#2E294E','#541388','#FFD400','#D90368'];
let paintColors;
function setup() {  
  utils.standardCanvas();
  colors = colors.map((c) => color(c));  
  reset();
  noLoop();
}


class PaintStroke {
  constructor(c, i) {
    this.c = c;
    this.colorSet = this.initColors();
    this.c.setAlpha(170);

    this.bristleCount = random(90);
    // this.bristleCount = 1;
    this.tipRadius = utils.relSize(random(20, 100));
    this.index = i;

    this.width = utils.relSize(random(40, 100));

    this.spread = utils.relSize(random(2, 10));
    this.maxWeight = random(8, 20);

    console.log(this);
  }

  initColors() {
    const r = this.c._getRed();
    const g = this.c._getGreen();
    const b = this.c._getBlue();

    const numOptions = 10;
    let options = [];

    for (let index = 0; index < numOptions; index++) {
      let v = randomGaussian(0, 5);

      let r1 = r + v + randomGaussian(0, 2);
      let g1 = g + v + randomGaussian(0, 2);
      let b1 = b + v + randomGaussian(0, 2);
      let c = color([r1, g1, b1]);
      c.setAlpha(200);
      options.push(c); 
    }
    return options;
  }

  getChange(y, x) {
    const changePotential = utils.relSize(30);

    let xChange = noise(y/100, x, this.index);

    xChange = map(xChange, 0, 1, -changePotential, changePotential);
    // console.log("line 63:", xChange);
    return xChange;
  }

  drawBristle(i) {
    const distanceToCover = this.width;

    let x = map(i, 0, this.bristleCount - 1, -distanceToCover, distanceToCover);
    if (isNaN(x)) {
      console.log("resetting x");
      x = 0;
    }
    i += 0.5;
    let yOffset = map(i, 0, this.bristleCount, 0, PI);
    yOffset = (1 - sin(yOffset)) * this.tipRadius * random(0.5, 1.5);

    const minY = yOffset;
    const maxY = height - yOffset;

    const steps = 400;


    // line(x, yOffset, x, height - yOffset);
    
    for (let index = 1; index < steps; index++) {
      stroke(random(this.colorSet));
      let r = utils.relSize(random(2, this.maxWeight));    
      strokeWeight(r);
  
      let yPos = map(index, 0, steps, minY, maxY);
      let x1 = x + this.getChange(index, i);
      let xPos = randomGaussian(x1, this.spread);
      console.log(x1);
      yPos = randomGaussian(yPos, this.spread);
      point(xPos, yPos);

    }

  }

  draw() {
    // noFill();

    for (let i = 0; i < this.bristleCount; i++) {
      this.drawBristle(i)
    }

  }
}


function reset() {
  clear();
  paintColors = colors.slice(1);
  utils.shuffleArray(paintColors);

  // colors[0].setAlpha(255);
}

function draw() {
  background(colors[0]);
  utils.zoomOut(0.8);

  for (let index = 0; index < paintColors.length / 2; index++) {
    const c = paintColors[index];
    push();
    const x = map(index, 0, 1, utils.relSize(300), utils.relSize(700));
    translate(x, 0);
    const ps = new PaintStroke(c, index);
    ps.draw();
    pop();
  }

  translate(width/2, height/2);
  rotate(PI/2);
  translate(-width/2, -height/2);

  for (let index = 0; index < paintColors.length / 2; index++) {
    const c = paintColors[index + 2];
    push();
    const x = map(index, 0, 1, utils.relSize(300), utils.relSize(700));
    translate(x, 0);
    const ps = new PaintStroke(c, index);
    ps.draw();
    pop();
  }

  rotate(random([0, PI/2]))

}


utils.attach({
  setup,
  draw,
  mouseReleased: utils.standardMouseReleasedFactory(reset),
  keyPressed: utils.standardKeyPressedFactory(pieceName)
});  
  